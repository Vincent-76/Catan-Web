<template>
  <div id="gameField" :style="gameFieldStyle">
    <div v-for="(row, i) in rows" :key="i" class="fieldRow" :style="fieldRowStyle">
      <div v-if="definedHexesEven( row )" class="fieldRowSpacer"></div>
      <div v-for="n in leadingUndefinedHexes( row )" :key="n" class="hexSpacer"></div>
      <FieldHex v-for="hex in definedHexes( row )" :key="hex.hID" :hex="hex" :resource-area-nr="resourceAreaImages.get( hex.hID )" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import {Hex} from "@/model/game_data";
import FieldHex from "@/components/FieldHex.vue";

export default defineComponent({
  name: "GameField",
  components: {
    FieldHex
  },
  data() {
    return {
      store
    }
  },
  created() {
    console.log( "Turn: " + this.store.gameData?.game.turn.playerID.id )
    console.log( this.store.gameData?.gameStatus.buildablePoints )
  },
  computed: {
    fieldWidth():number {
      return Math.max( ...( this.store.gameData?.game.gameField.field.map( r => r.length ) ?? [0] ) )
    },
    fieldHeight():number {
      return this.store.gameData?.game.gameField.field.length ?? 0
    },
    gameFieldStyle():object {
      return {
        aspectRatio: ( this.fieldWidth / ( 1 + ( this.fieldHeight - 1 ) * 0.75 ) * Math.cos( 30 * ( Math.PI / 180 ) ) )
      }
    },
    fieldRowStyle():object {
      return {
        marginBottom: `calc( ${ 0 - 100 / this.fieldWidth / Math.cos( 30 * ( Math.PI / 180 ) ) * 0.25 }% - 1.3px )`,
        height: `${ 100 / ( 1 + ( this.fieldHeight - 1 ) * 0.75 ) }%`
      }
    },
    rows():(Hex | null)[][] {
      return this.store.gameData?.game.gameField.field ?? []
    },
    resourceAreaImages():Map<number, number> {
      return this.store.gameData?.game.gameField.field.reduce(
          ( data, row ) => row.reduce(
              function( data, hex ) {
                if( hex !== null && hex.area.resource !== null ) {
                  const count:number = data[1].get( hex.area.resource ) ?? 0
                  return [data[0].set( hex.hID, count ), data[1].set( hex.area.resource, count + 1 )] as const
                }
                return data
              },
              data
          ),
          [new Map<number, number>(), new Map<string, number>()] as const
      )[0] ?? new Map<number, number>()
    }
  },
  methods: {
    definedHexesEven( row:(Hex | null)[] ):boolean {
      return row.filter( h => h !== null ).length % 2 === 0
    },
    leadingUndefinedHexes( row:(Hex | null)[] ):number {
      return row.findIndex( h => h !== null )
    },
    isHex( hex:Hex | null ):hex is Hex {
      return hex !== null
    },
    definedHexes( row:(Hex | null)[] ):Hex[] {
      return row.filter( this.isHex )
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  /*@robberWidth: 80%;
  @robberHeight: 100%;
  @robberBorder: 6%;
  @robberHeadHeight: 30%;
  @robberHeadWidth: 50%;

  @roadWidth: 10%;
  @roadLength: 60%;
  @roadBorder: 10%;

  @vertexSize: 20%;
  @settlementWidth: 80%;
  @settlementHeight: 80%;
  @settlementRoof: ( @settlementHeight * 0.4 );
  @settlementBorder: 6%;

  @cityWidth: 100%;
  @cityHeight: 100%;
  @cityTowerHeight: ( @cityHeight * 0.3 );
  @cityTowerWidth: ( @cityWidth * 0.6 );
  @cityRoof: ( @cityHeight * 0.2 );
  @cityBorder: 6%;*/

  #gameField {
    max-width: 100%;
    max-height: 100%;
    font-size: 0;
    margin: auto;

    > .fieldRow {
      margin-left: auto;
      margin-right: auto;
      text-align: center;
      white-space: nowrap;

      > .fieldRowSpacer, .hexSpacer {
        display: inline-block;
        height: 100%;
        aspect-ratio: cos( 30deg );
        margin: 0;
        font-size: initial;
      }

      > .fieldRowSpacer, .hexSpacer {
        background-color: transparent;
        width: 0 !important;
      }

      > .fieldRowSpacer {
        //aspect-ratio: 0.5 * cos( 30deg );
      }
    }
  }
</style>