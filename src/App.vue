<template>
  <planter-page></planter-page>
  <div class="header">
    <h1 class="title">
      <img
        src="https://uploads-ssl.webflow.com/5fc25896c145ac50c7d2af7b/5fd092f58ae2717a5d82e8a7_PLANTED_LOGO_WORTBILDMARKE.svg"
        loading="eager"
        alt=""
      />
      C0<sub>2</sub>&nbsp;Rechner
    </h1>
    <div id="introduction">
       <span v-html="t('introduction')"></span>
    </div>
  </div>
  <div class="total">
    <el-progress
      :text-inside="true"
      :show-text="true"
      :stroke-width="50"
      :percentage="percentageOfReferenceEmissions"
      :color="colorGradient"
    >
      <b> <span v-html="formatEmissions(totalEmissions)"> </span> </b>&nbsp;&nbsp;
    </el-progress>
  </div>

  <div id="questions">
    <div id="flying" class="topic">
      <el-divider>✈️</el-divider>
      <p class="question">{{ t("questionFlying") }}</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item :label="t('shortHauls')">
            <el-input-number
              id="nShortHauls-option"
              v-model="flying.nShortHauls"
              :min="0"
              :label="t('shortHauls')"
            ></el-input-number>
          </el-form-item>
          <el-form-item :label="t('mediumHauls')">
            <el-input-number
              id="nMediumHauls-option"
              v-model="flying.nMediumHauls"
              :min="0"
              :label="t('mediumHauls')"
            ></el-input-number>
          </el-form-item>
          <el-form-item :label="t('mediumHauls')">
            <el-input-number
              id="nLongHauls-option"
              v-model="flying.nLongHauls"
              :min="0"
              :label="t('mediumHauls')"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display
        ><span v-html="formatEmissions(flyingEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="flyingEmissions.sources" />
    </div>

    <div id="driving" class="topic">
      <el-divider>🚗</el-divider>
      <p class="question">{{ t("drivingQuestion") }}</p>
      <div class="options">
        <el-form :labelPosition="labelPosition" label-width="auto">
          <el-form-item :label="t('kilometersPerWeek')">
            <el-input-number
              v-model.number="driving.weeklyAverageDistance"
              id="driving-option"
              :min="0"
              :step="10"
              :label="t('kilometersPerWeek')"
            ></el-input-number>
          </el-form-item>
        </el-form>
      </div>

      <intermediate-emission-display>
        <span v-html="formatEmissions(drivingEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="drivingEmissions.sources" />
    </div>

    <div id="housing" class="topic">
      <el-divider>🏠</el-divider>
      <p class="question">{{ t("housingQuestion") }}</p>
      <div class="options">
        <el-form :label-position="labelPosition" label-width="auto">
          <el-form-item :label="t('householdSize')">
            <el-input-number
              v-model.number="housing.householdSize"
              id="housing-household-size-option"
              :min="1"
              :label="t('householdSize')"
            />
          </el-form-item>
          <el-form-item :label="t('apartmentSize')">
            <el-input-number
              v-model.number="housing.apartmentSize"
              id="housing-apartment-size-option"
              :min="0"
              :step="10"
              :label="t('apartmentSize')"
            />
          </el-form-item>
          <el-form-item :label="t('apartmentAge')">
            <el-input-number
              v-model.number="housing.apartmentAge"
              id="housing-apartment-age-option"
              :min="1900"
              :max="2021"
              :step="10"
              :label="t('apartmentAge')"
            />
          </el-form-item>

          <el-form-item :label="t('housing.type')">
            <el-select v-model="housing.housing" id="housing-housing-option">
              <el-option
                v-for="item in housingOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('energySource')">
            <el-select v-model="heating.energySource">
              <el-option
                v-for="item in energySourceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item :label="t('greenEnergy')">
            <el-switch v-model="electricity.greenEnergy" id="electricity-green-energy-option2">
            </el-switch>
          </el-form-item>
        </el-form>
      </div>
      <intermediate-emission-display>
        <span v-html="formatEmissions(housingEmissions.estimatedEmissions)"
      /></intermediate-emission-display>
      <source-citation-list :sources="housingEmissions.sources" />
    </div>

    <div id="nutrition" class="topic">
      <el-divider>🍜</el-divider>

      <p class="question">{{ t("nutritionQuestion") }}</p>
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

    <div id="consumerism" class="topic">
      <el-divider>🛍️</el-divider>
      <p class="question">{{ t('consumerismQuestion') }}</p>
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
  <div id="result" >
    <div id="summary" v-html="t('result', {totalEmissions: formatEmissions(totalEmissions), relationToAverage})"></div>
    <div id="suggestion">
      {{ suggestion }}
    </div>
  </div>


