<template>
  <div>
    <GameButton @click="showDialog()">Bank Trade</GameButton>
    <Dialog :show="show">
      <p class="selectorHeader">Give Resources</p>
      <ResourceSelector :resources="resources.give" class="selector" />
      <p class="selectorHeader">Get Resources</p>
      <ResourceSelector :resources="resources.get" class="selector" />
      <div>
        <GameButton class="cancelButton" @click="hideDialog()">Cancel</GameButton>
        <CommandButton command="bankTrade" :data="resourcesJson" class="submitButton" @result="hideDialog()">
          Bank Trade
        </CommandButton>
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue"
import store from "@/store"
import CommandButton from "@/components/util/CommandButton.vue";
import GameButton from "@/components/util/GameButton.vue";
import Dialog from "@/components/util/Dialog.vue";
import ResourceSelector from "@/components/util/ResourceSelector.vue";
import {JMap} from "@/model/game_data";

export default defineComponent({
  name: "BankTradeButtonAction",
  components: {
    ResourceSelector,
    Dialog,
    GameButton,
    CommandButton
  },
  data() {
    return {
      store,
      show: false,
      resources: reactive( {
        give: new Map() as Map<string, number>,
        get: new Map() as Map<string, number>
      } ),
      resourcesJson: ""
    }
  },
  created() {
    this.updateResourceJson( [], [] )
  },
  watch: {
    resources: {
      handler() {
        const newGive:JMap<string, number> = []
        for( const v of this.resources.give.entries() ) {
          newGive.push( { k: v[0], v: v[1] } )
        }
        const newGet:JMap<string, number> = []
        for( const v of this.resources.get.entries() ) {
          newGet.push( { k: v[0], v: v[1] } )
        }
        this.updateResourceJson( newGive, newGet )
      },
      deep: true
    }
  },
  computed: {
    /*jsonVal():string {
      const newGive:JMap<string, number> = []
      for( const v of this.resources.give.entries() ) {
        newGive.push( { k: v[0], v: v[1] } )
      }
      const newGet:JMap<string, number> = []
      for( const v of this.resources.get.entries() ) {
        newGet.push( { k: v[0], v: v[1] } )
      }
      const json:string = JSON.stringify( { give: newGive, get: newGet } )
      console.log( json )
      return json
    }*/
  },
  methods: {
    showDialog():void {
      this.show = true;
    },
    hideDialog():void {
      this.show = false;
    },
    updateResourceJson( give:JMap<string, number>, get:JMap<string, number> ):void {
      this.resourcesJson = JSON.stringify( {
        give: JSON.stringify( give ),
        get: JSON.stringify( get )
      } )
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  .selectorHeader {
    margin-bottom: 0.5rem;
    font-weight: bold;
    font-size: 1.2em;
    color: black;
  }

  .selector {
    min-width: 50vw;
    margin-bottom: 1rem;
  }

  .cancelButton, .submitButton {
    float: left;
    width: calc( 50% - 0.5rem );
  }

  .submitButton {
    float: right !important;
  }
</style>