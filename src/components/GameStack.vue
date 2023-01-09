<template>
  <p class="test">{{ str }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  name: "GameStack",
  props: {
    str: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      game: null
    }
  }
})
</script>

<style>
.test {
  color: red;
}
</style>