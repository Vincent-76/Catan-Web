<template>
  <div id="monopolyAction">
    <p>Choose Resource:</p>
    <div>
      <CommandButton v-for="r in resources" :key="r" command="monopolyAction" :data="r" class="submitButton">
        {{ r }}
      </CommandButton>
    </div>
    <CommandButton command="undo">Cancel</CommandButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/util/CommandButton.vue";
import {RESOURCES} from "@/model/game_data";

export default defineComponent({
  name: "MonopolyAction",
  components: {
    CommandButton
  },
  data() {
    return {
      store
    }
  },
  computed: {
    resources():string[] {
      return RESOURCES
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #monopolyAction {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  p {
    font-weight: bold;
    font-size: 1.2em;
    color: white;
  }

  .submitButton:not(:first-child) {
    margin-top: 0.5rem;
  }
</style>