</template>

<script lang="ts">
import {defineComponent} from "vue"
import _ from "lodash"
import { useI18n } from 'vue-i18n'

import {EstimationResponse, Units} from "./lib/estimation"
// import * as base from "./estimation/base"
import * as flying from "./lib/estimation/flying"
import * as nutrition from "./lib/estimation/nutrition"
import * as driving from "./lib/estimation/driving"
import * as electricity from "./lib/estimation/electricity"
import * as heating from "./lib/estimation/heating"
import * as consumerism from "./lib/estimation/consumerism"

import PlanterPage from "./components/PlanterPage.vue"
import SourceCitationList from "./components/SourceCitationList.vue"
import IntermediateEmissionDisplay from "./components/IntermediateEmissionDisplay.vue"
const numberFormat = new Intl.NumberFormat("de-DE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export default defineComponent({
  name: "App",
    setup() {
    const { t, n, locale } = useI18n({
      inheritLocale: true,
      useScope: 'local'
    })
    return { t, n, locale }
  },
  mounted() {
    this.windowWidth = window.innerWidth
    window.addEventListener("resize", () => {
      this.windowWidth = window.innerWidth
    })
  },
  data() {
    return {
      windowWidth: 0,
      energySourceOptions: this.i18nOptions( [
        "housing.options.oil",
        "housing.options.naturalGas",
        "housing.options.longDistanceHeating",
        "housing.options.heatingPump",
        "housing.options.woodPellets",
      ]),

      housingOptions: this.i18nOptions( [
        "housing.options.house",
        "housing.options.apartment",
      ]),
      consumerismOptions: this.i18nOptions([
        "consumerism.options.frugal",
        "consumerism.options.normal",
        "consumerism.options.lush",

      ]),
      nutritionOptions: this.i18nOptions([
        "nutrition.options.CARNIVORE",
        "nutrition.options.FLEXITARIAN",
        "nutrition.options.VEGETARIAN",
        "nutrition.options.VEGAN",
      ]),
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
      referenceAverageEmissions: 11_170,
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
    housingEmissions(): EstimationResponse {
      return {
        estimatedEmissions:
          this.heatingEmissions.estimatedEmissions + this.electricityEmissions.estimatedEmissions,
        unit: Units.KG_CO2E_PER_YEAR,
        sources: this.heatingEmissions.sources.concat(this.electricityEmissions.sources),
      }
    },
    consumerismEmissions(): EstimationResponse {
      return consumerism.estimateEmissions(this.consumerism)
    },
    percentageOfReferenceEmissions(): number {
      return _.clamp((this.totalEmissions / this.referenceEmissions) * 100, 0, 100)
    },
    percentageOfReferenceAverageEmissions(): number {
      return (this.totalEmissions / this.referenceAverageEmissions) * 100
    },
    relationToAverage(): string {
      if (this.percentageOfReferenceAverageEmissions < 65) {
        return this.t("relation.farBelow")
      } else if (this.percentageOfReferenceAverageEmissions < 100) {
        return this.t("relation.below")
      } else if (
        this.percentageOfReferenceAverageEmissions >= 100 &&
        this.percentageOfReferenceAverageEmissions < 150
      ) {
        return this.t("relation.above")
      } else {
        return this.t("relation.farAbove")
      }
    },
    suggestion(): string {
      if (this.heating.energySource == "oil") {
        return `Try moving away from oil to heat your home.`
      } else if (!this.electricity.greenEnergy) {
        return `Switch to a green energy provider. It is simpler than you think!`
      } else {
        return `Wow, you are leading a low carbon life style! Engage friends in family to join you. Have you told them about them planted?`
      }
    },
    labelPosition(): string {
      return this.windowWidth > 800 ? "right" : "top"
    },
  },
  methods: {
    formatEmissions(emissions) {
      return `${this.n(emissions / 1000)} ${this.t("tonsCarbon")}` 
    },
    i18nOptions(options){ 
      return options.map(opt => ({value: opt.split(".").pop(), label: this.t(opt)}))

},
  },
  components: {
    SourceCitationList,
    IntermediateEmissionDisplay,
    PlanterPage,
  },
})
</script>

