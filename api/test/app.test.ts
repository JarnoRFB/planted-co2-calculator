import app from "../src/app"
import request from "supertest"

const server = request(app)

const closeTo = (expected: number, precision: number = 2) => ({
  asymmetricMatch: (actual: number) => Math.abs(expected - actual) < Math.pow(10, -precision) / 2,
})

describe("POST /estimation/flying", () => {
  it("should estimate correctly", async () => {
    const res = await server.post("/estimation/flying").send({
      nShortHauls: 1,
      nMediumHauls: 2,
      nLongHauls: 3,
    })

    expect(res.status).toBe(200)

    expect(res.body).toMatchObject({
      estimatedEmissions: 3275.1534124193663,
      unit: "kg co2e",
    })

    expect(res.body.sources[0]).toMatchObject({
      value: 1300,
      url: new URL("https://en.wikipedia.org/wiki/Flight_length"),
      description: "average distance of short haul flight in kilometers",
      isStale: false,
    })
  })

  it("should estimate 0 co2e for 0 flights", async () => {
    const res = await server.post("/estimation/flying").send({
      nShortHauls: 0,
      nMediumHauls: 0,
      nLongHauls: 0,
    })
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      estimatedEmissions: 0,
      unit: "kg co2e",
    })
  })

  it("should error on invalid request body", async () => {
    const res = await server.post("/estimation/flying").send({
      nShortHauls: 1,
    })

    expect(res.status).toBe(400)
  })
})

describe("POST /estimation/base", () => {
  it("should provide estimates for Germany", async () => {
    const res = await server.post("/estimation/base").send({
      country: "Germany",
    })
    expect(res.status).toBe(200)

    expect(res.body).toMatchObject({
      estimatedEmissions: 10030,
      unit: "kg co2e / year",
    })
  })

  it("should error on unknown country", async () => {
    const res = await server.post("/estimation/base").send({
      country: "Taka-Tuka Land",
    })
    expect(res.status).toBe(400)
  })
})

describe("POST /estimation/nutrition", () => {
  it("should estimate correctly", async () => {
    const res = await server.post("/estimation/nutrition").send({
      diet: "FLEXITARIAN",
    })
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      estimatedEmissions: 1741,
      unit: "kg co2e / year",
    })
  })
})

describe("POST /estimation/driving", () => {
  it("should estimate correctly", async () => {
    const res = await server.post("/estimation/driving").send({
      weeklyAverageDistance: 200,
    })
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      estimatedEmissions: 1842,
      unit: "kg co2e / year",
    })
  })
})

describe("POST /estimation/electricity", () => {
  it("should estimate correctly", async () => {
    const res = await server.post("/estimation/electricity").send({
      housing: "apartment",
      householdSize: 2,
      greenEnergy: false,
    })
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      estimatedEmissions: closeTo(448.35),
      unit: "kg co2e / year",
    })

    expect(res.body.sources.length).toBe(3)
  })
})

describe("POST /estimation/heating", () => {
  it("should estimate correctly", async () => {
    const res = await server.post("/estimation/heating").send({
      householdSize: 2,
      apartmentSize: 100,
      apartmentAge: 1995,
      energySource: "naturalGas",
    })
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      estimatedEmissions: closeTo(1375),
      unit: "kg co2e / year",
    })
  })
})

describe("POST /estimation/consumerism", () => {
  it("should estimate correctly", async () => {
    const res = await server.post("/estimation/consumerism").send({
      country: "Germany",
    })
    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      estimatedEmissions: closeTo(2407.18),
      unit: "kg co2e / year",
    })
  })
})
