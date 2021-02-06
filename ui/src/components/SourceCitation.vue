<template>
  <div class="source-citation">
    <p>{{ description }}</p>
    <p>Wert {{ value }}</p>
    <p>
      Siehe <a :href="url">{{ url }}</a>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "SourceCitation",
  props: {
    value: String,
    description: String,
    url: String,
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
