<template>
  <div class="flex-col grow-1">
    <ae-ui-shell :navigation="navigation" :eventHub="eventHub" />
    <ae-content :meta="meta" :topics="topics" :eventHub="eventHub" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AeUiShell from './components/UiShell.vue'
import AeContent from './components/Content.vue'
import { SchemaForTopic, Navigation } from './types'
import { project } from './project'
import { getSchemaStringName } from './avro-helper'

function navigationFromSchemaForTopic(
  schemaForTopics: SchemaForTopic[]
): Navigation {
  return {
    topics: schemaForTopics.map((schemaForTopic) => ({
      name: schemaForTopic.topic,
      schemaNames: [getSchemaStringName(schemaForTopic.schema)],
    })),
  }
}

@Component({
  components: {
    AeUiShell,
    AeContent,
  },
})
export default class App extends Vue {
  navigation = navigationFromSchemaForTopic(project.topics)
  meta = project?.meta
  topics = project?.topics
  eventHub = new Vue()

  mounted(): void {
    // TODO read from localstorage or indexeddb
    this.eventHub.$emit('view-mode', 'explorer')
    console.log('init view mode')
  }
}
</script>

<style lang="scss" src="./styles/app.scss" />

function getSchemaStringName(schema: Schema): any { throw new Error('Function
not implemented.') }
