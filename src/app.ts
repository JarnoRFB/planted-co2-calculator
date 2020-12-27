import express from "express"
import co2eq from "@tmrow/bloom-contrib/co2eq"
import bodyParser from "body-parser"
import * as flying from "./estimation/flying"
import * as base from "./estimation/base"

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

console.log(emissions)

const app = express()
// Express configuration

app.set("port", process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
const flyingRouter = express.Router()

flyingRouter.post("/flying", (req, res) => {
  const body: flying.FlyingEstimationParams = req.body
  res.json(flying.estimateEmissions(body))
})

const baseRouter = express.Router()

flyingRouter.post("/base", (req, res) => {
  const body: base.BaseEstimationParams = req.body
  res.json(base.estimateEmissions(body))
})

app.get("/", (req, res) => {
  res.json({message: "The sedulous hyena ate the antelope!"})
})

app.use("/estimation/", flyingRouter)

export default app
