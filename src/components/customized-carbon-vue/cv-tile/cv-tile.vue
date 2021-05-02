<template>
  <component
    :is="tagType"
    :class="[
      `cv-tile ${carbonPrefix}--tile`,
      { [`${carbonPrefix}--tile--light`]: isLight },
    ]"
    :checked="selected"
    :expanded="expanded"
    v-bind="$attrs"
    v-on="$listeners"
    ref="tile"
  >
    <!-- can i now click on this -->
    <template>
      <slot></slot>
    </template>
    <template slot="below">
      <slot name="below"></slot>
    </template>
  </component>
</template>

<script>
import {
  themeMixin,
  carbonPrefixMixin,
  methodsMixin,
} from '@carbon/vue/src/mixins'
import AeCvTileClickable from './_cv-tile-clickable'
import AeCvTileExpandable from './_cv-tile-expandable'
import AeCvTileSelectable from './_cv-tile-selectable'
import AeCvTileStandard from './_cv-tile-standard'

export default {
  name: 'AeCvTile',
  inheritAttrs: false,
  model: {
    // required for selectable kind
    prop: 'modelValue',
    event: 'modelEvent',
  },
  mixins: [
    themeMixin,
    carbonPrefixMixin,
    methodsMixin({ tile: ['blur', 'focus'] }),
  ],
  components: {
    AeCvTileClickable,
    AeCvTileExpandable,
    AeCvTileSelectable,
    AeCvTileStandard,
  },
  props: {
    expanded: Boolean,
    selected: Boolean,
    kind: {
      type: String,
      default: '',
      validator: (value) =>
        ['clickable', 'expandable', 'selectable', 'standard', ''].includes(
          value
        ),
    },
  },
  computed: {
    tagType() {
      switch (this.kind) {
        case 'clickable':
          return 'ae-cv-tile-clickable'
        case 'selectable':
          return 'ae-cv-tile-selectable'
        case 'expandable':
          return 'ae-cv-tile-expandable'
        default:
          return 'ae-cv-tile-standard'
      }
    },
  },
  methods: {
    recalculateHeight() {
      if (this.kind === 'expandable') {
        this.$refs.tile.recalculateHeight()
      }
    }
  //   focus() {
  //     if (this.$children[0].focus) {
  //       this.$children[0].focus();
  //     }
  //   },
  //   blur() {
  //     if (this.$children[0].blur) {
  //       this.$children[0].blur();
  //     }
  //   },
  },
}
</script>
