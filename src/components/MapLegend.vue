<template>
  <div>
    <div class="legend-title">Power from wind farms (GW)</div>
    <div class="data-scale">
      <div
        class="gradient"
        :style="{
          background: `linear-gradient(to right, ${this.lowColor}, ${this.highColor})`,
        }"
      ></div>
      <div class="extrime-values">
        <span>{{ this.lowValue }}</span>
        <span>{{
          this.roundUpToTen((this.highValue - this.lowValue) / 4) / 1000
        }}</span>
        <span>{{
          this.roundUpToTen((this.highValue - this.lowValue) / 2) / 1000
        }}</span>
        <span>{{
          this.roundUpToTen(((this.highValue - this.lowValue) / 4) * 3) / 1000
        }}</span>
        <span>{{ this.roundUpToTen(this.highValue - this.lowValue) / 1000 }}</span>
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
  methods: {
    roundUpToTen(number) {
      return Math.ceil(number / 10) * 10;
    },
  },
};
</script>

<style scoped></style>
