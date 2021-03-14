<template>
  <div class="emissions">
    <el-tag effect="plain">
      <b><slot></slot></b>
    </el-tag>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"

export default defineComponent({
  name: "IntermediateEmissionDisplay",
  props: {},
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="sass">
@mixin center
  margin: auto
  width: 75%

.emissions
  @include center
  text-align: center
</style>
