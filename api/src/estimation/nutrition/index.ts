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

enum Diet {
  VEGAN = "VEGAN",
  VEGETARIAN = "VEGETARIAN",
  FLEXITARIAN = "FLEXITARIAN",
  CARNIVORE = "CARNIVORE",
}

const DietType: {
  [key: string]: null
} = Object.values(Diet).reduce((acc, x) => Object.assign(acc, {[x]: null}), {})

export const NutritionEstimationParams = t.type({
  diet: t.readonly(t.keyof(DietType)),
})

export type NutritionEstimationParams = t.TypeOf<typeof NutritionEstimationParams>

const dietToMealType = (diet: Diet): string => {
  switch (diet) {
    case Diet.VEGAN:
      return bloomDefinitions.MEAL_TYPE_VEGAN
    case Diet.VEGETARIAN:
      return bloomDefinitions.MEAL_TYPE_VEGETARIAN
    case Diet.FLEXITARIAN:
      return bloomDefinitions.MEAL_TYPE_MEAT_LOW
    case Diet.CARNIVORE:
      return bloomDefinitions.MEAL_TYPE_MEAT_HIGH
  }
}

export const estimateEmissions = (req: NutritionEstimationParams): EstimationResponse => {
  const mealType = dietToMealType(req.diet as Diet)
  const estimatedEmissions = Math.round(
    mealCarbonModel.carbonEmissions({mealType, numberOfMeals: 365 * 3})
  )
  return {estimatedEmissions, unit: Units.KG_CO2E_PER_YEAR, sources: []}
}
