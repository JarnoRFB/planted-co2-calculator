<template>
  <div class="source-citation">
    <p>{{ description }}</p>
    <p>Wert <span v-html="jsonValue"></span></p>
    <p>
      Siehe <a :href="url">{{ url }}</a>
    </p>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "SourceCitation",
  props: {
    value: String,
    description: String,
    url: String,
  },
  computed: {
    jsonValue(): any {
      if (typeof this.value === "object") {
        return `<code>${JSON.stringify(this.value, null, 2)} </code>`
      } else {
        return this.value
      }
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
.source-citation
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: left
</style>
