import co2eq from "@tmrow/bloom-contrib/co2eq"
import * as bloomDefinitions from "@tmrow/bloom-contrib/definitions"

import {EstimationResponse, Units} from ".."
import * as t from "io-ts"
import electricityData from "./data.json"
import {Estimate, ValidUntilSource} from "../sources"

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

// KG_CO2e_PER_kWh

// TODO find real AIB source
const carbonIntensityGermany = Estimate.of(
  new ValidUntilSource(
    427 / 1000,
    "https://www.carbonfootprint.com/docs/2019_06_emissions_factors_sources_for_2019_electricity.pdf",
    {
      english: {title: "Average carbon intensity of energy in Germany (kg / kWh)"},
      german: {title: "Durchschnittliche CO2 Intensität von Strom in Deutschland (kg / kWh)"},
    },
    new Date("2022-01-07"),
  ),
)

const carbonIntensityGermanyGreenEnergy = Estimate.of(
  new ValidUntilSource(
    0.035 / 1000,
    "https://www.stromspiegel.de/stromverbrauch-verstehen/was-ist-echter-oekostrom/",
    {
      english: {title: "Carbon intensity of green energy in Germany (kg / kWh)"},
      german: {title: "CO2 Intensität von Ökostrom in Deutschland (kg / kWh)"},
    },
    new Date("2022-01-07"),
  ),
)

const sourcedElectricityData = Estimate.of(
  new ValidUntilSource(
    electricityData,
    "https://www.stromspiegel.de/stromverbrauch-verstehen/stromverbrauch-im-haushalt/#c120951",
    {
      english: {title: "Average electricity consumption of households in Germany (kWh/a)"},
      german: {title: "Durchschnittlicher Stromverbrauch von Haushalten in Deutschland (kWh/Jahr)"},
    },
    new Date("2022-01-07"),
  ),
)

export type ElectricityEstimationParams = t.TypeOf<typeof ElectricityEstimationParams>

export const estimateEmissions = (req: ElectricityEstimationParams): EstimationResponse => {
  const applicableCarbonIntensity0 = carbonIntensityGermany.map2(
    carbonIntensityGermanyGreenEnergy,
    (a, b) => (req.greenEnergy ? b : a),
  )

  const estimatedConsumptionPerYear0 = sourcedElectricityData.map(
    electricityDataVal =>
      electricityDataVal.find(x => x.householdSize == req.householdSize && x.housing == req.housing)
        ?.consumptionInkWhPerYear,
  )

  // const applicableCarbonIntensity = req.greenEnergy
  //   ? carbonIntensityGermanyGreenEnergy
  //   : carbonIntensityGermany

  // const estimatedConsumptionPerYear = electricityData.find(
  //   x => x.householdSize == req.householdSize && x.housing == req.housing,
  // )?.consumptionInkWhPerYear

  const estimatedEmissions0 = applicableCarbonIntensity0.map2(
    estimatedConsumptionPerYear0,
    (carbonIntensity, consumptionPerYear) => {
      if (req.householdSize <= 0) {
        return 0
      } else if (consumptionPerYear === undefined) {
        throw new Error("No consumption could be estimated")
      } else {
        return (consumptionPerYear * carbonIntensity) / req.householdSize
      }
    },
  )

  return {
    estimatedEmissions: estimatedEmissions0.value,
    unit: Units.KG_CO2E_PER_YEAR,
    sources: estimatedEmissions0.exportSources(),
  }
}
