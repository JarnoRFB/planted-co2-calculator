import * as base from "../../src/lib/estimation/base"

describe("estimateEmissions", () => {
  it("should estimate correctly", () => {
    const res = base.estimateEmissions({
      country: "Germany",
    })
    expect(res.estimatedEmissions).toBeCloseTo(10030)
    expect(res.sources.length).toBeGreaterThanOrEqual(1)
  })
})
