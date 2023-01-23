<template>
  <div class="resourceSelector">
    <div v-for="r in resourceNames" :key="r.name" :style="r.style">
      <GameButton class="subResource" @click="data.sub( r.name )">-</GameButton>
      <div class="resourceValue">{{ data.val( r.name ) }}</div>
      <GameButton class="addResource" @click="data.add( r.name )">+</GameButton>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue"
import store from "@/store"
import {RESOURCES} from "@/model/game_data";
import GameButton from "@/components/util/GameButton.vue";

interface ResourceData {
  name:string,
  style:object
}

export class ResourceCards {
  resources:Map<string, number>
  sumResources:number
  maxResourcesAmount:number | undefined;
  maxResources:Map<string, number> | undefined

  constructor( resources:Map<string, number>, maxResourcesAmount:number | undefined, maxResources:Map<string, number> | undefined ) {
    this.resources = resources
    this.maxResourcesAmount = maxResourcesAmount
    this.sumResources = Array.from( resources.values() ).reduce( ( s, n ) => s + n, 0 )
    this.maxResources = maxResources
  }

  val( r:string ):number {
    return this.resources.get( r ) ?? 0
  }

  add( r:string ):void {
    if( this.maxResourcesAmount !== undefined && this.sumResources >= this.maxResourcesAmount )
      return
    const n = this.resources.get( r ) ?? 0
    const nMax = this.maxResources?.get( r )
    if( nMax !== undefined && n >= nMax )
      return;
    this.resources.set( r, n + 1 )
    this.sumResources++
  }

  sub( r:string ):void {
    const n:number | undefined = this.resources.get( r )
    if( n !== undefined ) {
      if( n > 1 )
        this.resources.set( r, n - 1 )
      else
        this.resources.delete( r )
      this.sumResources--
    }
  }
}

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "ResourceSelector",
  components: {GameButton},
  props: {
    resources: {
      type: Map as PropType<Map<string, number>>,
      required: true
    },
    customWidth: {
      type: String
    },
    maxWidth: {
      type: String
    },
    maxResourcesAmount: {
      type: Number
    },
    maxResources: {
      type: Map as PropType<Map<string, number>>
    }
  },
  data() {
    return {
      store,
      data: new ResourceCards( this.resources, this.maxResourcesAmount, this.maxResources )
    }
  },
  computed: {
    resourceNames():ResourceData[] {
      const width:string = this.customWidth ?? "calc( calc( 100% - 2rem ) / 5 )"
      const maxWidth:string = this.maxWidth ?? "none"
      return RESOURCES.map( function( r ) {
        return {
          name: r,
          style: {
            "width": width,
            maxWidth: maxWidth,
            backgroundImage: `url( ${require( `@/assets/images/resources/${r.toLowerCase()}.png` )} )`
          }
        }
      } )
    }
  },
  methods: {

  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  @buttonWidth: 40%;

  .resourceSelector {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    font-weight: bold;
    font-size: 1.5em;
    color: white;

    > div {
      min-width: 80px;
      aspect-ratio: 1;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      display: flex;
      align-items: end;
      justify-content: space-between;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    > div:not(:first-child) {
      margin-left: 0.5rem;
    }
  }

  .subResource, .addResource {
    height: 35%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 !important;
  }

  .subResource {
    float: left;
  }

  .resourceValue {
    height: 30%;
    float: left;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .addResource {
    float: right;
  }
</style>