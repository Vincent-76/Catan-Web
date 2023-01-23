<template>
  <Dialog :show="hasInfo" @click="unsetInfo()">
    <DiceInfoDialog v-if="isInfo( 'DiceInfo' )" :info="info" />
    <GatherInfoDialog v-else-if="isInfo( 'GatherInfo' )" :info="info" />
    <GotResourcesInfoDialog v-else-if="isInfo( 'GotResourcesInfo' )" :info="info" />
    <LostResourcesInfoDialog v-else-if="isInfo( 'LostResourcesInfo' )" :info="info" />
    <ResourceChangeInfoDialog v-else-if="isInfo( 'ResourceChangeInfo' )" :info="info" />
    <BankTradedInfoDialog v-else-if="isInfo( 'BankTradedInfo' )" :info="info" />
    <DrawnDevCardInfoDialog v-else-if="isInfo( 'DrawnDevCardInfo' )" :info="info" />
    <InsufficientStructuresInfoDialog v-else-if="isInfo( 'InsufficientStructuresInfo' )" :info="info" />
    <NoPlacementPointsInfoDialog v-else-if="isInfo( 'NoPlacementPointsInfo' )" :info="info" />
    <BuiltInfoDialog v-else-if="isInfo( 'BuiltInfo' )" :info="info" />
    <GameEndInfoDialog v-else-if="isInfo( 'GameEndInfo' )" :info="info" />
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import Dialog from "@/components/util/Dialog.vue";
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
import BuiltInfoDialog from "@/components/infoDialogs/BuiltInfoDialog.vue";

export default defineComponent({
  name: "InfoDialog",
  components: {
    BuiltInfoDialog,
    Dialog,
    GameEndInfoDialog,
    NoPlacementPointsInfoDialog,
    InsufficientStructuresInfoDialog,
    DrawnDevCardInfoDialog,
    BankTradedInfoDialog,
    ResourceChangeInfoDialog,
    LostResourcesInfoDialog,
    GotResourcesInfoDialog,
    GatherInfoDialog,
    DiceInfoDialog
  },
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

</style>