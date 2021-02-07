import co2eq from "@tmrow/bloom-contrib/co2eq"
import {ValidUntilSource} from "../sources"
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
    english: {title: "durations which count as short haul flights"},
    german: {title: "Dauer eines Kurzstreckenflugs"},
  },
  new Date("2021-12-25"),
)

const durationOfMediumHaulFlight = new ValidUntilSource<string>(
  "3-6 h",
  "https://www.pointhacks.com.au/differences-short-medium-long-haul-flights/",
  {
    english: {title: "durations which count as medium haul flights"},
    german: {title: "Dauer eines Mittelstreckenflugs"},
  },
  new Date("2021-12-25"),
)

const durationOfLongHaulFlight = new ValidUntilSource<string>(
  "6 - 12 h",
  "https://www.pointhacks.com.au/differences-short-medium-long-haul-flights/",
  {
    english: {title: "durations which count as long haul flights"},
    german: {title: "Dauer eines Langstreckenflugs"},
  },
  new Date("2021-12-25"),
)

const averageShortHaulFlightDistance = new ValidUntilSource<number>(
  (1100 + 1500) / 2,
  "https://en.wikipedia.org/wiki/Flight_length",

  {
    english: {title: "average distance of short haul flight (km)"},
    german: {title: "Mittlere Distanz eines Kurzstreckenflugs (km)"},
  },
  new Date("2021-12-25"),
)

const averageLongHaulFlightDistance = new ValidUntilSource<number>(
  (4100 + 4800) / 2,
  "https://en.wikipedia.org/wiki/Flight_length",
  {
    english: {title: "average distance of long haul flight (km)"},
    german: {title: "Mittlere Distanz eines Kurzstreckenflugs (km)"},
  },
  new Date("2021-12-25"),
)

const averageMediumHaulFlightDistance = new ValidUntilSource<number>(
  averageShortHaulFlightDistance.value +
    (averageLongHaulFlightDistance.value - averageShortHaulFlightDistance.value) / 2,
  "https://en.wikipedia.org/wiki/Flight_length",
  {
    english: {title: "average distance of medium haul flight (km)"},
    german: {title: "Mittlere Distanz eines Mittelstreckenflugs (km)"},
  },
  new Date("2021/12/25"),
)

// TODO Are these vales to low? E.g. at atmosfair.de a flight from
// Hannover to New York (6.210 km ) has 1520 kg co2e, whereas it would here have
// only 948 kg co2e.

const averageShortHaulEmissions = flightCarbonModel.carbonEmissions({
  distanceKilometers: averageShortHaulFlightDistance.value,
  isRoundtrip: false,
})
const averageMediumHaulEmissions = flightCarbonModel.carbonEmissions({
  distanceKilometers: averageMediumHaulFlightDistance.value,
  isRoundtrip: false,
})

const averageLongHaulEmissions = flightCarbonModel.carbonEmissions({
  distanceKilometers: averageLongHaulFlightDistance.value,
  isRoundtrip: false,
})

export const estimateEmissions = (req: FlyingEstimationParams): EstimationResponse => {
  return {
    estimatedEmissions:
      averageShortHaulEmissions * req.nShortHauls +
      averageMediumHaulEmissions * req.nMediumHauls +
      averageLongHaulEmissions * req.nLongHauls,
    unit: Units.KG_CO2E,
    sources: [
      averageShortHaulFlightDistance.toJson(),
      averageMediumHaulFlightDistance.toJson(),
      averageLongHaulFlightDistance.toJson(),
      // TODO add and convert flightCarbonModel.explanation
    ],
  }
}
