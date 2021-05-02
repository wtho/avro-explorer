<template>
  <div
    data-tile="expandable"
    :class="[
      `cv-tile-expandable ${carbonPrefix}--tile--expandable`,
      { [`${carbonPrefix}--tile--is-expanded`]: internalExpanded },
    ]"
    ref="target"
    :tabindex="internalExpanded ? -1 : 0"
    :style="styleObject"
    @click="open"
    @keydown.enter="open"
    @keyup.space="open"
  >
    <div class="bx--tile-expandable-atf" ref="aboveFold">
      <button
        type="button"
        :class="`${carbonPrefix}--tile__chevron bx--btn bx--btn--ghost`"
        @click.stop="toggle"
        @keydown.enter.prevent="toggle"
        @keydown.space.prevent
        @keyup.space.prevent="toggle"
      >
        <ChevronDown16 />
      </button>
      <div :class="`${carbonPrefix}--tile-content`">
        <span
          data-tile-atf
          :class="`${carbonPrefix}--tile-content__above-the-fold`"
          ref="aboveFold"
        >
          <slot>
            <!-- Above the fold content here -->
          </slot>
        </span>
      </div>
    </div>
    <span
      :class="`${carbonPrefix}--tile-content__below-the-fold`"
      ref="belowFold"
      v-show="internalExpanded || initialized"
    >
      <slot name="below">
        <!-- Rest of the content here -->
      </slot>
    </span>
  </div>
</template>

<script>
import ChevronDown16 from '@carbon/icons-vue/es/chevron--down/16'
import { carbonPrefixMixin, methodsMixin } from '@carbon/vue/src/mixins'

export default {
  name: 'AeCvTileExpandable',
  mixins: [carbonPrefixMixin, methodsMixin({ target: ['blur', 'focus'] })],
  props: {
    expanded: Boolean,
  },
  components: { ChevronDown16 },
  data() {
    return {
      styleObject: {
        maxHeight: 'initial',
      },
      initialized: false,
      internalExpanded: this.expanded,
    }
  },
  watch: {
    expanded(val) {
      if (val !== this.internalExpanded) {
        this.toggle(val)
      }
    },
  },
  methods: {
    open(force) {
      if (this.internalExpanded === true) {
        return
      }
      this.toggle(force)
    },
    toggle(force) {
      let currentHeight = this.$el.getBoundingClientRect().height
      if (!this.initialized) {
        this.styleObject.maxHeight = `${currentHeight}px`
        this.initialized = true
      }

      this.$nextTick(() => {
        const forceType = typeof force
        this.internalExpanded =
          forceType === 'boolean' ? force : !this.internalExpanded

        const belowFoldHeight = this.$refs.belowFold.getBoundingClientRect()
          .height

        if (this.internalExpanded) {
          currentHeight += belowFoldHeight
        } else {
          currentHeight -= belowFoldHeight
        }
        this.styleObject.maxHeight = `${currentHeight}px`
        this.$parent.$emit('expanded', this.internalExpanded)
      })
    },
    recalculateHeight() {
      this.$nextTick(() => {
        const aboveFoldHeight = this.$refs.aboveFold.getBoundingClientRect()
          .height
        const belowFoldHeight = this.$refs.belowFold.getBoundingClientRect()
          .height
        const currentHeight = aboveFoldHeight + belowFoldHeight
        this.styleObject.maxHeight = `${currentHeight}px`
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.bx--tile--expandable {
  padding: 0rem;
  &.bx--tile--is-expanded {
    cursor: inherit;
    &:hover {
      background: white;
    }
    &:focus {
      outline: none;
    }
  }
}

.bx--tile-expandable-atf {
  padding: 1rem 1rem 0;
  position: relative;
}
.bx--tile-content__below-the-fold {
  padding: 0rem 1rem 1rem;
}

.bx--tile__chevron {
  padding: 0.7rem;
  height: 2.4rem;
  min-height: 2.4rem;

  svg {
    margin-left: 0;
  }
}
</style>
