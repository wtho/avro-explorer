<template>
  <div
    :class="[
      `cv-header-panel`,
      `${carbonPrefix}--header-panel`,
      { [`${carbonPrefix}--header-panel--expanded`]: panelExpanded },
    ]"
    :aria-hidden="!panelExpanded ? 'true' : 'false'"
    :id="id"
    @focusout="onFocusout"
    @mousedown="onMouseDown"
  >
    <slot></slot>
  </div>
</template>

<script>
import { carbonPrefixMixin } from '@carbon/vue/src/mixins'
export default {
  name: 'AeCvHeaderPanel',
  mixins: [carbonPrefixMixin],
  props: {
    expanded: Boolean,
    id: { type: String, required: true },
  },
  mounted() {
    this.$parent.$emit('cv:panel-mounted', this)
  },
  beforeDestroy() {
    this.$parent.$emit('cv:panel-beforeDestroy', this)
  },
  data() {
    return {
      dataExpanded: this.expanded,
    }
  },
  model: {
    event: 'modelEvent',
    prop: 'expanded',
  },
  watch: {
    expanded() {
      this.panelExpanded = this.expanded
    },
  },
  computed: {
    panelExpanded: {
      get() {
        return this.dataExpanded
      },
      set(val) {
        if (this.dataExpanded !== val) {
          this.dataExpanded = val
          this.$emit('modelEvent', val)
          this.$emit('panel-resize', this)
        }
      },
    },
  },
  methods: {
    onFocusout(ev) {
      this.$parent.$emit('cv:panel-focusout', this, ev)
    },
    onMouseDown(ev) {
      if (this.$el == ev.target || this.$el.contains(ev.target)) {
        ev.cancelBubble = true
        if (this.$el == ev.target) {
          ev.preventDefault()
          const relatedVueButton = this.$parent.$children.find(
            (child) => child.ariaControls === this.id
          )
          if (!relatedVueButton || !relatedVueButton.$el) {
            return
          }
          relatedVueButton.$el.focus()
        }
      }
    },
  },
}
</script>
