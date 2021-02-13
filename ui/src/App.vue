<template>
  <div class="header">
    <h1 class="title">
      <img
        src="https://uploads-ssl.webflow.com/5fc25896c145ac50c7d2af7b/5fd092f58ae2717a5d82e8a7_PLANTED_LOGO_WORTBILDMARKE.svg"
        loading="eager"
        alt=""
      />
      C0<sub>2</sub> Recher
    </h1>
    <el-progress
      :text-inside="true"
      :show-text="true"
      :stroke-width="50"
      :percentage="percentageOfReferenceEmissions"
      :color="colorGradient"
    >
      <b> <span v-html="formatEmissions(totalEmissions)"> </span> </b>
    </el-progress>
  </div>

  <div id="questions">
    <div id="flying" class="topic">
      <el-divider>✈️</el-divider>
      <h2>Flüge</h2>
      <p class="question">Wie oft bist Du letztes Jahr geflogen?</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item label="Kurzstreckenflüge">
            <el-input-number
              id="nShortHauls-option"
              v-model="flying.nShortHauls"
              :min="0"
              :label="'Kurzstreckenflüge'"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="Mittelstreckenflüge">
            <el-input-number
              id="nMediumHauls-option"
              v-model="flying.nMediumHauls"
              :min="0"
              :label="'Mittelstreckenflüge'"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="Langstreckenflüge">
            <el-input-number
              id="nLongHauls-option"
              v-model="flying.nLongHauls"
              :min="0"
              :label="'Langstreckenflüge'"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display
        ><span v-html="formatEmissions(flyingEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="flyingEmissions.sources" />
    </div>

    <div id="nutrition" class="topic">
      <el-divider>🍜</el-divider>

      <h2>Ernährung</h2>
      <p class="question">Wie ernährst Du Dich?</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item>
            <el-select v-model="nutrition.diet">
              <el-option
                v-for="item in nutritionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display>
        <span v-html="formatEmissions(nutritionEmissions.estimatedEmissions)"
      /></intermediate-emission-display>

      <source-citation-list :sources="nutritionEmissions.sources" />
    </div>

    <div id="driving" class="topic">
      <el-divider>🚗</el-divider>
      <h2>Mobilität</h2>
      <p class="question">Wie viele Kilometer fährst Du im Durchschnitt pro Woche?</p>
      <div class="options">
        <el-form :labelPosition="labelPosition" label-width="auto">
          <el-form-item label="Kilometer in der Woche">
            <el-input-number
              v-model.number="driving.weeklyAverageDistance"
              id="driving-option"
              :min="0"
              :label="'Kilometer in der Woche'"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display>
        <span v-html="formatEmissions(drivingEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="drivingEmissions.sources" />
    </div>

    <div id="heating" class="topic">
      <el-divider>🏠</el-divider>
      <h2>Heizung</h2>
      <p class="question">Wie heizt Du?</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item label="Personen im Haushalt">
            <el-input-number
              v-model.number="housing.householdSize"
              id="housing-household-size-option"
              :min="0"
              :label="'Personen im Haushalt'"
            />
          </el-form-item>
          <el-form-item label="Wohnfläche">
            <el-input-number
              v-model.number="housing.apartmentSize"
              id="housing-apartment-size-option"
              :min="0"
              :label="'Wohnfläche'"
            />
          </el-form-item>
          <el-form-item label="Baujahr">
            <el-input-number
              v-model.number="housing.apartmentAge"
              id="housing-apartment-age-option"
              :min="1900"
              :max="2021"
              :label="'Baujahr'"
            />
          </el-form-item>
          <el-form-item label="Energiequelle">
            <el-select v-model="heating.energySource">
              <el-option
                v-for="item in energySourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <intermediate-emission-display>
        <span v-html="formatEmissions(heatingEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="heatingEmissions.sources" />
    </div>

    <div id="electricity" class="topic">
      <el-divider>💡</el-divider>

      <h2>Strom</h2>
      <p class="question">Wie beziehst Du Elektrizität?</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item label="Ökostrom" :labelPosition="right">
            <el-switch v-model="electricity.greenEnergy" id="electricity-green-energy-option2">
            </el-switch>
          </el-form-item>
          <el-form-item label="Art des Haushalts">
            <el-select v-model="housing.housing" id="housing-housing-option">
              <el-option
                v-for="item in housingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display>
        <span v-html="formatEmissions(electricityEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="electricityEmissions.sources" />
    </div>

    <div id="consumerism" class="topic">
      <el-divider>🛍️</el-divider>

      <h2>Konsum</h2>
      <p class="question">Wie schätzt Du Deinen Konsum ein?</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item>
            <el-select v-model="consumerism.intensity">
              <el-option
                v-for="item in consumerismOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display>
        <span v-html="formatEmissions(consumerismEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="consumerismEmissions.sources" />
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import _ from "lodash"

import {EstimationResponse} from "./lib/estimation"
// import * as base from "./estimation/base"
import * as flying from "./lib/estimation/flying"
import * as nutrition from "./lib/estimation/nutrition"
import * as driving from "./lib/estimation/driving"
import * as electricity from "./lib/estimation/electricity"
import * as heating from "./lib/estimation/heating"
import * as consumerism from "./lib/estimation/consumerism"

