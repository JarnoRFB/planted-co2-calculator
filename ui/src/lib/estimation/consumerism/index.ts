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
})

export type ConsumerismEstimationParams = t.TypeOf<typeof ConsumerismEstimationParams>

const energyConsumptionForProductsInGermany = Estimate.of(
  new ValidUntilSource(
    1.424,
    "https://www.umweltbundesamt.de/indikator-energieverbrauch-co2-emissionen-des",
    "Gesamtenergieverbrauch für weitere Produkte in Deutschland in Petajoule",
    new Date("2022-01-24"),
  ),
)

const energyConsumptionForServiceInGermany = Estimate.of(
  new ValidUntilSource(
    1.424,
    "https://www.umweltbundesamt.de/indikator-energieverbrauch-co2-emissionen-des",
    "Gesamtenergieverbrauch für weitere Dienstleistungen in Deutschland in Petajoule",
    new Date("2022-01-24"),
  ),
)

const energyConsumptionForConsumerismInGermany = Estimate.of(
  new ValidUntilSource(
    9.486,
    "https://www.umweltbundesamt.de/indikator-energieverbrauch-co2-emissionen-des",
    "Gesamtenergieverbrauch für Konsum in Deutschland in Petajoule",
    new Date("2022-01-24"),
  ),
)

const carbonEmissionsForConsumerismInGermany = Estimate.of(
  new ValidUntilSource(
    667e6,
    "https://www.umweltbundesamt.de/indikator-energieverbrauch-co2-emissionen-des",
    "CO2 Emissionen für Konsum in Deutschland in Tonnen",
    new Date("2022-01-24"),
  ),
)

const populationGermany = Estimate.of(
  new ValidUntilSource(
    83_190_556,
    "https://www.destatis.de/DE/Themen/Gesellschaft-Umwelt/Bevoelkerung/Bevoelkerungsstand/Tabellen/liste-zensus-geschlecht-staatsangehoerigkeit.html",
    "Gesamtbevölkerung Detschland",
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
  )(
    (
      energyConsumptionForConsumerism,
      energyConsumptionForProducts,
      energyConsumptionForServices,
      carbonEmissionsForConsumerism,
      population,
    ) => {
      const proportionOfPrivateConsumerism =
        (energyConsumptionForProducts + energyConsumptionForServices) /
        energyConsumptionForConsumerism
      const carbonEmissionsOfPrivateConsumerism =
        carbonEmissionsForConsumerism * proportionOfPrivateConsumerism

      return (carbonEmissionsOfPrivateConsumerism / population) * 1000
    },
  )

  return {
    estimatedEmissions: estimatedEmissions.value,
    unit: Units.KG_CO2E_PER_YEAR,
    sources: estimatedEmissions.exportSources(),
  }
}
