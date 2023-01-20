<template>
  <div>
    <GameButton>Player Trade</GameButton>
    <CommandButton command="setPlayerTradeState" data="{ 'give': TODO, 'get': TODO }" style="display: none" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/CommandButton.vue";
import GameButton from "@/components/GameButton.vue";

export default defineComponent({
  name: "SetPlayerTradeButtonAction",
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