import SourceCitationList from "./components/SourceCitationList.vue"
import IntermediateEmissionDisplay from "./components/IntermediateEmissionDisplay.vue"
const numberFormat = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default defineComponent({
  name: "App",
  data() {
    return {
      energySourceOptions: [
        {
          value: "oil",
          label: "Heizöl",
        },
        {
          value: "naturalGas",
          label: "Gas",
        },
        {
          value: "longDistanceHeating",
          label: "Fernwärme",
        },
        {
          value: "heatingPump",
          label: "Heizpumpe",
        },
        {
          value: "woodPellets",
          label: "Holzpellets",
        },
      ],
      housingOptions: [
        {
          value: "house",
          label: "Haus",
        },
        {
          value: "apartment",
          label: "Wohnung",
        },
      ],
      consumerismOptions: [
        {
          value: "frugal",
          label: "sparsam",
        },
        {
          value: "normal",
          label: "normal",
        },
        {
          value: "lush",
          label: "hoch",
        },
      ],
      nutritionOptions: [
        {
          value: "CARNIVORE",
          label: "fleischreich",
        },
        {
          value: "FLEXITARIAN",
          label: "flexitarisch",
        },
        {
          value: "VEGETARIAN",
          label: "vegetarisch",
        },
        {
          value: "VEGAN",
          label: "vegan",
        },
      ],

      flying: {
        nShortHauls: 4,
        nMediumHauls: 2,
        nLongHauls: 2,
      },
      nutrition: {
        diet: "CARNIVORE",
      },
      driving: {
        weeklyAverageDistance: 200,
      },
      housing: {
        householdSize: 1,
        apartmentSize: 200,
        apartmentAge: 1990,
        housing: "house",
      },
      heating: {
        energySource: "oil",
      } as heating.HeatingEstimationParams,
      electricity: {
        greenEnergy: false,
      } as electricity.ElectricityEstimationParams,
      consumerism: {
        country: "Germany",
        intensity: "lush",
      } as consumerism.ConsumerismEstimationParams,
      referenceEmissions: 22_211,
      // Styling.
      colorGradient: [
        "#57bb8a",
        "#63b682",
        "#73b87e",
        "#84bb7b",
        "#94bd77",
        "#a4c073",
        "#b0be6e",
        "#c4c56d",
        "#d4c86a",
        "#e2c965",
        "#f5ce62",
        "#f3c563",
        "#e9b861",
        "#e6ad61",
        "#ecac67",
        "#e9a268",
        "#e79a69",
        "#e5926b",
        "#e2886c",
        "#e0816d",
        "#dd776e",
      ],
      labelPosition: "top",
    }
  },
  computed: {
    totalEmissions(): number {
      return _.sum([
        this.flyingEmissions.estimatedEmissions,
        this.nutritionEmissions.estimatedEmissions,
        this.drivingEmissions.estimatedEmissions,
        this.heatingEmissions.estimatedEmissions,
        this.electricityEmissions.estimatedEmissions,
        this.consumerismEmissions.estimatedEmissions,
      ])
    },
    flyingEmissions(): EstimationResponse {
      return flying.estimateEmissions(this.flying)
    },
    nutritionEmissions(): EstimationResponse {
      return nutrition.estimateEmissions(this.nutrition)
    },
    drivingEmissions(): EstimationResponse {
      return driving.estimateEmissions(this.driving)
    },
    heatingEmissions(): EstimationResponse {
      return heating.estimateEmissions({...this.housing, ...this.heating})
    },
    electricityEmissions(): EstimationResponse {
      return electricity.estimateEmissions({...this.housing, ...this.electricity})
    },
    consumerismEmissions(): EstimationResponse {
      return consumerism.estimateEmissions(this.consumerism)
    },
    percentageOfReferenceEmissions(): number {
      return _.clamp((this.totalEmissions / this.referenceEmissions) * 100, 0, 100)
    },
  },
  methods: {
    formatEmissions(emissions) {
      return `${numberFormat.format(emissions / 1000)} Tonnen CO<sub>2</sub>e`
    },
  },
  components: {
    SourceCitationList,
    IntermediateEmissionDisplay,
  },
})
</script>

<style lang="sass">
$color: #2c3e50

@mixin center
  margin: auto
  width: 75%

html
  box-sizing: border-box

*
  box-sizing: inherit
*:before
  box-sizing: inherit
*:after
  box-sizing: inherit

body
  margin-top: 0

#app
  font-family: Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  color: $color
  margin: 0 10px

.title
  div
    display: inline
.header

  h1
    display: inline
    vertical-align: middle
  img
    display: inline
    height: 4ex
    vertical-align: middle
  text-align: center
  padding-left: 5%
  padding-right: 5%
  padding-top: 2%
  padding-bottom: 2%

  background-color: rgb(255, 255, 255)
  position: sticky

  // top left corner should start at leftmost spot
  left: 0

  // top left corner should start at topmost spot
  top: 0

  // take up the full browser width
  width: 100%

  // high z index so other content scrolls underneath
  z-index: 200





.options
  @include center
  text-align: center
</style>
