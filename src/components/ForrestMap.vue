<template>
  <div id="forrestMap">
    <div id="map"></div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import L from "leaflet"
import geojson from "geojson"
import "leaflet.control.opacity"

const avatar = require("../assets/avatar.png")
const avatar2 = require("../assets/avatar2.jpg")
const avatar3 = require("../assets/avatar3.png")
const avatar4 = require("../assets/avatar4.jpg")

export default defineComponent({
  name: "ForrestMap",
  data() {
    return {
      polygons: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [8.13747381394371, 50.11072047926635, 595.2301105535371],
                  [8.136661055036814, 50.11039276457323, 593.2177361330891],
                  [8.134615863412638, 50.10913318059402, 612.0466558117424],
                  [8.13583191431877, 50.10840002670771, 611.8284799705762],
                  [8.13728662351729, 50.10855910593306, 610.5017945552754],
                  [8.138784373962718, 50.10943318639641, 605.390369479867],
                  [8.13747381394371, 50.11072047926635, 595.2301105535371],
                ],
              ],
            },
            properties: {id: "1", name: "My Forrest", imgSrc: avatar},
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [8.134706244559364, 50.11248797469204, 565.6725833724479],
                  [8.136504267869624, 50.11103076374384, 585.7655262463704],
                  [8.137521630260295, 50.11116013343039, 592.5934134112099],
                  [8.138311930125726, 50.11025500258675, 599.7148251460835],
                  [8.14041761726438, 50.11076680313661, 596.4883935215122],
                  [8.140011748411993, 50.11180795817482, 588.9555226267478],
                  [8.140478964392058, 50.11197379700923, 587.5877993832249],
                  [8.140218228177797, 50.11279042870673, 582.0990422744275],
                  [8.13815178366977, 50.11308885336652, 568.0825474145194],
                  [8.134706244559364, 50.11248797469204, 565.6725833724479],
                ],
              ],
            },
            properties: {id: "2", name: "Lisa's Forrest", imgSrc: avatar3},
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [8.131380965490344, 50.11080690624112, 610.5336135216452],
                  [8.130193993951167, 50.10918103963002, 595.6568789478581],
                  [8.13195915950577, 50.10800417292235, 598.9003172986443],
                  [8.132571810765034, 50.10611627645327, 581.0433389277117],
                  [8.135177163787857, 50.10564158139884, 579.3215136133701],
                  [8.137674738057097, 50.1045875443313, 553.1802107928983],
                  [8.139311595347806, 50.10654380333431, 589.1338893297292],
                  [8.136409514006049, 50.1079615615805, 608.7898525815293],
                  [8.131380965490344, 50.11080690624112, 610.5336135216452],
                ],
              ],
            },
            properties: {id: "3", name: "Ingos Forrest", imgSrc: avatar2},
          },
          {
            type: "Feature",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [8.134187866339795, 50.11222978459585, 573.1608089469387],
                  [8.1309347982154, 50.11160861306303, 608.545716670483],
                  [8.134604636211108, 50.1094167650032, 611.122958496014],
                  [8.136441859882167, 50.11058526253871, 591.4267749752528],
                  [8.134187866339795, 50.11222978459585, 573.1608089469387],
                ],
              ],
            },
            properties: {id: "4", name: "Heinrichs Forrest", imgSrc: avatar4},
          },
        ],
      } as geojson.GeoJsonObject,
    }
  },

  mounted() {
    const map = L.map("map").setView([50.10951, 8.13669], 16)
    const Esri_WorldImagery = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      },
    )

    const OpenStreetMap_DE = L.tileLayer(
      "https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png",
      {
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      },
    )

    const googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
      maxZoom: 18,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    })

    googleSat.addTo(map)
    Esri_WorldImagery.addTo(map)
    // OpenStreetMap_DE.addTo(map)
    // googleSat.addTo(map)

    const baseLayers: L.Control.LayersObject = {
      "2020": googleSat,
      street: OpenStreetMap_DE,
    }

    const overlays = {
      "2030": Esri_WorldImagery,
    }
    L.control
      .layers(baseLayers, overlays, {
        collapsed: false,
      })
      .addTo(map)

    L.control
      // @ts-ignore
      .opacity(overlays, {
        label: "timelapse",
        // collapsed: true,
      })
      .addTo(map)

    L.geoJSON(this.polygons, {
      style: feature => {
        switch (feature?.properties.id) {
          case "1":
            return {color: "#c9f967"}
          case "2":
            return {color: "#ae35e1"}
          case "3":
            return {color: "#fe61c9"}
          case "4":
            return {color: "#fe5902"}
          default:
            return {}
        }
      },
      onEachFeature: (feature, layer) => {
        let img
        if (feature.properties.imgSrc) {
          img = `<img style="border-radius: 50%;" src="${feature.properties.imgSrc}" width="50" height="50" alt="Profilbild" /><br/>`
        } else {
          img = ""
        }
        layer.bindPopup(`${img}${feature.properties.name}`)
      },
    }).addTo(map)
  },
})
</script>

<style scoped>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.control.opacity/dist/L.Control.Opacity.css";

#map {
  width: 100%;
  height: 400px;
}
/* See https://github.com/Leaflet/Leaflet/issues/3575#issuecomment-688644225 */
.leaflet-tile-container img {
  width: 256.5px !important;
  height: 256.5px !important;
}
</style>
