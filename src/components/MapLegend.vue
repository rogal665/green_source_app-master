<template>
  <div>
    <div class="legend-wrapper">
      <div class="legend-title">
        Green electricity ratio <br><small>%  of electricity from wind&sun to avg-high...</small>
      </div>
      <div class="legend-switch">
        <div class="switch-label">wind&sun generation</div>
        <label class="switch">
          <input type="checkbox" v-model="isChecked">
          <span class="slider"></span>
        </label>
        <div class="switch-label">total electricity demand</div>
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
      
    };
  },
  computed: {
    isChecked: {
      get () {
        return this.$store.getters.getIsRatioToLoad;
      },
      set (value) {
        console.log(this.isChecked);
        this.$store.commit("setIsRatioToLoad", value);
      }
    }
  },
  methods: {
    roundUpToTen(number) {
      return Math.ceil(number / 10) * 10;
    }
  },
};
</script>

<style scoped></style>
