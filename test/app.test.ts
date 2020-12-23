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
