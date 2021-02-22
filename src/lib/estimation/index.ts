import {SourceSchema} from "./sources"

export interface EstimationResponse {
  readonly estimatedEmissions: number
  readonly unit: string
  readonly sources: SourceSchema<any>[]
}

export enum Units {
  KG_CO2E = "kg co2e",
  KG_CO2E_PER_YEAR = "kg co2e / year",
}
