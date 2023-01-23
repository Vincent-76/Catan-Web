<template>
  <Dialog :show="hasError" :content-style="{ backgroundColor: 'indianred' }" @click="unsetError()">
    <p class="dialogText">{{ error }}</p>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import Dialog from "@/components/util/Dialog.vue";

export default defineComponent({
  name: "ErrorDialog",
  components: {
    Dialog
  },
  data() {
    return {
      store
    }
  },
  computed: {
    error():string {
      return this.store.error ?? ""
    },
    hasError():boolean {
      return this.store.error !== null
    }
  },
  methods: {
    unsetError() {
      this.store.error = null
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";
</style>