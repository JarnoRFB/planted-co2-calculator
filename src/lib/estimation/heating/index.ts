import co2eq from "@tmrow/bloom-contrib/co2eq"
import * as bloomDefinitions from "@tmrow/bloom-contrib/definitions"
import specificHeatDemandByYearData from "./specificHeatDemandByYear.json"

import {Estimate, ValidUntilSource} from "../sources"
import {EstimationResponse, Units} from ".."
import * as t from "io-ts"

const EnergySource = t.readonly(
  t.keyof({
    oil: null,
    naturalGas: null,
    longDistanceHeating: null,
    heatingPump: null,
    woodPellets: null,
  }),
)

type EnergySource = t.TypeOf<typeof EnergySource>

export const HeatingEstimationParams = t.type({
  householdSize: t.readonly(t.number),
  apartmentSize: t.readonly(t.number),
  apartmentAge: t.readonly(t.number),
  energySource: EnergySource,
})

export type HeatingEstimationParams = t.TypeOf<typeof HeatingEstimationParams>

const carbonIntensityOfEnergySources = Estimate.of(
  new ValidUntilSource(
    {
      oil: 319,
      naturalGas: 250,
      longDistanceHeating: 198,
      heatingPump: 171,
      woodPellets: 27,
    },
    "https://www.heizspiegel.de/heizkosten-verstehen/brennstoffe-energietraeger-im-vergleich/#c156311",
    {
      en: {title: "Carbon intensity of different energy sources in Germany (g/kWh)"},
      de: {
        title: "CO2 Intensität verschiedener Engerieträger in Deutschland (g/kWh)",
      },
    },
    new Date("2021/12/25"),
  ),
)

const specificHeatDemandByYear = Estimate.of(
  new ValidUntilSource(
    specificHeatDemandByYearData,
    "http://energieberatung.ibs-hlk.de/eb_begr.htm",
    {
      en: {title: "Specific heat demand by year (kWh/m²a)"},
      de: {
        title: "Spezifischer Wärmebedarf nach Jahren (kWh/m²a)",
      },
    },
    new Date("2021/12/25"),
  ),
)

export const estimateEmissions = (req: HeatingEstimationParams): EstimationResponse => {
  const estimatedEmissions = Estimate.combine(
    carbonIntensityOfEnergySources,
    specificHeatDemandByYear,
  )((carbonIntensityOfEnergySources, specificHeatDemandByYear) => {
    const specificHeatDemand = specificHeatDemandByYear.find(
      x => x.yearRange.low <= req.apartmentAge && x.yearRange.high >= req.apartmentAge,
    )?.specificHeatDemand

    const carbonIntensity = carbonIntensityOfEnergySources[req.energySource]

    if (specificHeatDemand === undefined) {
      throw new Error("Could not estimate emissions")
    } else if (req.householdSize <= 0) {
      return 0
    } else {
      return (req.apartmentSize * specificHeatDemand * carbonIntensity) / 1000 / req.householdSize
    }
  })

  return {
    estimatedEmissions: estimatedEmissions.value,
    unit: Units.KG_CO2E_PER_YEAR,
    sources: estimatedEmissions.exportSources(),
  }
}
