import * as flying from "../../src/lib/estimation/flying"

describe("estimateEmissions", () => {
  it("should estimate correctly", () => {
    const res = flying.estimateEmissions({
      nShortHauls: 1,
      nMediumHauls: 2,
      nLongHauls: 3,
    })
    expect(res.estimatedEmissions).toBeCloseTo(3275.1534124193663)
    expect(res.sources.length).toBeGreaterThanOrEqual(1)
  })

  it("should estimate 0 co2e for 0 flights", () => {
    const res = flying.estimateEmissions({
      nShortHauls: 0,
      nMediumHauls: 0,
      nLongHauls: 0,
    })
    expect(res.estimatedEmissions).toBe(0)
  })
})
