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
        !this.enabled || ( !this.isLoading && this.store.executing ) ? "buttonDisabled" : "",
        this.isLoading ? "buttonLoading" : ""
      ]
    }
  },
  methods: {
    async execute() {
      if( this.enabled && !this.store.executing && !this.isLoading && this.validation() ) {
        this.store.executing = true
        this.loading = true
        this.store.con.execute( this.command, this.data )
          .then( async function( s ) {
            //await new Promise( f => setTimeout( f, 3000 ) )
            return s
          } )
          .then( s => this.$emit( "result", s ) )
          .catch( reason => this.errorHandling ? this.$emit( "error", reason ) : this.store.setError( reason ) )
          .finally( () => this.final() )
      }
    },
    /*error( reason:unknown ):void {
      if( this.errorHandling )
        this.$emit( "error", reason )
      else
        alert( reason )
    },*/
    final():void {
      this.store.executing = false
      this.loading = false
      this.$emit( "finally" )
    }
  }
} )
</script>

<style lang="less" scoped>

</style>