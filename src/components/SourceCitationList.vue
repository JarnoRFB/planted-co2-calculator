<template>
  <div>
    <el-collapse>
      <el-collapse-item :title="t('sources')">
        <ol>
          <source-citation
            v-for="(s, index) in sources"
            :value="s.value"
            :description="s.description"
            :url="s.url.toString()"
            :valid="s.valid"
            :key="s.id"
            :index="index"
            :publicationMetadata="s.publicationMetadata"
          />
        </ol>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue"
import {SourceSchema} from "../lib/estimation/sources"
import SourceCitation from "./SourceCitation.vue"
import {useI18n} from "vue-i18n"

export default defineComponent({
  name: "SourceCitationList",
  setup() {
    const {t} = useI18n({
      inheritLocale: true,
      useScope: "global",
    })
    return {t}
  },
  props: {
    sources: {
      type: Object as PropType<Array<SourceSchema<any>>>,
      required: true,
    },
  },
  components: {SourceCitation},
})
</script>
