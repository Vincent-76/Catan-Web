<template>
  <div :id="idString" class="hex" :class="classString" :style="imageStyle">
    <!-- <img class="hexBackground" src="@routes.Assets.versioned( gameData.imagePath( hex ) )" alt=""> -->
    <div class="hexRow1">
      <div class="hexCell hexCell1"></div>
      <div class="hexCell hexCell2"></div>
    </div>
    <div class="hexRow2">
      <div class="hexCell hexCell3"></div>
      <div class="hexCell hexCell5">
        <!--@road( hex, 2, "roadE" )-->
        <FieldRoad v-if="edgeE !== undefined" :edge="this.edgeE" class="roadE" />
      </div>
      <div class="hexCell hexCell4">
        <img v-if="isResourceArea" :src="numberImage" class="resourceNumber" :alt="h.area.number" />
        <div id="robber" v-if="isRobber">
          <div class="structure">
            <div class="placementBorder"></div>
            <div class="placementContent"></div>
          </div>
        </div>
        <CommandButton v-if="store.isBuildable( 'Hex', h.hID )" command="placeRobber" :data="h.hID.toString()" button-class="buildPlacementPoint" />
      </div>
    </div>
    <div class="hexRow3">
      <div class="hexCell hexCell6">
        <!--@road( hex, 0, "roadSW" )-->
        <FieldRoad v-if="edgeSW !== undefined" :edge="edgeSW" class="roadSW" />
      </div>
      <div class="hexCell hexCell7">
        <!--@road( hex, 1, "roadSE" )-->
        <FieldRoad v-if="edgeSE !== undefined" :edge="edgeSE" class="roadSE" />
      </div>
    </div>
    <!--@vertex( hex, 0, 1, "vertexS" )-->
    <FieldVertex v-if="vertexS !== undefined" :vertex="vertexS" class="vertexS" />
    <!--@vertex( hex, 1, 2, "vertexSE" )-->
    <FieldVertex v-if="vertexSE !== undefined" :vertex="vertexSE" class="vertexSE" />
  </div>
</template>


<script lang="ts">
import {defineComponent, PropType} from "vue"
import store from "@/store"
import {Edge, Hex, JMap, Vertex} from "@/model/game_data";
import {adjacentEdge, adjacentOffset, adjacentVertex} from "@/util/util";
import CommandButton from "@/components/CommandButton.vue";
import FieldRoad from "@/components/FieldRoad.vue";
import FieldVertex from "@/components/FieldVertex.vue";

export default defineComponent({
  name: "FieldHex",
  components: {
    FieldVertex,
    FieldRoad,
    CommandButton
  },
  props: {
    hex: {
      required: true
    },
    resourceAreaNr: Number
  },
  data() {
    return {
      store
    }
  },
  computed: {
    h():Hex {
      return this.hex as Hex
    },
    idString():string {
      return `hex${this.h.hID}`
    },
    classString():string {
      switch( this.h.area.class ) {
        case "WaterArea": return "waterArea"
        case "Desert": return "desert landArea"
        case "ResourceArea": return (this.h.area.resource ?? "") + " resourceArea landArea"
      }
      return ""
    },
    imagePath():string {
      switch( this.h.area.class ) {
        case "Desert": return require( "@/assets/images/desert.png" )
        case "WaterArea": {
          if( this.h.area.port === null )
            return require( "@/assets/images/water.png" )
          else {
            const rotNr:number = adjacentOffset.findIndex( ( o, i ) => this.isAdjacentPort( i ) ) ?? 0
            if( this.h.area.port?.specific === null || this.h.area.port?.specific === undefined )
              return require( `@/assets/images/ports/unspecific/${rotNr}.png` )
            else
              return require( `@/assets/images/ports/${this.h.area.port.specific.toLowerCase()}/${rotNr}.png` )
          }
        }
        case "ResourceArea": {
          if( this.resourceAreaNr === undefined )
            return require( `@/assets/images/${this.h.area.resource}.png` )
          else
            return require( `@/assets/images/${this.h.area.resource?.toLowerCase()}/${this.resourceAreaNr}.png` )
        }
      }
      return ""
    },
    imageStyle():object {
      return {
        backgroundImage: `url(${this.imagePath})`
      }
    },
    isResourceArea():boolean {
      return this.h.area.class === "ResourceArea"
    },
    numberImage():string {
      return require( `@/assets/images/numbers/${this.h.area.number}.png` )
    },
    isRobber():boolean {
      return this.store.gameData?.game.gameField.robber === this.h.hID
    },
    field():(Hex | null)[][] {
      return this.store.gameData?.game.gameField.field ?? []
    },
    edges():JMap<[number, number], Edge> {
      return this.store.gameData?.game.gameField.edges ?? []
    },
    vertices():JMap<[number, number, number], Vertex> {
      return this.store.gameData?.game.gameField.vertices ?? []
    },
    edgeE():Edge | undefined {
      return adjacentEdge( this.h, 2, this.field, this.edges )
    },
    edgeSW():Edge | undefined {
      return adjacentEdge( this.h, 0, this.field, this.edges )
    },
    edgeSE():Edge | undefined {
      return adjacentEdge( this.h, 1, this.field, this.edges )
    },
    vertexS():Vertex | undefined {
      return adjacentVertex( this.h, 0, 1, this.field, this.vertices )
    },
    vertexSE():Vertex | undefined {
      return adjacentVertex( this.h, 1, 2, this.field, this.vertices )
    }
  },
  methods: {
    isAdjacentPort( offsetIndex:number ):boolean {
      const edge:Edge | undefined = adjacentEdge( this.h, offsetIndex, this.field, this.edges )
      return edge !== undefined && edge.port !== null && this.h.area.port?.specific === edge.port.specific
    }
  }
})
</script>


