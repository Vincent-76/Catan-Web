<template>
  <div>
    <GameButton>Bank Trade</GameButton>
    <CommandButton command="bankTrade" data="{ 'give': TODO, 'get': TODO }" style="display: none" /> <!-- TODO -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/CommandButton.vue";
import GameButton from "@/components/GameButton.vue";

export default defineComponent({
  name: "BankTradeButtonAction",
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