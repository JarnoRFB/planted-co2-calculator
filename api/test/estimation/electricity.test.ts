import * as electricity from "../../src/estimation/electricity"

describe("estimateEmissions", () => {
  it("should estimate correctly", async () => {
    const res = electricity.estimateEmissions({
      housing: "apartment",
      householdSize: 2,
      greenEnergy: false,
    })
    expect(res.estimatedEmissions).toBeCloseTo(448.35)
  })

  it("should estimate lower with green energy", async () => {
    const res = electricity.estimateEmissions({
      housing: "apartment",
      householdSize: 2,
      greenEnergy: true,
    })
    expect(res.estimatedEmissions).toBeCloseTo(0.036)
  })

  it("should estimate lower with bigger household size", async () => {
    const res = electricity.estimateEmissions({
      housing: "apartment",
      householdSize: 4,
      greenEnergy: false,
    })
    expect(res.estimatedEmissions).toBeCloseTo(320.25)
  })
})
