import co2eq from "@tmrow/bloom-contrib/co2eq"
import * as bloomDefinitions from "@tmrow/bloom-contrib/definitions"

import {ValidUntilSource} from "../sources"
import {EstimationResponse, Units} from ".."
import * as t from "io-ts"
import electricityData from "./data.json"

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

export const ElectricityEstimationParams = t.type({
  housing: t.readonly(t.keyof({house: null, apartment: null})),
  householdSize: t.readonly(t.number),
  greenEnergy: t.boolean,
})

const weeksPerYear = 52

// https://de.wikipedia.org/wiki/Berlin
const latBerlin = 52.52
const lonBerlin = 13.405

// KG_CO2e_PER_kWh

// https://www.carbonfootprint.com/docs/2019_06_emissions_factors_sources_for_2019_electricity.pdf
// TODO find real AIB source
const carbonIntensityGermany = 427 / 1000
// https://www.stromspiegel.de/stromverbrauch-verstehen/was-ist-echter-oekostrom/
const carbonIntensityGermanyGreenEnergy = 0.035 / 1000

// https://www.stromspiegel.de/stromverbrauch-verstehen/stromverbrauch-im-haushalt/#c120951

export type ElectricityEstimationParams = t.TypeOf<typeof ElectricityEstimationParams>

export const estimateEmissions = (req: ElectricityEstimationParams): EstimationResponse => {
  const applicableCarbonIntensity = req.greenEnergy
    ? carbonIntensityGermanyGreenEnergy
    : carbonIntensityGermany
  const estimatedConsumptionPerYear = electricityData.find(
    x => x.householdSize == req.householdSize && x.housing == req.housing
  )?.consumptionInkWhPerYear

  if (estimatedConsumptionPerYear === undefined) {
    throw new Error("No consumption could be estimated")
  } else {
    const estimatedEmissions =
      (estimatedConsumptionPerYear * applicableCarbonIntensity) / req.householdSize
    return {estimatedEmissions, unit: Units.KG_CO2E_PER_YEAR, sources: []}
  }
}