<style lang="scss">
$color: #2c3e50;
$font-size-1: 2em;
$font-size-2: 1.4em;
$font-size-3: 1.1em;

/* TODO refactor redundant styles */
$planted-background: #bfb8a3;
$planted-yellow: #c9f967;
$planted-cta: #ae35e1;
$planted-pink: #fe61c9;
$planted-amber: #8a231c;
$planted-orange: #fe5902;
$planted-brown: #926c3d;
$planted-blue: #4a83f3;
$planted-gray: #2b232f;

@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');

@font-face {
  font-family: 'Brule';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src:
    local(''),
    url('assets/brule-bold.woff') format('woff');
}

@mixin center {
  margin: auto;
  width: 75%;
}
html {
  box-sizing: border-box;
}
* {
  box-sizing: inherit;
}
*:before {
  box-sizing: inherit;
}
*:after {
  box-sizing: inherit;
}
body {
  margin-top: 0;
}

#app {
  font-family: 'Inter', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $planted-background;
  color: $color;
  margin: 0 10px;
}

#questions,
#result {
  background-color: #ffffff;
}

@media screen and (min-width: 1100px) {
  #app {
    width: 1100px;
    margin: 10px auto;
  }
}

.title {
  div {
    display: inline;
  }
}

h1, h2, h3, h4, h5 {
  font-family: 'Brule', cursive;
  font-weight: 400;
  text-transform: uppercase;
}

.header {
  h1 {
    display: inline;
    vertical-align: middle;
  }
  img {
    display: inline;
    height: 4ex;
    vertical-align: middle;
  }
  text-align: center;
  padding-left: 5%;
  padding-right: 5%;
  padding-top: 2%;
  padding-bottom: 0;


  background-color: rgb(255, 255, 255);

  // top left corner should start at leftmost spot
  //left: 0

  // top left corner should start at topmost spot
  top: 0;

  // take up the full browser width
  width: 100%;
}
.question {
  font-size: $font-size-1;
  font-weight: 700;
  margin-left: 2%;
  margin-right: 2%;

  margin-top: 4%;
  margin-bottom: 4%;
}
.el-collapse {
  margin-left: 2%;
  margin-right: 2%;
}
.total {
  background-color: rgb(255, 255, 255);
  padding-top: 5%;
  padding-bottom: 2%;

  position: sticky;
  // take up the full browser width
  width: 100%;

  // high z index so other content scrolls underneath
  z-index: 200;
  top: 0;
}
.options {
  @include center;
  text-align: center;
}

@mixin text-block {
  text-align: justify;
  font-size: $font-size-2;
  margin: 1% auto;
}
#introduction {
  @include text-block;
}
#result {
  @include text-block;
  margin: 5% auto;
}
</style>


