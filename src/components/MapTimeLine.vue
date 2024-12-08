<template>
  <div class="slider-container">
    <div v-if="showValue" class="current-time">
      {{ formatDateTime(range[selectedValue]) }}
    </div>
    <div class="controlers-container">
      <div class="controlers">
        <svg
          v-if="false"
          @click="scrollToStart"
          class="timeline-controllers"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="#000000"
          viewBox="0 0 256 256"
        >
          <path
            d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm40,144a8,8,0,0,1-12.65,6.51L104,137.83V168a8,8,0,0,1-16,0V88a8,8,0,0,1,16,0v30.17l51.35-36.68A8,8,0,0,1,168,88Z"
          ></path>
        </svg>

        <a href="#" @click.prevent="scrollBackward" class="timeline-controllers">
          <div class="btn-timeline btn-backward"></div>
        </a>

        <a href="#" v-show="!isScrolling" @click.prevent="playForward" class="timeline-controllers">
          <div class="btn-timeline btn-play"></div>
        </a>

        <a href="#" v-show="isScrolling" @click.prevent="stopScrolling" class="timeline-controllers">
          <div class="btn-timeline btn-pause"></div>
        </a>

        <a href="#" @click.prevent="scrollForward" class="timeline-controllers">
          <div class="btn-timeline btn-forward"></div>
        </a>

      </div>
      <input
        v-if="selectedValue != 'none'"
        type="range"
        :min="0"
        :max="range.length - 1"
        class="slider"
        v-model="selectedValue"
        @input="emitValue"
      />
      <div v-if="selectedValue != 'none'" class="scale">
        <div>{{ formatTime(range[0]) + " - " +  formatDate(range[0])?.slice(0,11)}}</div>
        <div>{{ formatDate(range[Math.round((range.length - 1)/4)])?.slice(0,11)}}</div>
        <div>{{ formatDate(range[Math.round((range.length - 1)/2)])?.slice(0,11)}}</div>
        <div>{{ formatDate(range[Math.round((range.length - 1)/4*3)])?.slice(0,11)}}</div>
        
        <div>{{ formatTime(range[range.length - 1]) + " - " + formatDate(range[range.length - 1])?.slice(0,11)}}</div>
      </div>
      
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import "@/main.scss";
export default {
  name: "MapTimeLine",
  props: {
    range: {
      type: Array,
      default: []
      
    },
},
  data() {
    return {
      selectedValue: 1,
      showValue: true,
      isScrolling: false,
      lastValueIndex: 0
    };
  },

  watch: {
    range() {
      
      this.$emit("time-selected", this.range[this.selectedValue]);
      
    },
    selectedValue(selectedValue) {
      this.$emit("time-selected", this.range[this.selectedValue]);
    }

    
  },
  methods: {
    scrollToStart() {
      this.scrollTo(0);
    },
    scrollBackward() {

      if (this.selectedValue > 0) {
        this.selectedValue--;
      } else {
        this.stopScrolling();
      }

    },
    scrollForward() {
      const lastValueIndex = this.range.length - 1;
      
      if (this.selectedValue < lastValueIndex) {
        this.selectedValue++;
      } else {
        this.stopScrolling();
      }
    },
    playForward() {
      if (!this.isScrolling) {
        this.isScrolling = true;
        const lastValueIndex = this.range.length - 1;
        const interval = 1500;

        const scrollInterval = setInterval(() => {
          if (this.selectedValue < lastValueIndex) {
            this.selectedValue++;
          } else {
            this.stopScrolling();
          }
        }, interval);

        this.$data.scrollInterval = scrollInterval;
      }
    },
    scrollToEnd() {
      this.scrollTo(this.range.length - 1);
    },
    scrollTo(position) {
      this.selectedValue = position;
    },

    stopScrolling() {
      this.isScrolling = false;
      clearInterval(this.scrollInterval);
    },

    emitValue() {
      this.$emit("time-selected", this.range[this.selectedValue]);
    },
    formatDateTime(inputDate) {
      if (inputDate && inputDate !== undefined) {
        const weekDay = (new Date(inputDate)).toLocaleDateString('en-GB', { weekday: 'long', timeZone: 'UTC' });
        const year = inputDate.slice(0, 4);
        const month = inputDate.slice(5, 7);
        const day = inputDate.slice(8, 10);
        const hours = inputDate.slice(11, 13);
        const minutes = inputDate.slice(14, 16);
        return `${hours}:${minutes} - ${weekDay}, ${day} ${this.getShortMonthName(month)} ${year} [UTC]`;
      }
    },

    getShortMonthName(month) {
      const monthNumber = parseInt(month, 10);
      
      if (monthNumber >= 1 && monthNumber <= 12) {
        const months = {
          1: 'Jan',
          2: 'Feb',
          3: 'Mar',
          4: 'Apr',
          5: 'May',
          6: 'Jun',
          7: 'Jul',
          8: 'Aug',
          9: 'Sep',
          10: 'Oct',
          11: 'Nov',
          12: 'Dec'
        };
        return months[monthNumber];
      } else {
        return "Wrong month";
      }
    },
  
    
    formatDate(inputDate) {
      if (inputDate) {
        const weekDay = (new Date(inputDate)).toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' });
        const year = inputDate.slice(0, 4);
        const month = inputDate.slice(5, 7);
        const day = inputDate.slice(8, 10);
        return `${weekDay}, ${day} ${this.getShortMonthName(month)} ${year}`;
      }
    },
    formatTime(inputDate) {
      if (inputDate) {
        const hours = inputDate.slice(11, 13);
        const minutes = inputDate.slice(14, 16);
        return `${hours}:${minutes}`;
      }
    },
   
  },



};
</script>

<style scoped></style>
