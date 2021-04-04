import co2eq from "@tmrow/bloom-contrib/co2eq"
import {Estimate, ValidUntilSource} from "../sources"
import {EstimationResponse, Units} from ".."
import * as t from "io-ts"

const [
  ingredientsCarbonModel,
  mealCarbonModel,
  carCarbonModel,
  flightCarbonModel,
  transportationCarbonModel,
  energyCarbonModel,
  hotelCarbonModel,
  purchaseCarbonModel,
  electricityWorldAverageCarbonModel,
] = co2eq

export const FlyingEstimationParams = t.type({
  nShortHauls: t.readonly(t.number),
  nMediumHauls: t.readonly(t.number),
  nLongHauls: t.readonly(t.number),
})

export type FlyingEstimationParams = t.TypeOf<typeof FlyingEstimationParams>

const durationOfShortHaulFlight = new ValidUntilSource<string>(
  "<3 h",
  "https://www.pointhacks.com.au/differences-short-medium-long-haul-flights/",
  {
    en: {title: "durations which count as short haul flights"},
    de: {title: "Dauer eines Kurzstreckenflugs"},
  },
  new Date("2021-12-25"),
)

const durationOfMediumHaulFlight = new ValidUntilSource<string>(
  "3-6 h",
  "https://www.pointhacks.com.au/differences-short-medium-long-haul-flights/",
  {
    en: {title: "durations which count as medium haul flights"},
    de: {title: "Dauer eines Mittelstreckenflugs"},
  },
  new Date("2021-12-25"),
)

const durationOfLongHaulFlight = new ValidUntilSource<string>(
  "6 - 12 h",
  "https://www.pointhacks.com.au/differences-short-medium-long-haul-flights/",
  {
    en: {title: "durations which count as long haul flights"},
    de: {title: "Dauer eines Langstreckenflugs"},
  },
  new Date("2021-12-25"),
)

const averageShortHaulFlightDistance = Estimate.of(
  new ValidUntilSource<number>(
    (1100 + 1500) / 2,
    "https://en.wikipedia.org/wiki/Flight_length",

    {
      en: {title: "average distance of short haul flight (km)"},
      de: {title: "Mittlere Distanz eines Kurzstreckenflugs (km)"},
    },
    new Date("2021-12-25"),
  ),
)

const averageLongHaulFlightDistance = Estimate.of(
  new ValidUntilSource<number>(
    (4100 + 4800) / 2,
    "https://en.wikipedia.org/wiki/Flight_length",
    {
      en: {title: "average distance of long haul flight (km)"},
      de: {title: "Mittlere Distanz eines Kurzstreckenflugs (km)"},
    },
    new Date("2021-12-25"),
  ),
)

const averageMediumHaulFlightDistance = Estimate.of(
  new ValidUntilSource<number>(
    averageShortHaulFlightDistance.value +
      (averageLongHaulFlightDistance.value - averageShortHaulFlightDistance.value) / 2,
    "https://en.wikipedia.org/wiki/Flight_length",
    {
      en: {title: "average distance of medium haul flight (km)"},
      de: {title: "Mittlere Distanz eines Mittelstreckenflugs (km)"},
    },
    new Date("2021/12/25"),
  ),
)

const estimationMethods = new ValidUntilSource(
  null,
  "https://www.myclimate.org/fileadmin/user_upload/myclimate_-_home/01_Information/01_About_myclimate/09_Calculation_principles/Documents/myclimate-flight-calculator-documentation_EN.pdf",
  {
    en: {title: "Methods for calculating flight emissions"},
    de: {title: "Methoden der Flugemissionsberechnung"},
  },
  new Date("2021/12/25"),
  {
    author: "myclimate",
    year: 2019,
  },
)

const estimationMethods2 = new ValidUntilSource(
  null,
  "https://theicct.org/sites/default/files/publications/ICCT_CO2-commercl-aviation-2018_20190918.pdf",
  {
    en: {title: "CO2 emissions from commercial aviation"},
    de: {title: "CO2-Emissionen aus der kommerziellen Luftfahrt"},
  },
  new Date("2021/12/25"),
  {
    author: "The International Council on Clean Transportation",
    year: 2018,
  },
)

// TODO Are these vales to low? E.g. at atmosfair.de a flight from
// Hannover to New York (6.210 km ) has 1520 kg co2e, whereas it would here have
// only 948 kg co2e.

const averageShortHaulEmissions = averageShortHaulFlightDistance.map<number>(distanceKilometers =>
  flightCarbonModel.carbonEmissions({
    distanceKilometers,
    isRoundtrip: false,
  }),
)

const averageMediumHaulEmissions = averageMediumHaulFlightDistance.map<number>(distanceKilometers =>
  flightCarbonModel.carbonEmissions({
    distanceKilometers,
    isRoundtrip: false,
  }),
)

const averageLongHaulEmissions = averageLongHaulFlightDistance.map<number>(distanceKilometers =>
  flightCarbonModel.carbonEmissions({
    distanceKilometers,
    isRoundtrip: false,
  }),
)

export const estimateEmissions = (req: FlyingEstimationParams): EstimationResponse => {
  const estimatedEmissions = Estimate.combine(
    averageShortHaulEmissions,
    averageMediumHaulEmissions,
    averageLongHaulEmissions,
  )((averageShortHaulEmissions, averageMediumHaulEmissions, averageLongHaulEmissions) => {
    return (
      averageShortHaulEmissions * req.nShortHauls +
      averageMediumHaulEmissions * req.nMediumHauls +
      averageLongHaulEmissions * req.nLongHauls
    )
  })

  return {
    estimatedEmissions: estimatedEmissions.value,
    unit: Units.KG_CO2E,
    sources: estimatedEmissions
      .exportSources()
      .concat(estimationMethods.toJson())
      .concat(estimationMethods2.toJson()),
  }
}
