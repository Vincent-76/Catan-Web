<template>
  <div :id="`vertex${v.id}`" class="vertex">
    <div class="vertexContent">
      <div class="structure" :class="structureClass">
        <div class="placementBorder"></div>
        <div class="placementContent" :class="structureColorClass"></div>
      </div>
      <CommandButton v-if="store.isBuildable( 'Vertex', v.id )" command="build" :data="v.id.toString()" button-class="buildPlacementPoint" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import {Vertex} from "@/model/game_data";
import {pBGColorClass} from "@/util/util";
import CommandButton from "@/components/util/CommandButton.vue";

export default defineComponent({
  name: "FieldVertex",
  components: {
    CommandButton
  },
  props: {
    vertex: {
      required: true
    }
  },
  data() {
    return {
      store
    }
  },
  created() {
    if( this.v.building !== null ) {
      console.log( this.v.id )
      console.log( this.structureClass )
    }
  },
  computed: {
    v():Vertex {
      return this.vertex as Vertex
    },
    structureClass():string[] {
      return [
          this.v.building !== null ? "structureBuilt" : "structureNotBuilt",
          this.v.building !== null
              ? this.v.building.class === "Settlement" ? "settlement" : "city"
              : ""
      ]
    },
    structureColorClass():string {
      if( this.v.building !== null )
        return pBGColorClass( this.store.gameData?.game.players.find( e => e.k.id === this.v.building!.owner.id )?.v.color ?? "" )
      else
        return "transparent"
    },
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  .vertex {
    position: absolute;
    width: @vertexSize;
    height: @vertexSize * cos( 30deg );
    z-index: 15;

    .vertexContent {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .buildPlacementPoint {
      width: 100%;
    }

    &.vertexS {
      left: ( 50% - @vertexSize / 2 );
      //margin-left: 0 - @vertexSize / 2;
      bottom: ( 0 - @vertexSize / 2 );
    }

    &.vertexSE {
      right: ( 0 - @vertexSize / 2 );
      top: ( 75% - @vertexSize / 2 );
      //margin-top: 0 - @vertexSize / 2;
    }

    .settlement {
      @settlementGapX: ( ( 100% - @settlementWidth ) / 2 );
      @settlementGapY: ( ( 100% - @settlementHeight ) / 2 );
      @roofAngle: atan( ( unit( @settlementRoof ) / ( unit( @settlementWidth ) / 2 ) ) );
      @settlementRoofBorderY: ( @settlementBorder * cos( @roofAngle ) );
      @settlementTipBorderY: ( @settlementBorder / cos( @roofAngle ) );

      .placementBorder {
        clip-path: polygon(
              ( 100% - @settlementGapX )                  ( 100% - @settlementGapY ),
              @settlementGapX                             ( 100% - @settlementGapY ),
              @settlementGapX                             ( @settlementGapY + @settlementRoof ),
              ( @settlementGapX + @settlementWidth / 2 )  @settlementGapY,
              ( 100% - @settlementGapX )                  ( @settlementGapY + @settlementRoof )
        );
      }

      .placementContent {
        clip-path: polygon(
              ( 100% - @settlementGapX - @settlementBorder )    ( 100% - @settlementGapY - @settlementBorder ),
              ( @settlementGapX + @settlementBorder )           ( 100% - @settlementGapY - @settlementBorder ),
              ( @settlementGapX + @settlementBorder )           ( @settlementGapY + @settlementRoof + @settlementRoofBorderY ),
              ( @settlementGapX + @settlementWidth / 2 )        ( @settlementGapY + @settlementTipBorderY ),
              ( 100% - @settlementGapX - @settlementBorder )    ( @settlementGapY + @settlementRoof + @settlementRoofBorderY )
        );
      }
    }

    .city {
      @cityGapX: ( ( 100% - @cityWidth ) / 2 );
      @cityGapY: ( ( 100% - @cityHeight ) / 2 );
      @roofAngle: atan( ( unit( @cityRoof ) / ( unit( @cityTowerWidth ) / 2 ) ) );
      @cityRoofBorderY: ( @cityBorder * cos( @roofAngle ) );
      @cityTipBorderY: ( @cityBorder / cos( @roofAngle ) );

      .placementBorder {
        clip-path: polygon(
              ( 100% - @cityGapX )                        ( 100% - @cityGapY ),
              @cityGapX                                   ( 100% - @cityGapY ),
              @cityGapX                                   ( @cityGapY + @cityRoof + @cityTowerHeight ),
              ( 100% - @cityGapX - @cityTowerWidth )      ( @cityGapY + @cityRoof + @cityTowerHeight ),
              ( 100% - @cityGapX - @cityTowerWidth )      ( @cityGapY + @cityRoof ),
              ( 100% - @cityGapX - @cityTowerWidth / 2 )  @cityGapY,
              ( 100% - @cityGapX )                        ( @cityGapY + @cityRoof )
        );
      }

      .placementContent {
        clip-path: polygon(
              ( 100% - @cityGapX - @cityBorder )                    ( 100% - @cityGapY - @cityBorder ),
              ( @cityGapX + @cityBorder )                           ( 100% - @cityGapY - @cityBorder ),
              ( @cityGapX + @cityBorder )                           ( @cityGapY + @cityRoof + @cityTowerHeight + @cityBorder ),
              ( 100% - @cityGapX - @cityTowerWidth + @cityBorder )  ( @cityGapY + @cityRoof + @cityTowerHeight + @cityBorder ),
              ( 100% - @cityGapX - @cityTowerWidth + @cityBorder )  ( @cityGapY + @cityRoof + @cityRoofBorderY ),
              ( 100% - @cityGapX - @cityTowerWidth / 2 )            ( @cityGapY + @cityTipBorderY ),
              ( 100% - @cityGapX - @cityBorder )                    ( @cityGapY + @cityRoof + @cityRoofBorderY )
        );
      }
    }
  }
</style>