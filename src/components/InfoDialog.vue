<template>
  <div v-if="hasInfo" class="dialog" @click="unsetInfo()">
    <div id="gameInfo">
      <DiceInfoDialog v-if="isInfo( 'DiceInfo' )" :info="info" />
      <GatherInfoDialog v-else-if="isInfo( 'GatherInfo' )" :info="info" />
      <GotResourcesInfoDialog v-else-if="isInfo( 'GotResourcesInfo' )" :info="info" />
      <LostResourcesInfoDialog v-else-if="isInfo( 'LostResourcesInfo' )" :info="info" />
      <ResourceChangeInfoDialog v-else-if="isInfo( 'ResourceChangeInfo' )" :info="info" />
      <BankTradedInfoDialog v-else-if="isInfo( 'BankTradedInfo' )" :info="info" />
      <DrawnDevCardInfoDialog v-else-if="isInfo( 'DrawnDevCardInfo' )" :info="info" />
      <InsufficientStructuresInfoDialog v-else-if="isInfo( 'InsufficientStructuresInfo' )" :info="info" />
      <NoPlacementPointsInfoDialog v-else-if="isInfo( 'NoPlacementPointsInfo' )" :info="info" />
      <GameEndInfoDialog v-else-if="isInfo( 'GameEndInfo' )" :info="info" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import {PlayerID} from "@/model/game_data";
import DiceInfoDialog from "@/components/infoDialogs/DiceInfoDialog.vue";
import GatherInfoDialog from "@/components/infoDialogs/GatherInfoDialog.vue";
import GotResourcesInfoDialog from "@/components/infoDialogs/GotResourcesInfoDialog.vue";
import LostResourcesInfoDialog from "@/components/infoDialogs/LostResourcesInfoDialog.vue";
import ResourceChangeInfoDialog from "@/components/infoDialogs/ResourceChangeInfoDialog.vue";
import BankTradedInfoDialog from "@/components/infoDialogs/BankTradedInfoDialog.vue";
import DrawnDevCardInfoDialog from "@/components/infoDialogs/DrawnDevCardInfoDialog.vue";
import InsufficientStructuresInfoDialog from "@/components/infoDialogs/InsufficientStructuresInfoDialog.vue";
import NoPlacementPointsInfoDialog from "@/components/infoDialogs/NoPlacementPointsInfoDialog.vue";
import GameEndInfoDialog from "@/components/infoDialogs/GameEndInfoDialog.vue";

export default defineComponent({
  name: "InfoDialog",
  components: {
    GameEndInfoDialog,
    NoPlacementPointsInfoDialog,
    InsufficientStructuresInfoDialog,
    DrawnDevCardInfoDialog,
    BankTradedInfoDialog,
    ResourceChangeInfoDialog,
    LostResourcesInfoDialog, GotResourcesInfoDialog, GatherInfoDialog, DiceInfoDialog},
  data() {
    return {
      store
    }
  },
  computed: {
    info():any {
      return this.store.info
    },
    hasInfo():boolean {
      return this.store.info !== null
    }
  },
  methods: {
    unsetInfo() {
      this.store.info = null
    },
    isInfo( info:string ) {
      return this.store.info?.class === info
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  .gameStack {
    height: 100%;
    text-align: center;
    color: white;
    font-size: 1.2em;

    @media @portrait {
      font-size: 0.8em;
    }

    .gameStackImg {
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      height: 70%;
      max-width: 90%;
      margin: auto;

      @media @portrait {
        width: 45%;
        transform: rotate( -90deg );
      }
    }

    > p {
      height: 30%;
      margin: 0;

      @media @portrait {
        margin-top: -15%;
      }
    }
  }
</style>