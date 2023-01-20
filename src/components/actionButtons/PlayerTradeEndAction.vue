<template>
  <CommandButton command="playerTrade" data="PlayerID" />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/CommandButton.vue";

export default defineComponent({
  name: "PlayerTradeEndAction",
  components: {
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