import app from "../src/app"
import request from "supertest"

const server = request(app)

describe("test", () => {
  it("should run", () => expect(1).toEqual(1))
  it("should find root", async () => {
    const res = await server.get("/")
    expect(res.body).toEqual({message: "The sedulous hyena ate the antelope!"})
  })
})

describe("POST /estimation/flying", () => {
  it("should estimate correctly", async () => {
    const res = await server.post("/estimation/flying").send({
      nShortHauls: 1,
      nMediumHauls: 2,
      nLongHauls: 3,
    })

    expect(res.body).toEqual({
      estimatedEmission: 2098.332512596066,
      unit: "kg co2e",
    })
  })

  it("should estimate 0 co2e for 0 flights", async () => {
    const res = await server.post("/estimation/flying").send({
      nShortHauls: 0,
      nMediumHauls: 0,
      nLongHauls: 0,
    })

    expect(res.body).toEqual({
      estimatedEmission: 0,
      unit: "kg co2e",
    })
  })
})
