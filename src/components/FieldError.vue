<template>
  <div class="errorInfo">

  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";
  import store from "@/store";

  export default defineComponent({
    name: "FieldError",
    props: {

    },
    data() {
      return {
        store
      }
    }
  } )
</script>

<style scoped>

</style>