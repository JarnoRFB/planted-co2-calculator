// Base carbon footprint, when living in a particular country.
import {EstimationResponse, Units} from ".."
import {ValidUntilSource} from "../sources"
import _ from "lodash"
import * as t from "io-ts"

enum Countries {
  GERMANY = "Germany",
}

const CountriesType: {
  [key: string]: null
} = Object.values(Countries).reduce((acc, x) => Object.assign(acc, {[x]: null}), {})

export const BaseEstimationParams = t.type({
  country: t.readonly(t.keyof(CountriesType)),
})

export type BaseEstimationParams = t.TypeOf<typeof BaseEstimationParams>

const averageWeightedEmissionsPerPerson = new ValidUntilSource<Map<string, number>>(
  new Map([
    ["Heizung", 1668.4],
    ["Baden und Duschen", 237.9],
    ["Waschen und Trocknen von Wäsche", 65.7],
    ["Kühlen/ Gefrieren, Kochen und Geschirrspülen", 787.5],
    ["Beleuchtung", 106],
    ["Mediennutzung", 48.5],
    ["Sauna", 7.8],
    ["Alltagsmobilität", 1143.3],
    ["Urlaubsreisen", 256.5],
    ["Nahrungsmittel", 511.9],
    ["Kleidung", 152.1],
    ["Betrieb von Aquarien", 2.5],
    ["Haustierfutter", 139],
  ]),
  "https://www.umweltbundesamt.de/publikationen/repraesentative-erhebung-von-pro-kopf-verbraeuchen",
  {
    en: {title: ""},
    de: {
      title: `Die Daten wurden aus den Tablellen in Anhang A entnommen.
Dabei wurde jeweils der Wert der Spalte "Emissionen [kgCO2e/a] Person, Gewichtet" und der Zeile "Bev. ∅" entnommen.`,
    },
  },
  new Date("2021-12-25"),
)

const averageEmissionsPerPersonWithoutFlights = new ValidUntilSource<number>(
  Math.round((10.88 - 0.85) * 1000),
  "https://www.klimaktiv.de/media/docs/Studien/20642110_uba_die_co2-bilanz_des_buergers.pdf",
  {
    en: {title: ""},
    de: {
      title: `Die Daten wurden aus Tabelle 2, S.10 entnommen.
Dabei wurden die Gesamtemissionen abzüglich der Emissionen für Flüge berechnet.`,
    },
  },
  new Date("2021-12-25"),
)

const baseRates = new Map()
const totalAverageWeightedEmissionsPerPerson = _.sum([
  ...averageWeightedEmissionsPerPerson.value.values(),
])
baseRates.set(Countries.GERMANY, averageEmissionsPerPersonWithoutFlights.value)
// https://www.klimaktiv.de/media/docs/Studien/20642110_uba_die_co2-bilanz_des_buergers.pdf

export const estimateEmissions = (req: BaseEstimationParams): EstimationResponse => {
  const country = req.country
  if (baseRates.has(country)) {
    const baseRate = baseRates.get(country)
    return {
      estimatedEmissions: baseRate,
      unit: Units.KG_CO2E_PER_YEAR,
      sources: [averageWeightedEmissionsPerPerson.toJson()],
    }
  } else {
    throw new Error(`No data for base rate in county ${country}`)
  }
}
