<template>
  <CommandButton command="dropHandCards" data="ResourceCards" />
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/CommandButton.vue";

export default defineComponent({
  name: "DropHandCardsAction",
  components: {
    CommandButton
  },
  data() {
    return {
      store
    }
  },
  computed: {
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>