<template>
  <p class="dialogText">{{ `You traded ${giveString} for ${getString}.` }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import {resourcesString} from "@/util/util";

export default defineComponent({
  name: "BankTradedInfoDialog",
  props: {
    info: {
      required: true
    }
  },
  data() {
    return {
      store
    }
  },
  computed: {
    i():any {
      return this.info
    },
    giveString():string {
      return resourcesString( "", this.i.give )
    },
    getString():string {
      return resourcesString( "", this.i.get )
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";


</style>