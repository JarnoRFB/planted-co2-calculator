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

const app = express()

// Express configuration
app.set("port", process.env.PORT || 3000)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Routes
const flyingRouter = express.Router()

const sendErrorMessage = (req: express.Request, res: express.Response, errors: t.Errors) => {
  res
    .status(400)
    .json({message: `Invalid request body ${req.body}`, errors: formatValidationErrors(errors)})

  return res
}

flyingRouter.post("/flying", (req, res) => {
  pipe(
    flying.FlyingEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(flying.estimateEmissions(params))
    )
  )
})

const baseRouter = express.Router()

baseRouter.post("/base", (req, res) => {
  const body: base.BaseEstimationParams = req.body

  pipe(
    base.BaseEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(base.estimateEmissions(params))
    )
  )
})

const nutritionRouter = express.Router()
nutritionRouter.post("/nutrition", (req, res) => {
  pipe(
    nutrition.NutritionEstimationParams.decode(req.body),
    fold(
      errors => sendErrorMessage(req, res, errors),
      params => res.json(nutrition.estimateEmissions(params))
    )
  )
})

app.get("/", (req, res) => {
  res.json({message: "Welcome to the planted carbon footprint estimator"})
})

const estimationRoute = "/estimation"
app.use(estimationRoute, flyingRouter)
app.use(estimationRoute, baseRouter)
app.use(estimationRoute, nutritionRouter)

if (process.env.NODE_ENV === "development") {
  app.use(errorHandler({log: true}))
}

export default app
