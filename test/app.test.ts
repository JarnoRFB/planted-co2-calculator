import app from "../src/app"
import request from "supertest"

const server = request(app)

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
