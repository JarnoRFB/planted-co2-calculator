import co2eq from "@tmrow/bloom-contrib/co2eq"
import {ValidUntilSource} from "../sources"

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

export interface FlyingEstimationParams {
  readonly nShortHauls: number
  readonly nMediumHauls: number
  readonly nLongHauls: number
}

const durationOfShortHaulFlight = new ValidUntilSource<string>(
  "<3 h",
  new URL("https://www.pointhacks.com.au/differences-short-medium-long-haul-flights/"),
  "durations which count as short haul flights",
  new Date("2021/12/25")
)

const durationOfMediumHaulFlight = new ValidUntilSource<string>(
  "3-6 h",
  new URL("https://www.pointhacks.com.au/differences-short-medium-long-haul-flights/"),
  "durations which count as medium haul flights",
  new Date("2021/12/25")
)

const durationOfLongHaulFlight = new ValidUntilSource<string>(
  "6 - 12 h",
  new URL("https://www.pointhacks.com.au/differences-short-medium-long-haul-flights/"),
  "durations which count as long haul flights",
  new Date("2021/12/25")
)

const averageShortHaulFlightDistance = new ValidUntilSource<number>(
  1250,
  new URL("https://en.wikipedia.org/wiki/Flight_length"),
  "average distance of short haul flight in kilometers",
  new Date("2021/12/25")
)

const averageMediumHaulFlightDistance = new ValidUntilSource<number>(
  1825,
  new URL("https://en.wikipedia.org/wiki/Flight_length"),
  "average distance of medium haul flight in kilometers",
  new Date("2021/12/25")
)

const averageLongHaulFlightDistance = new ValidUntilSource<number>(
  2400,
  new URL("https://en.wikipedia.org/wiki/Flight_length"),
  "average distance of long haul flight in kilometers",
  new Date("2021/12/25")
)

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

export const estimateEmissions = (req: FlyingEstimationParams) => {
  return {
    estimatedEmission:
      averageShortHaulEmissions * req.nShortHauls +
      averageMediumHaulEmissions * req.nMediumHauls +
      averageLongHaulEmissions * req.nLongHauls,
    unit: "kg co2e",
    sources: [
      averageShortHaulFlightDistance.toJson(),
      averageMediumHaulFlightDistance.toJson(),
      averageLongHaulFlightDistance.toJson(),
    ],
  }
}