<style lang="less">
  .structure {
    width: 100%;
    height: 100%;
  }

  .structureBuilt {
    display: block;
  }

  .structureNotBuilt {
    display: none;
  }

  .buildPlacementPoint {
    @color: #D09029;

    aspect-ratio: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate( -50%, -50% );
    background-color: transparent;
    border: solid 0.2rem @color;
    border-radius: 100%;
    transition: 0.1s ease-in-out;
    z-index: 20;

    &:hover {
      box-shadow: inset 0 0 8px @color;
      text-decoration: initial !important;
    }

    &:active {
      box-shadow: inset 0 0 16px @color;
    }
  }

  .hexCell4 .buildPlacementPoint {
      top: -8%;
      width: 20%;
  }

  .placementBorder {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
    background-color: black;
  }

  .placementContent {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
</style>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  /*@robberWidth: 80%;
  @robberHeight: 100%;
  @robberBorder: 6%;
  @robberHeadHeight: 30%;
  @robberHeadWidth: 50%;

  @roadWidth: 10%;
  @roadLength: 60%;
  @roadBorder: 10%;*/

  .hex {
    position: relative;
    overflow: visible;
    background-size: cover;
    display: inline-block;
    height: 100%;
    aspect-ratio: cos( 30deg );
    margin: 0;
    font-size: initial;

    /*&:before {
      content: "";
      position: absolute;
      clip-path: polygon( 0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0% );
      //background-color: green;
    }*/

    /*> .hexBackground {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: -1;
    }*/

    > .hexRow1, .hexRow3 {
      width: 100%;
      height: 25%;
    }

    .hexRow2 {
      width: 100%;
      height: 50%;

      > .hexCell3, .hexCell5 {
        width: @roadWidth;
      }

      > .hexCell3 {
        margin-left: ( 0 - @roadWidth / 2 );
      }

      > .hexCell4 {
        width: auto;
        position: relative;
        float: none;
        margin: 0 @roadWidth / 2 0 @roadWidth / 2;
      }

      > .hexCell5 {
        float: right;
        margin-right: ( 0 - @roadWidth / 2 );
      }

    }

    .hexCell {
      height: 100%;
      width: 50%;
      float: left;
    }

    .resourceNumber {
      width: 40%;
      aspect-ratio: 1;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate( -50%, -50% );
    }
  }

  #robber {
    aspect-ratio: 1;
    position: absolute;
    width: 23%;
    left: 50%;
    top: -8%;
    transform: translate( -50%, -50% );
    z-index: 18;

    @robberGapX: ( ( 100% - @robberWidth ) / 2 );
    @robberGapY: ( ( 100% - @robberHeight ) / 2 );
    @robberHeadGap: ( ( 100% - @robberHeadWidth ) / 2 );

    .placementBorder {
      clip-path: polygon(
            ( 100% - @robberGapX )      ( 100% - @robberGapY ),
          @robberGapX                 ( 100% - @robberGapY ),
          @robberGapX                 ( @robberGapY + @robberHeadHeight ),
          @robberHeadGap              ( @robberGapY + @robberHeadHeight ),
          @robberHeadGap              @robberGapY,
            ( 100% - @robberHeadGap )   @robberGapY,
            ( 100% - @robberHeadGap )   ( @robberGapY + @robberHeadHeight ),
            ( 100% - @robberGapX )      ( @robberGapY + @robberHeadHeight )
      );
    }

    .placementContent {
      background-color: #586572;
      clip-path: polygon(
            ( 100% - @robberGapX - @robberBorder )      ( 100% - @robberGapY - @robberBorder ),
            ( @robberGapX + @robberBorder )             ( 100% - @robberGapY - @robberBorder ),
            ( @robberGapX + @robberBorder )             ( @robberGapY + @robberHeadHeight + @robberBorder ),
            ( @robberHeadGap + @robberBorder )          ( @robberGapY + @robberHeadHeight + @robberBorder ),
            ( @robberHeadGap + @robberBorder )          ( @robberGapY + @robberBorder ),
            ( 100% - @robberHeadGap - @robberBorder )   ( @robberGapY + @robberBorder ),
            ( 100% - @robberHeadGap - @robberBorder )   ( @robberGapY + @robberHeadHeight + @robberBorder ),
            ( 100% - @robberGapX - @robberBorder )      ( @robberGapY + @robberHeadHeight + @robberBorder )
      );
    }
  }
</style>