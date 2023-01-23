<template>
  <div id="yearOfPlentyAction">
    <p>Choose 2 Resources:</p>
    <ResourceSelector :resources="resources" custom-width="40%" :max-resources-amount="2" />
    <CommandButton command="yearOfPlentyAction" :data="resourcesJson">Confirm</CommandButton>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive} from "vue"
import store from "@/store"
import CommandButton from "@/components/util/CommandButton.vue";
import ResourceSelector from "@/components/util/ResourceSelector.vue";
import {JMap} from "@/model/game_data";

export default defineComponent({
  name: "YearOfPlentyAction",
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

  #yearOfPlentyAction {
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