<template>
  <div>
    <div class="legend-wrapper">
      <div class="legend-title">
        Green power ratio <br><small>%  of electricity from wind&sun to avg-high...</small>
      </div>
      <div class="legend-switch">
        <div class="switch-label">both generation</div>
        <label class="switch">
          <input type="checkbox" v-model="isChecked" @input="updateIsRatioToLoad">
          <span class="slider"></span>
        </label>
        <div class="switch-label">total demand</div>
      </div>
    </div>
    <div class="data-scale">
      <div
        class="gradient"
        :style="{
          background: `linear-gradient(to right, ${this.lowColor}, ${this.highColor})`,
        }"
      ></div>
      <div class="extrime-values">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  </div>
</template>

<script>
import "@/main.scss";
export default {
  name: "MapLegend",
  props: {
    lowColor: String,
    highColor: String,
    lowValue: Number,
    highValue: Number,
  },
  data() {
    return {
      isChecked: true,
    };
  },
  methods: {
    roundUpToTen(number) {
      return Math.ceil(number / 10) * 10;
    },
    updateIsRatioToLoad() {
      console.log(this.isChecked);
      this.$store.commit("setIsRatioToLoad", this.isChecked);
    }
  },
};
</script>

<style scoped></style>
