<template>
  <div>
    <div class="flex-row">
      <cv-toggle
        :small="true"
        :checked="typeScriptView"
        value="typescriptViewToggle"
        class="grow-0 mr-8"
        label="TypeScript"
      >
        <template slot="text-left">human-readable</template>
        <template slot="text-right">TypeScript</template>
      </cv-toggle>
      <!-- <cv-toggle
        v-if="hasInlineTypes"
        :small="true"
        :checked="inline"
        value="inlineToggle"
        class="grow-0"
        label="Inline types"
      >
        <template slot="text-left">flat</template>
        <template slot="text-right">inline</template>
      </cv-toggle> -->
    </div>
    <h5 class="mt-1 mb-0_5">Type:</h5>
    <ae-schema-component :schema="schema" :isRootSchema="true" />
  </div>
</template>

<script lang="ts">
import { containsInnerRecordsEnumsFixed } from '@/avro-helper'
import { Schema } from '@/avro-types'
import { Component, Prop, Vue } from 'vue-property-decorator'
import AeSchemaComponent from './SchemaComponent.vue'

@Component({
  components: {
    AeSchemaComponent,
  },
})
export default class SchemaViewer extends Vue {
  @Prop()
  schema?: Schema

  inline = true
  typeScriptView = false

  get hasInlineTypes(): boolean {
    return containsInnerRecordsEnumsFixed(this.schema)
  }
}
</script>

<style lang="scss" scoped></style>
