<template>
  <div id="playerListPanel" class="col-lg-9 mx-0">
    <PlayerCard v-for="p in players" :key="p.id.id" :player="p" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import PlayerCard from "@/components/PlayerCard.vue";
import {ClassicPlayer} from "@/model/game_data";

export default defineComponent({
  name: "PlayerList",
  components: {
    PlayerCard
  },
  data() {
    return {
      store
    }
  },
  computed: {
    players():ClassicPlayer[] {
      return this.store.gameData?.game.players.map( e => e.v ).sort( ( p1, p2 ) => p1.id.id - p2.id.id ) ?? []
    },

  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #playerListPanel {
    width: 100%;
    height: 75%;
    background-image: url( "~@/assets/images/stone_background.jpg" );
    background-position: center;
    background-size: 430px;
    background-repeat: repeat;
    padding: @playerCardMargin 0 @playerCardMargin 0;
    display: flex;
    flex-direction: column;

    @media @portrait {
      height: 100%;
      flex-direction: row;
      padding: 0 @playerCardMargin 0 @playerCardMargin;
    }
  }
</style>