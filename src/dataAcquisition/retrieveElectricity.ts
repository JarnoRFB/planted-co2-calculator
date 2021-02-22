import axios from "axios"
import cheerio from "cheerio"
import {pipe} from "fp-ts/function"
import {promises as fs} from "fs"
import {resolve} from "path"

const url =
  "https://www.stromspiegel.de/stromverbrauch-verstehen/stromverbrauch-im-haushalt/#c120951"

interface ElectricityConsumption {
  householdSize: number
  consumptionInkWhPerYear: number
  consumptionInkWhPerYearWithElectricWarmWater: number
}

interface ElectricityConsumptionEntry extends ElectricityConsumption {
  housing: string
}

const retrieveData = async () => {
  const ax = axios.create()

  const res = await ax.get(url)
  const html = res.data
  const $ = cheerio.load(html)

  const parseHouseholdSize = (s: string) => parseInt(s.slice(0, 1))
  const parseConsumption = (s: string) => parseFloat(s.replace(" kWh/Jahr", "").replace(".", ""))

  const parseTable = (node: cheerio.Cheerio): ElectricityConsumption[] =>
    $("tbody tr", node)
      .toArray()
      .map(row => {
        return $("td ", row)
          .toArray()
          .map(cell => $(cell).text())
      })
      .map(
        ([
          householdSizeText,
          consumptionInkWhPerYearStr,
          consumptionInkWhPerYearWithElectricWarmWaterStr,
        ]) => ({
          householdSize: parseHouseholdSize(householdSizeText),
          consumptionInkWhPerYear: parseConsumption(consumptionInkWhPerYearStr),
          consumptionInkWhPerYearWithElectricWarmWater: parseConsumption(
            consumptionInkWhPerYearWithElectricWarmWaterStr,
          ),
        }),
      )

  const addHousingEntry = (housing: string) => <T>(data: T[]) =>
    data.map(row => ({housing, ...row}))

  const houseConsumption: ElectricityConsumptionEntry[] = pipe(
    $("div #c120959"),
    parseTable,
    addHousingEntry("house"),
  )
  const apartmentConsumption: ElectricityConsumptionEntry[] = pipe(
    $("div #c120961"),
    parseTable,
    addHousingEntry("apartment"),
  )

  const consumptionData = houseConsumption.concat(apartmentConsumption)

  console.log(consumptionData)

  await fs.writeFile(
    resolve(__dirname, "../../src/lib/estimation/electricity/data.json"),
    JSON.stringify(consumptionData, null, 2),
    {
      encoding: "utf-8",
    },
  )
}

retrieveData().then(_ => console.log("done"))
