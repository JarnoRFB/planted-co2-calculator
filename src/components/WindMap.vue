<template>
  <div id="wind-map" class="map"></div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import L from "leaflet"

export default defineComponent({
  name: "WindMap",
  data() {
    return {}
  },

  mounted() {
    const map = L.map("wind-map").setView([24.0629, 120.56556], 16)
    const Esri_WorldImagery = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
      },
    )

    Esri_WorldImagery.addTo(map)

    L.circleMarker([24.0629, 120.56556], {radius: 50})
      .addTo(map)
      .bindPopup(
        `By harnessing the power of prevailing coastal winds to generate clean energy, the Changbin and Taichung wind farms power Taiwanese homes, while helping to expand Taiwan's renewable energy industry. <br/><a href="https://www.southpole.com/publications/project-fact-sheet-changbin-and-taichung-wind-power-taiwan">More information.<a/>`,
      )
      .openPopup()
  },
})
</script>

<style scoped>
@import "~leaflet/dist/leaflet.css";

.map {
  width: 100%;
  height: 400px;
}
/* See https://github.com/Leaflet/Leaflet/issues/3575#issuecomment-688644225 */
.leaflet-tile-container img {
  width: 256.5px !important;
  height: 256.5px !important;
}
</style>