<i18n>
{
  "en": {
    "introduction": "Calculate your carbon footprint!",
    "questionFlying": "How often did you fly in the last 12 month?",
    "shortHauls": "Short hauls",
    "mediumHauls": "Medium hauls",
    "longHauls": "Long hauls",
        "drivingQuestion": "How many kilometers do you drive by car every week?",
    "kilometersPerWeek": "Kilometers per Week",
    "housingQuestion": "Heating and Electricity",
    "householdSize": "People in your household",
    "apartmentSize": "Apartment size",
    "apartmentAge": "Year of construction",
    "energySource": "Energy source",
    "greenEnergy": "Green Energy",
    "housing": {
          "type": "Type of housing",

      "options": {
        "oil": "Oil",
        "naturalGas": "Gas",
        "longDistanceHeating": "Long distance heating",
        "heatingPump": "Heating pump",
        "woodPellets": "Wood pellets",
        "house": "House",
        "apartment": "Apartment",
      }
    },

    "nutritionQuestion":"What does your diet look like?",
    "nutrition": {
      "options": {
        "CARNIVORE":"Lots of meat",
        "FLEXITARIAN": "Plant based",
        "VEGETARIAN": "Vegetarian",
        "VEGAN": "Vegan",
        },
    },
    "consumerismQuestion": "How do you shop?",
    "consumerism": {
      "options": {
        "frugal": "Frugal",
        "normal": "Normal",
        "lush": "Lush",
      },
    },

    "sources": "Sources",
    "tonsCarbon": "tons CO<sub>2</sub>e",
    "result": "With a footprint of {totalEmissions} you are {relationToAverage} the average of 11 tons.",
    "relation": {
      "farBelow": "far below",
      "below": "below",
      "over": "above",
      "farAbove": "far above",
    },
  },
  "de": {
    "introduction": "Willkommen zum planted CO<sub>2</sub> Rechner! Mit Fragen zu 5 Faktoren kannst du ganz schnell Deinen persönlichen Fußabdruck in CO<sub>2</sub> Äquivalenten (CO<sub>2</sub>e) abschätzen. Dein Fußabdruck wird interaktiv für sowohl jeden Faktor, als auch insgesamt berechnet. Die Quellen zu jedem Faktor sind angegeben und der Quellcode ist auf <a href=\"https://github.com/JarnoRFB/planted-co2-calculator\">GitHub</a> verfügbar. <br /> Alle Optionen sind auf einen großen Fußabdruck voreingestellt. Finde heraus wie viel CO<sub>2</sub> Du bereits sparst und wo noch Verbesserungspotenziale bestehen. Viel Spaß!",
    "questionFlying": "Wie oft bist Du in den letzten zwölf Monaten geflogen?",
    "shortHauls": "Kurzstreckenflüge",
    "mediumHauls": "Mittelstreckenflüge",
    "longHauls": "Langstreckenflüge",

    "drivingQuestion": "Wie viele Kilometer fährst Du pro Woche mit dem Auto?",
    "kilometersPerWeek": "Kilometer in der Woche",
    "housingQuestion": "Heizung und Strom",
    "householdSize": "Personen im Haushalt",
    "apartmentSize": "Wohnfläche",
    "apartmentAge": "Baujahr",
    "energySource": "Energiequelle",
    "greenEnergy": "Ökostrom",
    "housing": {
      "type": "Art des Haushalts",

      "options": {
        "oil": "Heizöl",
        "naturalGas": "Gas",
        "longDistanceHeating": "Fernwärme",
        "heatingPump": "Heizpumpe",
        "woodPellets": "Holzpellets",
        "house": "Haus",
        "apartment": "Wohnung",
      }
    },


    "nutritionQuestion":"Wie ernährst Du Dich?",
    "nutrition": {
      "options": {
        "CARNIVORE":"fleischreich",
        "FLEXITARIAN": "flexitarisch",
        "VEGETARIAN": "vegetarisch",
        "VEGAN": "vegan",
        },
    },
    "consumerismQuestion":"What does your diet look like?",
    "consumerism": {
      "options": {
        "frugal": "sparsam",
        "normal": "normal",
        "lush": "hoch",
      },
    },
    "tonsCarbon": "Tonnen CO<sub>2</sub>e",
    "result": "Mit einem Fußabdruck von {totalEmissions} liegts Du dem {relationToAverage} deutschen Durchschnitt von 11 Tonnen. Kompensiere Deinen Fußabdruck jetzt einfach bei <a href=\"https://planted.green/\">planted.green</a>.",
    "relation": {
      "farBelow": "weit unter",
      "below": "unter",
      "over": "über",
      "farAbove": "weit über",
    },
  }
}
</i18n>