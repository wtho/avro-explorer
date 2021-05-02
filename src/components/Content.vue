<template>
  <div class="main-container flex-col grow-1 bg-grey">
    <ae-page-header :title="metaName" :backgroundImage="bannerImage" />
    <cv-content id="#main-content" class="bg-grey">
      <div v-if="hasMaintainer" class="my-1_5">
        Maintained by
        <cv-link
          :href="maintainerLink"
          v-if="hasMaintainerLink"
          target="_blank"
          rel="noopener noreferrer"
          >{{ maintainerName }} <Launch16 class="ml-0_2" /></cv-link
        ><span v-else>{{ maintainerName }}</span>
      </div>
      <div class="my-1_5 flex-row children-px-1">
        <a
          v-for="externalLink of externalLinks"
          :href="externalLink.url"
          :key="externalLink.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <cv-button @click="() => {}" :icon="Launch16" kind="primary">
            {{ externalLink.text }}
          </cv-button>
        </a>
      </div>
      <ae-cv-tile v-if="hasProjectDescription" class="pre my-1_5" :light="true">
        <h3 class="pb-1">Description</h3>
        {{ projectDescription }}
      </ae-cv-tile>

      <h2 class="my-1_5">Topics</h2>

      <template v-for="(rootTopic, idx) of rootTopics">
        <h3
          :key="rootTopic.topic"
          class="flex-inline-row align-items-center bx--type-mono"
        >
          <MigrateAlt class="mr-1" />{{ rootTopic.topic }}
        </h3>
        <ae-cv-tile
          class="pre my-1_5"
          kind="expandable"
          ref="schemaTile"
          :key="rootTopic.topic + '_topic'"
          :light="true"
          :data-topic-id="rootTopic.topic"
          :data-schema-id="getSchemaName(rootTopic.schema)"
          @expanded="updateExpanded(idx, $event)"
        >
          <h4
            class="pb-1 bx--type-mono"
            :class="{
              'primitive-type-color': isPrimitiveType(rootTopic.schema),
              'complex-type-color': isComplexUnnamedType(rootTopic.schema),
            }"
          >
            <span class="g50" v-if="hasNamespace(rootTopic.schema)"
              >{{ rootTopic.schema.namespace }}.</span
            >{{ getSchemaName(rootTopic.schema) }}
          </h4>
          <template slot="below">
            <p v-if="hasSchemaDoc(rootTopic.schema)" class="bx--type-italic">
              {{ getSchemaDoc(rootTopic.schema) }}
            </p>
            <ae-schema-viewer
              :expanded="expandeds[idx]"
              :viewMode="viewMode"
              :schema="rootTopic.schema"
              :rawAvroSchema="toJsonAvroSchema(rootTopic.schema)"
              :generatedTypeScript="
                generateTypeScriptFromSchema(rootTopic.schema)
              "
            />
          </template>
        </ae-cv-tile>
      </template>
    </cv-content>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import AePageHeader from './PageHeader.vue'
import AeCvTile from './customized-carbon-vue/cv-tile/cv-tile.vue'
import AeSchemaViewer from './SchemaViewer.vue'
import Launch16 from '@carbon/icons-vue/es/launch/16'
import MigrateAlt from '@carbon/icons-vue/es/migrate--alt/32'
import { ProjectMetadata, SchemaForTopic } from '../types'
import { Schema } from '@/avro-types'
import { avroToTypeScript } from 'avro-typescript'
import {
  getSchemaDoc,
  getSchemaStringName,
  hasNamespace,
  isComplexNamedSchema,
  isComplexSchema,
  isEnumSchema,
  isPrimitiveType,
  isRecordSchema,
} from '@/avro-helper'

@Component({
  components: {
    AePageHeader,
    AeSchemaViewer,
    AeCvTile,
    MigrateAlt,
    Launch16,
  },
})
export default class Content extends Vue {
  @Prop()
  meta?: ProjectMetadata

  @Prop()
  topics?: SchemaForTopic[]

  @Prop()
  eventHub?: Vue

  Launch16 = Launch16

  viewMode: 'explorer' | 'avro' | 'typescript' | null = null

  expandeds: boolean[] = []

  get metaName(): string {
    return this.meta?.name ?? '<meta.name>'
  }

  get bannerImage(): string | undefined {
    return this.meta?.projectBannerImageUrl
  }

  get hasMaintainer(): boolean {
    return !!this.maintainerName
  }

