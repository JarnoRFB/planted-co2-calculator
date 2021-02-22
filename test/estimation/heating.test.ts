import * as heating from "../../src/lib/estimation/heating"

describe("estimateEmissions", () => {
  it("should estimate correctly", () => {
    const res = heating.estimateEmissions({
      householdSize: 2,
      apartmentSize: 100,
      apartmentAge: 1995,
      energySource: "naturalGas",
    })
    expect(res.estimatedEmissions).toBeCloseTo(1375)
    expect(res.sources.length).toBeGreaterThanOrEqual(1)
  })
})
