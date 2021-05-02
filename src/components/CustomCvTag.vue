<template>
  <span
    :class="[
      `cv-tag ${carbonPrefix}--tag`,
      `${carbonPrefix}--tag--${tagKind}`,
      {
        [`${carbonPrefix}--tag--filter`]: isFilter,
        [`${carbonPrefix}--tag--disabled`]: disabled,
      },
    ]"
    role="listitem"
    :title="title"
    @keydown.enter.stop.prevent="$emit('remove')"
    @keydown.space.prevent
    @keyup.space.prevent="$emit('remove')"
  >
    <span :class="`${carbonPrefix}--tag__label`">
      {{ label }}
      <slot></slot>
    </span>
    <button
      v-if="isFilter"
      :class="`${carbonPrefix}--tag__close-icon`"
      :aria-label="clearAriaLabel"
      @click.stop.prevent="onRemove"
      :disabled="disabled"
    >
      <Close16 />
    </button>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Close16 from '@carbon/icons-vue/es/close/16'
import { carbonPrefixMixin } from '@carbon/vue/src/mixins'

const tagKinds = [
  'red',
  'magenta',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
  'gray',
  'cool-gray',
  'warm-gray',
  'high-contrast',
]

@Component({
  mixins: [carbonPrefixMixin],
  components: { Close16 },
})
export default class CustomCvTag extends Vue {
  @Prop({ type: String, default: 'Clear filter' })
  clearAriaLabel?: string

  @Prop({ type: Boolean })
  disabled?: boolean

  @Prop({ type: String, required: true })
  label!: string

  @Prop({
    type: String,
    default: tagKinds[0],
    validator(val: string): boolean {
      return tagKinds.includes(val)
    },
  })
  kind?: string

  @Prop({ type: Boolean, default: false })
  filter?: boolean

  get isFilter(): boolean {
    return this.filter || this.kind === 'filter'
  }
  get tagKind(): string | undefined {
    return this.kind === 'filter' ? 'high-contrast' : this.kind
  }
  get title(): string | null | undefined {
    return this.isFilter ? this.clearAriaLabel : null
  }

  onRemove(): void {
    if (!this.disabled) {
      this.$emit('remove')
    }
  }
}
</script>
