import bodyParser from "body-parser"
import errorHandler from "errorhandler"
import express from "express"
import {fold} from "fp-ts/Either"
import {pipe} from "fp-ts/function"
import * as t from "io-ts"
import {formatValidationErrors} from "io-ts-reporters"
import * as base from "./estimation/base"
import * as flying from "./estimation/flying"
import * as nutrition from "./estimation/nutrition"
import * as driving from "./estimation/driving"
import * as electricity from "./estimation/electricity"
import * as heating from "./estimation/heating"
import * as consumerism from "./estimation/consumerism"

const app = express()

// Express configuration
app.set("port", process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Routes
const estimationRouter = express.Router()

const sendErrorMessage = (req: express.Request, res: express.Response, errors: t.Errors) => {
  res
    .status(400)
    .json({message: `Invalid request body ${req.body}`, errors: formatValidationErrors(errors)})

  return res
}

estimationRouter.post("/flying", (req, res) => {
  pipe(
    flying.FlyingEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(flying.estimateEmissions(params)),
    ),
  )
})

estimationRouter.post("/base", (req, res) => {
  const body: base.BaseEstimationParams = req.body

  pipe(
    base.BaseEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(base.estimateEmissions(params)),
    ),
  )
})

estimationRouter.post("/nutrition", (req, res) => {
  pipe(
    nutrition.NutritionEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(nutrition.estimateEmissions(params)),
    ),
  )
})

estimationRouter.post("/driving", (req, res) => {
  pipe(
    driving.DrivingEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(driving.estimateEmissions(params)),
    ),
  )
})

estimationRouter.post("/electricity", (req, res) => {
  pipe(
    electricity.ElectricityEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(electricity.estimateEmissions(params)),
    ),
  )
})

estimationRouter.post("/heating", (req, res) => {
  pipe(
    heating.HeatingEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(heating.estimateEmissions(params)),
    ),
  )
})

estimationRouter.post("/consumerism", (req, res) => {
  pipe(
    consumerism.ConsumerismEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(consumerism.estimateEmissions(params)),
    ),
  )
})

app.get("/", (req, res) => {
  res.json({message: "Welcome to the planted carbon footprint estimator"})
})

app.use("/estimation", estimationRouter)

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler({log: true}))
}

export default app
