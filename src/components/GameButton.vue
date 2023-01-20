<template>
  <a @click="action()" class="button" :class="loadingClass">
    <slot />
  </a>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent( {
  name: "GameButton",
  props: {
    enabled: {
      type: Boolean,
      default: true
    },
    initialLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    loadingClass() {
      return [
          !this.enabled ? "buttonDisabled" : "",
          this.initialLoading ? "buttonLoading" : ""
      ].filter( c => c.length > 0 ).join( " " )
    }
  },
  methods: {
    action() {
      if( this.enabled && !this.initialLoading )
        this.$emit( "action" )
    }
  }
} )
</script>

<style lang="less" scoped>

</style>