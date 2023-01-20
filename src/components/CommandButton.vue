<template>
  <a @click="execute()" :class="classes">
    <slot />
  </a>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import store from "@/store"

export default defineComponent( {
  name: "CommandButton",
  props: {
    command: {
      type: String,
      required: true
    },
    data: {
      type: String,
      default: ""
    },
    validation: {
      type: Function,
      default: () => true
    },
    enabled: {
      type: Boolean,
      default: true
    },
    errorHandling: {
      type: Boolean,
      default: false
    },
    initialLoading: {
      type: Boolean,
      default: false
    },
    buttonClass: {
      type: String,
      default: "button"
    }
  },
  data() {
    return {
      store,
      loading: false
    }
  },
  computed: {
    isLoading() {
      return this.initialLoading || this.loading
    },
    classes() {
      return [
        this.buttonClass,
        !this.enabled ? "buttonDisabled" : "",
        this.isLoading ? "buttonLoading" : ""
      ]
    }
  },
  methods: {
    async execute() {
      if( this.enabled && !this.isLoading && this.validation() ) {
        this.loading = true
        this.store.con.execute( this.command, this.data )
          .then( async function( s ) {
            //await new Promise( f => setTimeout( f, 3000 ) )
            return s
          } )
          .then( s => this.$emit( "result", s ) )
          .catch( reason => this.errorHandling ? this.$emit( "error", reason ) : alert( reason ) )
          .finally( () => this.loading = false )
      }
    }
  }
} )
</script>

<style lang="less" scoped>

</style>