<template>
  <div id="dropHandCardsAction">
    <p>{{ "Choose " + dropCardAmount + " Resources:" }}</p>
    <ResourceSelector
        :resources="resources"
        custom-width="40%"
        :max-resources-amount="dropCardAmount"
        :max-resources="playerResources"
    />
    <CommandButton command="dropHandCards" :data="resourcesJson">Confirm</CommandButton>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue"
import store from "@/store"
import CommandButton from "@/components/util/CommandButton.vue";
import ResourceSelector from "@/components/util/ResourceSelector.vue";
import {JMap} from "@/model/game_data";

export default defineComponent({
  name: "DropHandCardsAction",
  components: {
    ResourceSelector,
    CommandButton
  },
  data() {
    return {
      store,
      resources: reactive( new Map() as Map<string, number> ),
      resourcesJson: ""
    }
  },
  watch: {
    resources: {
      handler() {
        const newResources:JMap<string, number> = []
        for( const v of this.resources.entries() ) {
          newResources.push( { k: v[0], v: v[1] } )
        }
        this.updateResourceJson( newResources )
      },
      deep: true
    }
  },
  computed: {
    playerResources():Map<string, number> {
      return this.store.gameData?.game.players.find( e =>
          e.k.id === this.store.gameData?.playerID?.id
      )?.v.resources.reduce( function( m, e ) {
        m.set( e.k, e.v )
        return m
      }, new Map() as Map<string, number> ) ?? new Map()
    },
    dropCardAmount():number {
      return Math.floor( ( Array.from( this.playerResources.values() ).reduce( ( s, n ) => s + n, 0 ) ?? 0 ) / 2 )
    }
  },
  methods: {
    updateResourceJson( resources:JMap<string, number> ):void {
      this.resourcesJson = JSON.stringify( resources )
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #dropHandCardsAction {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  p {
    font-weight: bold;
    font-size: 1.2em;
    color: white;
  }
</style>