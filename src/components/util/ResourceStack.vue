<template>
  <Stack :img="img" :amount="amount" :alt-text="resource" />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import Stack from "@/components/util/Stack.vue"

export default defineComponent({
  name: "ResourceStack",
  components: {Stack},
  props: {
    resource: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      store
    }
  },
  computed: {
    img() {
      return require( "@/assets/images/resources/" + this.resource.toLowerCase() + ".png" )
    },
    amount():number {
      return this.store.gameData?.game.resourceStack.find( e => e.k == this.resource )?.v ?? 0
    }
  }
})
</script>