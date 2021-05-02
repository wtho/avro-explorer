<template>
  <div :style="backgroundImageStyles">
    <h1>{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({})
export default class PageHeader extends Vue {
  @Prop({ type: String })
  title?: string

  @Prop({ type: String })
  backgroundImage?: string

  get backgroundImageStyles(): { backgroundImage?: string } {
    if (!this.backgroundImage) {
      return {}
    }
    return {
      backgroundImage: `linear-gradient(#0000, #000a), url(${this.backgroundImage})`,
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
div {
  height: 20rem;
  background-color: #000;
  color: #fff;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  border-bottom: 1px solid #393939;
  background-position: center center;
  background-size: cover;
}
h1 {
  font-weight: 300;
  line-height: 1.19;
  letter-spacing: 0;
  font-size: calc(1.3125rem + 3.125vw);
  margin-bottom: 2rem;
  margin-top: auto;
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>
<style lang="scss"></style>
