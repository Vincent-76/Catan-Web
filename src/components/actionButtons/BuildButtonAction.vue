<template>
  <div id="choosePlacement">
    <GameButton @click="showDialog()">Build</GameButton>
    <Dialog :show="show">
      <p>Choose Placement</p>
      <CommandButton command="setBuildState" data="Road" class="chooseButton" @resut="hideDialog()">
        Road
      </CommandButton>
      <CommandButton command="setBuildState" data="Settlement" class="chooseButton" @resut="hideDialog()">
        Settlement
      </CommandButton>
      <CommandButton command="setBuildState" data="City" class="chooseButton" @resut="hideDialog()">
        City
      </CommandButton>
      <br />
      <GameButton @click="hideDialog()">Cancel</GameButton>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"
import CommandButton from "@/components/util/CommandButton.vue";
import GameButton from "@/components/util/GameButton.vue";
import Dialog from "@/components/util/Dialog.vue";

export default defineComponent({
  name: "BuildButtonAction",
  components: {
    Dialog,
    GameButton,
    CommandButton
  },
  data() {
    return {
      store,
      show: false
    }
  },
  methods: {
    showDialog():void {
      this.show = true;
    },
    hideDialog():void {
      this.show = false;
    }
  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  #choosePlacement {
    p {
      margin-bottom: 0.5rem;
      font-weight: bold;
      font-size: 1.2em;
      color: black;
    }
  }

  .chooseButton {
    margin-bottom: 1rem;
  }
</style>