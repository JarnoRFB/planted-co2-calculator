import * as consumerism from "../../src/lib/estimation/consumerism"

describe("estimateEmissions", () => {
  it("should estimate correctly", () => {
    const res = consumerism.estimateEmissions({
      country: "Germany",
      intensity: "normal",
    })
    expect(res.estimatedEmissions).toBeCloseTo(2426.69)
    expect(res.sources.length).toBeGreaterThanOrEqual(1)
  })
})
