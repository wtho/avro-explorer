<template>
  <div v-if="isRecord" class="record">
    <p class="bx--type-mono complex-type-color">
      {{ getSchemaTypeName(schema) }}
    </p>
    <p>
      TypeName
      <b class="ml-1"
        ><span v-if="schema.namespace" class="g50">{{ schema.namespace }}.</span
        >{{ schema.name }}</b
      >
    </p>
    <!-- TODO doc - multiline? label! -->
    <p v-if="!isRootSchema && schema.doc" class="bx--type-italic">
      {{ schema.doc }}
    </p>
    <!-- TODO aliases label! -->
    <p v-if="schema.aliases">{{ schema.aliases.join(', ') }}</p>
    <p>Fields</p>
    <div class="ml-1 field-line">
      <div
        v-for="field of schema.fields"
        :key="field.name"
        class="field-line--connector"
      >
        <p>
          <b class="ml-1">{{ field.name }}</b>
        </p>
        <!-- TODO field doc -->
        <div class="ml-1 mb-1">
          <ae-schema-component :schema="field.type"></ae-schema-component>
        </div>
        <!-- TODO field default -->
        <!-- TODO field order -->
        <!-- TODO field aliases -->
      </div>
    </div>
  </div>
  <div v-else-if="isEnum">
    <p class="bx--type-mono complex-type-color">
      {{ getSchemaTypeName(schema) }}
    </p>
    <p>
      TypeName
      <b class="ml-1"
        ><span v-if="schema.namespace" class="g50">{{ schema.namespace }}.</span
        >{{ schema.name }}</b
      >
    </p>
    <!-- TODO aliases -->
    <!-- TODO doc -->
    <!-- TODO default -->
    <p>Symbols</p>
    <p class="ml-1">
      <span
        v-for="symbol of schema.symbols"
        :key="symbol"
        class="bx--type-mono pipe-between"
        >{{ symbol }}</span
      >
    </p>
  </div>
  <div v-else-if="isArray">
    <p class="bx--type-mono complex-type-color">
      {{ getSchemaTypeName(schema) }}
    </p>
    <p>
      ItemsType
      <!-- TODO use mono and colors to mark primitive/complex and give type in brackets if it has a name -->
      <b class="ml-1">{{ getSchemaStringName(schema.items) }}</b>
    </p>
    <!-- TODO default -->
  </div>
  <div v-else-if="isMap">
    <p class="bx--type-mono complex-type-color">
      {{ getSchemaTypeName(schema) }}
    </p>
    <p>
      ValuesType
      <!-- TODO use mono and colors to mark primitive/complex and give type in brackets if it has a name -->
      <b class="ml-1">{{ getSchemaStringName(schema.values) }}</b>
    </p>
  </div>
  <div v-else-if="isUnion">
    <!-- TODO union complete concept! -->
    <p class="bx--type-mono complex-type-color">
      {{ getSchemaTypeName(schema) }}
    </p>
  </div>
  <div v-else-if="isFixed">
    <p class="bx--type-mono complex-type-color">
      {{ getSchemaTypeName(schema) }}
    </p>
    <p>
      TypeName
      <b class="ml-1"
        ><span v-if="schema.namespace" class="g50">{{ schema.namespace }}.</span
        >{{ schema.name }}</b
      >
    </p>
    <p>
      Size
      <b class="ml-1 bx--type-mono">{{ schema.size }}</b>
    </p>
    <!-- TODO aliases -->
  </div>
  <div v-else-if="isPrimitiveType" class="bx--type-mono primitive-type-color">
    {{ getSchemaTypeName(schema) }}
  </div>
  <div v-else>???</div>
</template>

<script lang="ts">
import {
  getSchemaStringName,
  getSchemaTypeName,
  isArraySchema,
  isEnumSchema,
  isFixedSchema,
  isMapSchema,
  isPrimitiveType,
  isRecordSchema,
  isUnionSchema,
} from '@/avro-helper'
import { Schema } from '@/avro-types'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'AeSchemaComponent',
})
export default class SchemaComponent extends Vue {
  @Prop()
  schema?: Schema

  @Prop({ default: false })
  isRootSchema!: boolean

  get isRecord(): boolean {
    return isRecordSchema(this.schema)
  }

  get isArray(): boolean {
    return isArraySchema(this.schema)
  }

  get isMap(): boolean {
    return isMapSchema(this.schema)
  }

  get isUnion(): boolean {
    return isUnionSchema(this.schema)
  }

  get isFixed(): boolean {
    return isFixedSchema(this.schema)
  }

  get isEnum(): boolean {
    return isEnumSchema(this.schema)
  }

  get isPrimitiveType(): boolean {
    return isPrimitiveType(this.schema)
  }

  getSchemaTypeName(schema: Schema): string {
    return getSchemaTypeName(schema)
  }

  getSchemaStringName(schema: Schema): string {
    return getSchemaStringName(schema)
  }
}
</script>

<style lang="scss" scoped>
.record {
}
.field-line {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    background-color: #888;
    width: 2px;
    height: calc(100% - 0.7rem);
    left: -0.5rem;
  }
}

.field-line--connector {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 1rem;
    height: 2px;
    left: -0.5rem;
    top: 0.7rem;
    background-color: #888;
  }
}

.pipe-between:not(:last-child) {
  &::after {
    content: ' | ';
  }
}
</style>
