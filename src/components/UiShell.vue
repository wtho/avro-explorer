<template>
  <div>
    <cv-header aria-label="Carbon header">
      <cv-skip-to-content href="#main-content">
        Skip to content
      </cv-skip-to-content>
      <cv-header-name href="javascript:void(0)" prefix="avro">
        explorer
      </cv-header-name>
      <template v-slot:header-global>
        <cv-header-global-action
          aria-label="App switcher"
          aria-controls="settings-panel"
        >
          <Settings20 />
        </cv-header-global-action>
      </template>
      <template v-slot:right-panels v-if="true">
        <ae-cv-header-panel id="settings-panel">
          <div class="dark-theme p-0_5">
            <cv-select
              v-model="viewMode"
              :inline="false"
              :light="false"
              label="View Mode"
            >
              <cv-select-option value="explorer">Explorer</cv-select-option>
              <cv-select-option value="avro">Avro Json Schema</cv-select-option>
              <cv-select-option value="typescript">TypeScript</cv-select-option>
            </cv-select>
          </div>
        </ae-cv-header-panel>
      </template>
    </cv-header>

    <cv-side-nav id="side-nav" fixed expanded>
      <cv-side-nav-items>
        <cv-side-nav-menu-item class="side-nav-menu-item--font-size-1">
          Schemas for topics
        </cv-side-nav-menu-item>
        <cv-side-nav-menu
          :title="topic.name"
          v-for="topic in topics"
          :key="topic.name"
          :expanded="true"
        >
          <cv-side-nav-menu-item
            href="javascript:void(0)"
            v-for="schemaName in topic.schemaNames"
            :key="schemaName"
            @click="sideNavMenuItemClicked($event, topic.name, schemaName)"
          >
            {{ schemaName }}
          </cv-side-nav-menu-item>
        </cv-side-nav-menu>
        <!-- <cv-side-nav-link href="javascript:void(0)">
          <template v-slot:nav-icon><Fade16 /></template>
          L1 link
        </cv-side-nav-link>
        <cv-side-nav-link href="javascript:void(0)">
          <template v-slot:nav-icon><Fade16 /></template>
          L1 link
        </cv-side-nav-link> -->
      </cv-side-nav-items>
    </cv-side-nav>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import AeCvHeaderPanel from './customized-carbon-vue/cv-ui-shell/cv-header-panel.vue'
import Fade16 from '@carbon/icons-vue/es/fade/16'
import Settings20 from '@carbon/icons-vue/es/settings/20'
import MigrateAlt from '@carbon/icons-vue/es/migrate--alt/16'
import { Navigation } from '../types'

@Component({
  components: {
    Fade16,
    MigrateAlt,
    Settings20,
    AeCvHeaderPanel,
  },
})
export default class UiShell extends Vue {
  @Prop()
  navigation?: Navigation

  @Prop()
  eventHub?: Vue

  viewMode: 'explorer' | 'avro' | 'typescript' = 'explorer'

  get topics(): Navigation['topics'] {
    return this.navigation?.topics ?? []
  }

  sideNavMenuItemClicked(
    clickEvent: MouseEvent | TouchEvent,
    topicName: string,
    schemaName: string
  ): void {
    if (!this.eventHub) {
      return
    }
    this.eventHub.$emit('menu-item-click', { topicName, schemaName })
  }

  @Watch('viewMode')
  onViewModeChange(val: 'explorer' | 'avro' | 'typescript'): void {
    this.eventHub?.$emit('view-mode', val)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.side-nav-menu-item--font-size-1
  > a.bx--side-nav__link
  > .bx--side-nav__link-text {
  font-size: 1rem;
}
</style>
