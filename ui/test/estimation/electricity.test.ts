import * as electricity from "../../src/lib/estimation/electricity"

describe("estimateEmissions", () => {
  it("should estimate correctly", () => {
    const res = electricity.estimateEmissions({
      housing: "apartment",
      householdSize: 2,
      greenEnergy: false,
    })
    expect(res.estimatedEmissions).toBeCloseTo(448.35)
    expect(res.sources.length).toBeGreaterThanOrEqual(1)
  })

  it("should estimate lower with green energy", () => {
    const res = electricity.estimateEmissions({
      housing: "apartment",
      householdSize: 2,
      greenEnergy: true,
    })
    expect(res.estimatedEmissions).toBeCloseTo(0.036)
  })

  it("should estimate lower with bigger household size", () => {
    const res = electricity.estimateEmissions({
      housing: "apartment",
      householdSize: 4,
      greenEnergy: false,
    })
    expect(res.estimatedEmissions).toBeCloseTo(320.25)
  })
})
