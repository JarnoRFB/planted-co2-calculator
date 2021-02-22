import * as driving from "../../src/lib/estimation/driving"

describe("estimateEmissions", () => {
  it("should estimate correctly", () => {
    const res = driving.estimateEmissions({
      weeklyAverageDistance: 200,
    })
    expect(res.estimatedEmissions).toBeCloseTo(1842)
    expect(res.sources.length).toBeGreaterThanOrEqual(1)
  })
})
