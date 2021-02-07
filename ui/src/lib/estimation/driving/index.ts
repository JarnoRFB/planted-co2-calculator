import co2eq from "@tmrow/bloom-contrib/co2eq"
import * as bloomDefinitions from "@tmrow/bloom-contrib/definitions"

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

export const DrivingEstimationParams = t.type({
  weeklyAverageDistance: t.readonly(t.number),
})

// https://en.wikipedia.org/wiki/ISO_week_date#Weeks_per_year
const weeksPerYear = 52

export type DrivingEstimationParams = t.TypeOf<typeof DrivingEstimationParams>

export const estimateEmissions = (req: DrivingEstimationParams): EstimationResponse => {
  let estimatedEmissions
  if (req.weeklyAverageDistance === 0) {
    estimatedEmissions = 0
  } else {
    estimatedEmissions = Math.round(
      carCarbonModel.carbonEmissions({
        distanceKilometers: req.weeklyAverageDistance * weeksPerYear,
      }),
    )
  }
  return {estimatedEmissions, unit: Units.KG_CO2E_PER_YEAR, sources: []}
}
