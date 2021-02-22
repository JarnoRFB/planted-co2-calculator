import {pipe} from "fp-ts/function"
import {promises as fs} from "fs"
import {resolve} from "path"

import {log} from "console"
const url = "http://energieberatung.ibs-hlk.de/eb_begr.htm"

interface NumberRange {
  low: number
  high: number
}

interface HeatingDataEntry {
  yearRange: NumberRange
  specificHeatDemand: number
}

interface HeatingData {
  yearRange: NumberRange
  specificHeatDemandRange: NumberRange
}

const rawData = [
  ["bis 1977", "280...360"],
  ["1977 - 1983", "200...260"],
  ["1984 - 1994", "140...180"],
  ["1995 - 2001", "100...120"],
  ["2002 - (EnEV)", "70...80"],
]

const parseYearRange = (s: string): NumberRange => {
  switch (s) {
    case "bis 1977":
      return {low: 0, high: 1977}
    default: {
      const [low, high] = s.split(" - ").map(n => (n.includes("EnEV") ? 2030 : Number(n)))
      return {low, high}
    }
  }
}

const parseSpecificHeatDemandRange = (s: string): NumberRange => {
  const [low, high] = s.split("...").map(Number)
  return {low, high}
}

const parseData = (table: string[][]): HeatingData[] =>
  table.map(([buildingYearRangeStr, specificHeatDemandRangeStr, ...rest]) => ({
    yearRange: parseYearRange(buildingYearRangeStr),
    specificHeatDemandRange: parseSpecificHeatDemandRange(specificHeatDemandRangeStr),
  }))

const computeMean = (data: HeatingData[]): HeatingDataEntry[] =>
  data.map(({yearRange, specificHeatDemandRange}) => ({
    yearRange,
    specificHeatDemand: (specificHeatDemandRange.low + specificHeatDemandRange.high) / 2,
  }))

const retrieveData = async () => {
  const data: HeatingDataEntry[] = pipe(rawData, parseData, computeMean)

  log(data)

  await fs.writeFile(
    resolve(__dirname, "../../src/lib/estimation/heating/specificHeatDemandByYear.json"),
    JSON.stringify(data, null, 2),
    {
      encoding: "utf-8",
    },
  )
}

retrieveData().then(_ => log("done"))
