<template>
  <div>
    <div class="legend-title">Power from wind farms (MW)</div>
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
          this.roundUpToTen((this.highValue - this.lowValue) / 4)
        }}</span>
        <span>{{
          this.roundUpToTen((this.highValue - this.lowValue) / 2)
        }}</span>
        <span>{{
          this.roundUpToTen(((this.highValue - this.lowValue) / 4) * 3)
        }}</span>
        <span>{{ this.roundUpToTen(this.highValue - this.lowValue) }}</span>
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
