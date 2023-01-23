<template>
  <div v-if="show" class="dialog">
    <div class="dialogContent" :style="contentStyle">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Dialog",
  props: {
    show: {
      type: Boolean,
      required: true
    },
    contentStyle: {
      type: Object
    }
  },
  data() {
    return {}
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  .dialogContent {
    //width: 30%;
    padding: 1rem;
    border: solid 0.4rem black;
    border-radius: 1rem;
    text-align: center;
    background-color: #D09029;

    @media @portrait {
      width: auto;
      height: 40%;
    }
  }
</style>