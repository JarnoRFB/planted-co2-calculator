import { reactive } from "vue"

const numberFormat = new Intl.NumberFormat("de-DE")

const formatEmissions = (emissions: number): string => {
  return `${numberFormat.format(emissions / 1000)} Tonnen CO<sub>2</sub>e`
}

export { formatEmissions }
