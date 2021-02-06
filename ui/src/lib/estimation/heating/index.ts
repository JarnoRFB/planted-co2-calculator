import co2eq from "@tmrow/bloom-contrib/co2eq"
import * as bloomDefinitions from "@tmrow/bloom-contrib/definitions"
import specificHeatDemandByYear from "./specificHeatDemandByYear.json"

import {ValidUntilSource} from "../sources"
import {EstimationResponse, Units} from ".."
import * as t from "io-ts"

const EnergySource = t.readonly(
  t.keyof({
    oil: null,
    naturalGas: null,
    longDistanceHeating: null,
    heatingPump: null,
    woodPellets: null,
  })
)

type EnergySource = t.TypeOf<typeof EnergySource>

export const HeatingEstimationParams = t.type({
  householdSize: t.readonly(t.number),
  apartmentSize: t.readonly(t.number),
  apartmentAge: t.readonly(t.number),
  energySource: EnergySource,
})

export type ElectricityEstimationParams = t.TypeOf<typeof HeatingEstimationParams>

// https://www.heizspiegel.de/heizkosten-verstehen/brennstoffe-energietraeger-im-vergleich/#c156311
// g pro kWh
const carbonIntensityOfEnergySources = {
  oil: 319,
  naturalGas: 250,
  longDistanceHeating: 198,
  heatingPump: 171,
  woodPellets: 27,
}

export const estimateEmissions = (req: ElectricityEstimationParams): EstimationResponse => {
  // http://energieberatung.ibs-hlk.de/eb_begr.htm
  const specificHeatDemand = specificHeatDemandByYear.find(
    x => x.yearRange.low <= req.apartmentAge && x.yearRange.high >= req.apartmentAge
  )?.specificHeatDemand

  const carbonIntensity = carbonIntensityOfEnergySources[req.energySource]

  if (specificHeatDemand === undefined) {
    throw new Error("Could not estimate emissions")
  } else {
    const estimatedEmissions =
      (req.apartmentSize * specificHeatDemand * carbonIntensity) / 1000 / req.householdSize

    return {estimatedEmissions, unit: Units.KG_CO2E_PER_YEAR, sources: []}
  }
}
