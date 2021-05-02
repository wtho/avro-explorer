<template>
  <div>
    <cv-header aria-label="Carbon header">
      <cv-skip-to-content href="#main-content">
        Skip to content
      </cv-skip-to-content>
      <cv-header-name href="javascript:void(0)" prefix="avro">
        explorer
      </cv-header-name>
      <template v-slot:left-panels v-if="false"> </template>
      <template v-slot:right-panels v-if="true"> </template>
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
import { Component, Prop, Vue } from 'vue-property-decorator'
import CvHeader from '@carbon/vue/src/components/cv-ui-shell/cv-header.vue'
import CvHeaderName from '@carbon/vue/src/components/cv-ui-shell/cv-header-name.vue'
import CvSkipToContent from '@carbon/vue/src/components/cv-ui-shell/cv-skip-to-content.vue'
import CvSideNav from '@carbon/vue/src/components/cv-ui-shell/cv-side-nav.vue'
import CvSideNavItems from '@carbon/vue/src/components/cv-ui-shell/cv-side-nav-items.vue'
import CvSideNavMenu from '@carbon/vue/src/components/cv-ui-shell/cv-side-nav-menu.vue'
import CvSideNavMenuItem from '@carbon/vue/src/components/cv-ui-shell/cv-side-nav-menu-item.vue'
import CvSideNavLink from '@carbon/vue/src/components/cv-ui-shell/cv-side-nav-link.vue'
import Fade16 from '@carbon/icons-vue/es/fade/16'
import MigrateAlt from '@carbon/icons-vue/es/migrate--alt/16'
import { Navigation } from '../types'

@Component({
  components: {
    CvHeader,
    CvSkipToContent,
    CvHeaderName,
    CvSideNav,
    CvSideNavItems,
    CvSideNavMenu,
    CvSideNavMenuItem,
    CvSideNavLink,
    Fade16,
    MigrateAlt,
  },
})
export default class UiShell extends Vue {
  @Prop()
  navigation?: Navigation

  @Prop()
  eventHub?: Vue

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
