import express from "express"
import co2eq from "@tmrow/bloom-contrib/co2eq"

const [
  ingredientsCarbonModel,
  mealCarbonModel,
  carCarbonModel,
  flightCarbonModel,
  transportationCarbonModel,
  energyCarbonModel,
  hotelCarbonModel,
  purchaseCarbonModel,
  electricityWorldAverageCarbonModel,
] = co2eq

// emission from Berlin to Munich
const emissions = flightCarbonModel.carbonEmissions({
  departureAirportCode: "SXF",
  destinationAirportCode: "MUC",
  isRoundtrip: false,
})

const app = express()

const flyingRouter = express.Router()
flyingRouter.post("/shorthaul", (req, res) => {
  res.json({estimatedEmission: 1, unit: "kg co2e"})
})

flyingRouter.post("/mediumhaul", (req, res) => {
  res.json({estimatedEmission: 2, unit: "kg co2e"})
})

flyingRouter.post("/longhaul", (req, res) => {
  res.json({estimatedEmission: 3, unit: "kg co2e"})
})

app.get("/", (req, res) => {
  res.send("The sedulous hyena ate the antelope!")
})

app.use("/estimation/flying", flyingRouter)

const port = 3000

app.listen(port, () => {
  return console.log(`server is listening on ${port}`)
})
