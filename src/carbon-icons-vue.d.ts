declare module '@carbon/icons-vue/es/fade/16' {
  import { Vue } from 'vue'
  export default Vue
}

declare module '@carbon/icons-vue/es/migrate--alt/16' {
  import { Vue } from 'vue'
  export default Vue
}
declare module '@carbon/icons-vue/es/migrate--alt/32' {
  import { Vue } from 'vue'
  export default Vue
}

declare module '@carbon/icons-vue/es/close/16' {
  import { Vue } from 'vue'
  export default Vue
}
declare module '@carbon/icons-vue/es/launch/16' {
  import { Vue } from 'vue'
  export default Vue
}

declare module '@carbon/vue/src/mixins' {
  import { Vue } from 'vue'
  declare const carbonPrefixMixin: typeof Vue
  export { carbonPrefixMixin }
}

declare module '@carbon/vue' {
  import { PluginObject } from 'vue'
  const plugin: PluginObject<unknown>
  export default plugin
}
