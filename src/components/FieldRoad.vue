<template>
  <div class="road">
    <div class="structure" :class="structureDisplayClass">
      <div class="placementBorder"></div>
      <div class="placementContent" :class="structureColorClass"></div>
    </div>
    <CommandButton v-if="store.isBuildable( 'Edge', e.id )" command="build" :data="e.id.toString()" button-class="buildPlacementPoint" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import {Edge} from "@/model/game_data";
import {pBGColorClass} from "@/util/util";
import CommandButton from "@/components/util/CommandButton.vue";

export default defineComponent({
  name: "FieldRoad",
  components: {
    CommandButton
  },
  props: {
    edge: {
      required: true
    }
  },
  data() {
    return {
      store
    }
  },
  computed: {
    e():Edge {
      return this.edge as Edge
    },
    structureDisplayClass():string {
      return this.e.road !== null ? "structureBuilt" : "structureNotBuilt"
    },
    structureColorClass():string {
      if( this.e.road !== null )
        return pBGColorClass( this.store.gameData?.game.players.find( e => e.k.id === this.e.road!.owner.id )?.v.color ?? "" )
      else
        return "transparent"
    },
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  @roadGap: ( ( 100% - @roadLength ) / 2 );
  .road {
    position: relative;
    width: 100%;
    height: 100%;
    //filter: url( #buildingFilter );

    .buildPlacementPoint {
      width: 40%;
    }

    @roadXMult: cos( 30deg );
    @roadYMult: sin( 30deg );
    @roadWidthX: @roadWidth / 0.5 / 2 * @roadYMult;
    @roadWidthY: @roadWidth * cos( 30deg ) * 4 / 2 * @roadXMult;
    @roadBorderX1: @roadBorder * @roadWidth / 100 / 0.5 * @roadXMult;
    @roadBorderX2: @roadBorder * @roadWidth / 100 / 0.5 * @roadYMult;
    @roadBorderY1: @roadBorder * @roadWidth / 100 * cos( 30deg ) / 0.25 * @roadYMult;
    @roadBorderY2: @roadBorder * @roadWidth / 100 * cos( 30deg ) / 0.25 * @roadXMult;

    &.roadSW {
      .placementBorder {
        clip-path: polygon(
              ( @roadGap + @roadWidthX )              ( @roadGap - @roadWidthY ),
              ( ( 100% - @roadGap ) + @roadWidthX )   ( ( 100% - @roadGap ) - @roadWidthY ),
              ( ( 100% - @roadGap ) - @roadWidthX )   ( ( 100% - @roadGap ) + @roadWidthY ),
              ( @roadGap - @roadWidthX )              ( @roadGap + @roadWidthY )
        );
      }

      .placementContent {
        clip-path: polygon(
              ( @roadGap + @roadWidthX + @roadBorderX1 - @roadBorderX2 )          ( @roadGap - @roadWidthY + @roadBorderY1 + @roadBorderY2 ),
              ( 100% - @roadGap + @roadWidthX - @roadBorderX1 - @roadBorderX2 )   ( 100% - @roadGap - @roadWidthY - @roadBorderY1 + @roadBorderY2 ),
              ( 100% - @roadGap - @roadWidthX - @roadBorderX1 + @roadBorderX2 )   ( 100% - @roadGap + @roadWidthY - @roadBorderY1 - @roadBorderY2 ),
              ( @roadGap - @roadWidthX + @roadBorderX1 + @roadBorderX2 )          ( @roadGap + @roadWidthY + @roadBorderY1 - @roadBorderY2 )
        );
      }
    }

    &.roadSE {
      .placementBorder {
        clip-path: polygon(
              ( @roadGap - @roadWidthX )              ( ( 100% - @roadGap ) - @roadWidthY ),
              ( ( 100% - @roadGap ) - @roadWidthX )   ( @roadGap - @roadWidthY ),
              ( ( 100% - @roadGap ) + @roadWidthX )   ( @roadGap + @roadWidthY ),
              ( @roadGap + @roadWidthX )              ( ( 100% - @roadGap ) + @roadWidthY )
        );
      }

      .placementContent {
        clip-path: polygon(
              ( @roadGap - @roadWidthX + @roadBorderX1 + @roadBorderX2 )              ( ( 100% - @roadGap ) - @roadWidthY - @roadBorderY1 + @roadBorderY2 ),
              ( ( 100% - @roadGap ) - @roadWidthX - @roadBorderX1 + @roadBorderX2 )   ( @roadGap - @roadWidthY + @roadBorderY1 + @roadBorderY2 ),
              ( ( 100% - @roadGap ) + @roadWidthX - @roadBorderX1 - @roadBorderX2 )   ( @roadGap + @roadWidthY + @roadBorderY1 - @roadBorderY2 ),
              ( @roadGap + @roadWidthX + @roadBorderX1 - @roadBorderX2 )              ( ( 100% - @roadGap ) + @roadWidthY - @roadBorderY1 - @roadBorderY2 )
        );
      }
    }

    &.roadE {
      .buildPlacementPoint {
        width: 200%;
      }

      .placementBorder {
        clip-path: polygon(
            0     @roadGap,
            100%  @roadGap,
            100%  ( 100% - @roadGap ),
            0%    ( 100% - @roadGap )
        );
      }

      @roadBorderY: @roadBorder * @roadWidth / 100 * cos( 30deg ) / 0.5;
      .placementContent {
        clip-path: polygon(
            @roadBorder             ( @roadGap + @roadBorderY ),
              ( 100% - @roadBorder )  ( @roadGap + @roadBorderY ),
              ( 100% - @roadBorder )  ( 100% - @roadGap - @roadBorderY ),
            @roadBorder             ( 100% - @roadGap - @roadBorderY )
        );
      }
    }
  }
</style>