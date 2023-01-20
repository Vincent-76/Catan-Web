<template>
  <div class="gameStack">
    <div class="gameStackImg" :style="imageStyle"></div>
    <p>{{ amount }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import store from "@/store"

export default defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Stack",
  props: {
    img: null,
    amount: {
      type: Number,
      required: true
    },
    altText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      store
    }
  },
  computed: {
    imageStyle() {
      return {
        backgroundImage: `url(${this.img})`
      }
    },

  }
})
</script>

<style lang="less" scoped>
  @import "@/assets/vars.less";

  .gameStack {
    height: 100%;
    text-align: center;
    color: white;
    font-size: 1.2em;

    @media @portrait {
      font-size: 0.8em;
    }

    .gameStackImg {
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      height: 70%;
      max-width: 90%;
      margin: auto;

      @media @portrait {
        width: 45%;
        transform: rotate( -90deg );
      }
    }

    > p {
      height: 30%;
      margin: 0;

      @media @portrait {
        margin-top: -15%;
      }
    }
  }
</style>