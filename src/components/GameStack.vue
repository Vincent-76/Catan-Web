<template>
  <div id="resourcePanel" class="col-lg-3 mx-0 px-2">
    <p id="resourceHeader">Game Stacks</p>
    <div id="gameStackHolder">
      <div class="gameStackRow">
        <div class="gameStackCell">
          <ResourceStack resource="Wood" />
        </div>
        <div class="gameStackCell">
          <ResourceStack resource="Clay" />
        </div>
        <div class="gameStackCell">
          <ResourceStack resource="Sheep" />
        </div>
      </div>
      <div class="gameStackRow">
        <div class="gameStackCell">
          <ResourceStack resource="Wheat" />
        </div>
        <div class="gameStackCell">
          <ResourceStack resource="Ore" />
        </div>
        <div class="gameStackCell">
          <Stack :img="require( '@/assets/images/resources/dev.png' )" :amount="devCardAmount" alt-text="Development Card" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import Stack from "@/components/util/Stack.vue"
import ResourceStack from "@/components/util/ResourceStack.vue";

export default defineComponent({
  name: "GameStack",
  components: {
    ResourceStack,
    Stack
  },
  data() {
    return {
      store
    }
  },
  computed: {
    devCardAmount():number {
      return this.store.gameData?.game.developmentCards.length ?? 0
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #resourcePanel {
    width: 100%;
    height: 25%;
    background-image: url( "~@/assets/images/wood_background.jpg" );
    background-position: center;
    background-size: 128px;
    background-repeat: repeat;
    //padding: 5% 2% 2% 2%;
    text-align: center;

    @media @portrait {
      height: 100%;
      padding: 0;
      border-width: 0 0.5rem 0 0;
    }

    > #resourceHeader {
      height: 15%;
      color: white;
      font-size: 1.2em;
      margin: 0;
      font-weight: bold;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      @media @portrait {
        font-size: 0.8em;
      }
    }

    #gameStackHolder {
      width: 100%;
      height: 85%;
    }

    .gameStackRow {
      width: 100%;
      height: calc( 50% - 3px );

      &:last-child {
        margin-top: 6px;
      }
    }

    .gameStackCell {
      float: left;
      width: 100% * (1/3);
      height: 100%;

      @media @portrait {
        padding: 0 1% 0 1%;
      }
    }

  }
</style>