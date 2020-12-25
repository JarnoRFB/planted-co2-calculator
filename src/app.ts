import express from "express"
import co2eq from "@tmrow/bloom-contrib/co2eq"
import bodyParser from "body-parser"
import {FlyingEstimationParams, estimateEmissions} from "./estimation/flying"

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

flyingRouter.post("/", (req, res) => {
  const body: FlyingEstimationParams = req.body
  res.json(estimateEmissions(body))
})

app.get("/", (req, res) => {
  res.json({message: "The sedulous hyena ate the antelope!"})
})

app.use("/estimation/flying", flyingRouter)

export default app
