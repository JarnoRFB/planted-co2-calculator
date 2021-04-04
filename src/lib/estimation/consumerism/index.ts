import co2eq from "@tmrow/bloom-contrib/co2eq"
import * as bloomDefinitions from "@tmrow/bloom-contrib/definitions"

import {EstimationResponse, Units} from ".."
import * as t from "io-ts"
import {Estimate, ValidUntilSource} from "../sources"

enum Countries {
  GERMANY = "Germany",
}

const CountriesType: {
  [key: string]: null
} = Object.values(Countries).reduce((acc, x) => Object.assign(acc, {[x]: null}), {})

export const ConsumerismEstimationParams = t.type({
  country: t.readonly(t.keyof(CountriesType)),
  intensity: t.readonly(
    t.keyof({
      frugal: null,
      normal: null,
      lush: null,
    }),
  ),
})

export type ConsumerismEstimationParams = t.TypeOf<typeof ConsumerismEstimationParams>

const energyConsumptionForProductsInGermany = Estimate.of(
  new ValidUntilSource(
    1.424,
    "https://www.umweltbundesamt.de/indikator-energieverbrauch-co2-emissionen-des",
    {
      en: {title: "Energy consumption for other products in Germany in (petajoule)"},
      de: {title: "Gesamtenergieverbrauch für weitere Produkte in Deutschland (Petajoule)"},
    },
    new Date("2022-01-24"),
  ),
)

const energyConsumptionForServiceInGermany = Estimate.of(
  new ValidUntilSource(
    1.424,
    "https://www.umweltbundesamt.de/indikator-energieverbrauch-co2-emissionen-des",
    {
      en: {title: "Energy consumption for other services in Germany (petajoule)"},
      de: {
        title: "Gesamtenergieverbrauch für weitere Dienstleistungen in Deutschland (Petajoule)",
      },
    },
    new Date("2022-01-24"),
  ),
)

const energyConsumptionForConsumerismInGermany = Estimate.of(
  new ValidUntilSource(
    9.486,
    "https://www.umweltbundesamt.de/indikator-energieverbrauch-co2-emissionen-des",
    {
      en: {title: "Total energy consumption in Germany (petajoule)"},
      de: {title: "Gesamtenergieverbrauch für Konsum in Deutschland (Petajoule)"},
    },
    new Date("2022-01-24"),
  ),
)

const carbonEmissionsForConsumerismInGermany = Estimate.of(
  new ValidUntilSource(
    667e6,
    "https://www.umweltbundesamt.de/indikator-energieverbrauch-co2-emissionen-des",
    {
      en: {title: "Carbon emissions for consumerism in Germany (tons)"},
      de: {title: "CO2 Emissionen für Konsum in Deutschland (Tonnen)"},
    },
    new Date("2022-01-24"),
  ),
)

const populationGermany = Estimate.of(
  new ValidUntilSource(
    82_521_700,
    "https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Bevoelkerungsstand/Tabellen/liste-zensus-geschlecht-staatsangehoerigkeit.html",
    {
      en: {title: "German total population 2016"},
      de: {title: "Gesamtbevölkerung Detschland 2016"},
    },
    new Date("2022-01-24"),
  ),
)

const intensityFactors = Estimate.of(
  new ValidUntilSource(
    {
      frugal: 1 - 0.341,
      normal: 1,
      lush: 1 + 0.341,
    },
    "https://en.wikipedia.org/wiki/68%E2%80%9395%E2%80%9399.7_rule",
    {
      en: {title: "Factors of consumerism"},
      de: {title: "Einflussfaktoren von Konsumverhalten"},
    },
    new Date("2022-01-24"),
  ),
)

export const estimateEmissions = (req: ConsumerismEstimationParams): EstimationResponse => {
  const estimatedEmissions = Estimate.combine(
    energyConsumptionForConsumerismInGermany,
    energyConsumptionForProductsInGermany,
    energyConsumptionForServiceInGermany,
    carbonEmissionsForConsumerismInGermany,
    populationGermany,
    intensityFactors,
  )(
    (
      energyConsumptionForConsumerism,
      energyConsumptionForProducts,
      energyConsumptionForServices,
      carbonEmissionsForConsumerism,
      population,
      intensityFactors,
    ) => {
      const proportionOfPrivateConsumerism =
        (energyConsumptionForProducts + energyConsumptionForServices) /
        energyConsumptionForConsumerism
      const carbonEmissionsOfPrivateConsumerism =
        carbonEmissionsForConsumerism * proportionOfPrivateConsumerism

      return (
        (carbonEmissionsOfPrivateConsumerism / population) * 1000 * intensityFactors[req.intensity]
      )
    },
  )

  return {
    estimatedEmissions: estimatedEmissions.value,
    unit: Units.KG_CO2E_PER_YEAR,
    sources: estimatedEmissions.exportSources(),
  }
}
