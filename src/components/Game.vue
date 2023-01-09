<template>
  <div id="background">
    <GameStack str="TEEEST" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue"
  import GameStack from "@/components/GameStack.vue"

  export default defineComponent( {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Game",
    components: {
      GameStack
    }
  } )
</script>

<style scoped>
  #background {
    width: 100%;
    height: 100%;
    background-color: green;
  }
</style>