  get maintainerName(): string | undefined {
    return this.meta?.maintainer?.name
  }

  get hasMaintainerLink(): boolean {
    return !!this.maintainerLink
  }

  get maintainerLink(): string | undefined {
    return this.meta?.maintainer?.url
  }

  get externalLinks(): { url: string; text: string }[] {
    return (this.meta?.externalLinks ?? []).map(({ url, name }) => ({
      url,
      text: name ?? url,
    }))
  }

  get hasProjectDescription(): boolean {
    return !!this.projectDescription
  }

  get projectDescription(): string | undefined {
    return this.meta?.projectDescription
  }

  get rootTopics(): SchemaForTopic[] {
    return this.topics ?? []
  }

  mounted(): void {
    this.expandeds = this.rootTopics.map(() => false)

    if (!this.eventHub) {
      return
    }
    this.eventHub.$on(
      'menu-item-click',
      (event: { topicName: string; schemaName: string }) => {
        const schemaTileRef = this.$refs.schemaTile
        if (!schemaTileRef) {
          return
        }
        const schemaTiles: Vue[] = Array.isArray(schemaTileRef)
          ? (schemaTileRef as Vue[])
          : [schemaTileRef as Vue]

        const clickedSchemaTile = schemaTiles.find(
          (el) =>
            el.$attrs['data-topic-id'] === event.topicName &&
            el.$attrs['data-schema-id'] === event.schemaName
        )

        if (!clickedSchemaTile) {
          return
        }

        const focusableSchemaTile = clickedSchemaTile as Vue & {
          focus: () => void
        }
        if (
          'focus' in focusableSchemaTile &&
          typeof focusableSchemaTile.focus === 'function' &&
          focusableSchemaTile.$children.length === 1 &&
          'internalExpanded' in focusableSchemaTile.$children[0]
        ) {
          focusableSchemaTile.focus()
          const expandableTile = focusableSchemaTile.$children[0] as Vue & {
            internalExpanded: boolean
            toggle: () => void
          }
          if (!expandableTile.internalExpanded) {
            console.log(expandableTile.internalExpanded)
            expandableTile.toggle()
          }
        }
      }
    )
    this.eventHub.$on(
      'view-mode',
      (viewMode: 'explorer' | 'avro' | 'typescript') => {
        this.viewMode = viewMode

        // resize tiles
        const schemaTileRef = this.$refs.schemaTile
        if (!schemaTileRef) {
          return
        }
        const schemaTiles = Array.isArray(schemaTileRef)
          ? (schemaTileRef as (Vue & { recalculateHeight?: () => void })[])
          : [schemaTileRef as Vue & { recalculateHeight?: () => void }]
        schemaTiles.forEach((tile) => tile.recalculateHeight?.())
      }
    )
    console.log('waiting for view mode')
  }

  hasNamespace(schema: Schema): boolean {
    return hasNamespace(schema)
  }

  isPrimitiveType(schema: Schema): boolean {
    return isPrimitiveType(schema)
  }

  isComplexNamedType(schema: Schema): boolean {
    return isComplexNamedSchema(schema)
  }

  isComplexUnnamedType(schema: Schema): boolean {
    return isComplexSchema(schema) && !isComplexNamedSchema(schema)
  }

  getSchemaName(schema: Schema): string {
    return getSchemaStringName(schema)
  }

  hasSchemaDoc(schema?: Schema): boolean {
    return !!getSchemaDoc(schema)
  }

  getSchemaDoc(schema?: Schema): string | null {
    return getSchemaDoc(schema)
  }

  toJsonAvroSchema(schema?: Schema): string {
    if (!schema) {
      return '{}'
    }
    return JSON.stringify(schema, null, 2)
  }
  generateTypeScriptFromSchema(schema?: Schema): string {
    if (!schema) {
      return '// no schema'
    }
    if (isRecordSchema(schema) || isEnumSchema(schema)) {
      return avroToTypeScript(schema as any)
    }
    return '// TODO - schema not yet implemented'
  }

  updateExpanded(idx: number, val: boolean): void {
    this.$set(this.expandeds, idx, val)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../styles/carbon-utils';
h1 {
  @include carbon--type-style('productive-heading-05');
}
.main-container {
  margin-top: 3rem;
  margin-left: 16rem;
}
.bg-grey {
  background: #f4f4f4;
}

#main-content {
  display: flex;
  flex-direction: column;
}

.children-px-1 > *:not(:last-child) {
  padding-right: 1rem;
}
</style>
