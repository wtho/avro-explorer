<template>
  <div>
    <h5 v-if="viewMode === 'explorer'" class="mt-1 mb-0_5">Type:</h5>
    <ae-schema-component
      v-if="viewMode === 'explorer'"
      :schema="schema"
      :isRootSchema="true"
    />

    <h5 v-if="viewMode === 'avro'" class="mt-1 mb-0_5">Avro Schema:</h5>
    <div v-if="viewMode === 'avro'" class="editor-container">
      <monaco-editor
        v-if="expanded"
        language="json"
        v-model="editableAvroSchema"
        class="editor"
      ></monaco-editor>
    </div>

    <h5 v-if="viewMode === 'typescript'" class="mt-1 mb-0_5">
      TypeScript types:
    </h5>
    <div v-if="viewMode === 'typescript'" class="editor-container">
      <monaco-editor
        v-if="expanded"
        language="typescript"
        v-model="editableTypeScriptCode"
        class="editor"
      ></monaco-editor>
    </div>
  </div>
</template>

<script lang="ts">
import { containsInnerRecordsEnumsFixed } from '@/avro-helper'
import { Schema } from '@/avro-types'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import AeSchemaComponent from './SchemaComponent.vue'
import MonacoEditor from 'vue-monaco'

@Component({
  components: {
    AeSchemaComponent,
    MonacoEditor,
  },
})
export default class SchemaViewer extends Vue {
  @Prop()
  expanded?: boolean

  @Prop()
  schema?: Schema

  @Prop()
  viewMode?: 'explorer' | 'avro' | 'typescript'

  @Prop()
  rawAvroSchema?: string

  @Prop()
  generatedTypeScript?: string

  inline = true
  editableAvroSchema = ''
  editableTypeScriptCode = ''

  get hasInlineTypes(): boolean {
    return containsInnerRecordsEnumsFixed(this.schema)
  }

  @Watch('rawAvroSchema')
  updateRawAvroSchema(newSchema: string): void {
    this.editableAvroSchema = newSchema
  }

  @Watch('generatedTypeScript')
  updateTypeScriptCode(newCode: string): void {
    this.editableTypeScriptCode = newCode
  }

  mounted(): void {
    this.editableAvroSchema = this.rawAvroSchema ?? ''
    this.editableTypeScriptCode = this.generatedTypeScript ?? ''
  }
}
</script>

<style lang="scss" scoped>
.editor,
.editor-container {
  height: 400px;
}
</style>
