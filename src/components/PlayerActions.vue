<template>
  <div v-if="isState( 'DiceState' )">
    <CommandButton command="rollTheDices">
      <img :src="require( '@/assets/images/dices.png' )" alt="Roll The Dices" />
    </CommandButton>
  </div>
  <div v-if="isState( 'ActionState' )">
    <BuildButton />
    <BankTradeButton />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/CommandButton.vue";
import BuildButton from "@/components/actionButtons/BuildButton.vue";
import BankTradeButton from "@/components/actionButtons/BankTradeButton.vue";

export default defineComponent({
  name: "PlayerActions",
  components: {
    BankTradeButton,
    BuildButton,
    CommandButton
  },
  data() {
    return {
      store
    }
  },
  computed: {
  },
  methods: {
    isState( state:string ):boolean {
      return this.store.gameData?.game.state.class === state
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>