<template>
  <GameButton>Build</GameButton>
  <CommandButton command="setBuildState" style="display: none" /> <!-- TODO -->
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/CommandButton.vue";
import GameButton from "@/components/GameButton.vue";

export default defineComponent({
  name: "BankTradeButton",
  components: {
    GameButton,
    CommandButton
  },
  data() {
    return {
      store
    }
  },
  computed: {
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>