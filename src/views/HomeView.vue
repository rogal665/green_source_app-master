<template>
  <div class="map-container-root">
    <GreenSourceMap
      class="map"
      :countryData="countryData"
      :lowColor="lowColor"
      :highColor="highColor"
      :injectedScale="scale"
      :totalCapacities="totalCapacities"
      @select-region="selectRegion"
      @scale-value="handleScale"
    >
    </GreenSourceMap>
    <div class="bottom-hud">
      <TimeLine
        class="timeline"
        @time-selected="handleSelectedTime"
        :range="dateRange"
      ></TimeLine>
      <MapLegend
        class="legend"
        :lowColor="lowColor"
        :highColor="highColor"
        :lowValue="lowValue"
        :highValue="highValue"
      ></MapLegend>
      
    </div>
    <div class="right-hud">
      <MapSettings
        class="settings"
        :scale="scale"
        @scale-value="handleScale"
      ></MapSettings>
      <RegionDetails
        class="region-details"
        @close-region-details="closeRegionDetails"
        :selectedRegionData="selectedRegionData"
        :selectedTime="selectedTime"
        :totalCapacities="totalCapacities"
      ></RegionDetails>
    </div>
    <div
      v-if="countryHover"
      class="mouse-follower"
      :style="followerStyle"
    ></div>
  </div>
</template>

<script>
import "@/main.scss";
import GreenSourceMap from "@/components/GreenSourceMap.vue";

import TimeLine from "@/components/MapTimeLine.vue";
import RegionDetails from "@/components/RegionDetails.vue";
import MapLegend from "@/components/MapLegend.vue";
import MapSettings from "@/components/MapSettings.vue";
import { naiveRound, transformPercentToText } from '../services/utils.js'

export default {
  name: "HomeView",
  components: {
    GreenSourceMap,
    TimeLine,
    RegionDetails,
    MapLegend,
    MapSettings,
  },

  data() {
    return {
      countryData: {},
      data: [],
      uniqueTimeISOObj: {},
      dateRange: [],
      selectedTime: "",
      selectedRegion: "",
      selectedRegionData: {},
      lowColor: "#D6390D",
      highColor: "#46D60D",
      maxPowerValue: 12000,
      lowValue: 0,
      highValue: 0,
      scale: 1.1,
      countryFound: false,
      mouseX: 0,
      mouseY: 0,
      followerWidth: 100,
      followerHeight: 50,
      countryHover: "",
      totalCapacities: {}
    };
  },
  watch: {
    isRatioToLoad() {
      this.totalCapacities = this.$store.getters.getTotalCapacities;
      this.recalcForecastDetails();
    }
  },
  methods: {
    sortedData(data) {
      const groupedData = data.reduce((result, data) => {
        const countryCode = data.country;

        if (!result[countryCode]) {
          result[countryCode] = {
            countryCode,
            weatherData: [],
          };
        }
        result[countryCode].weatherData.push(data);
        return result;
      }, {});

      // Przekształć obiekt na tablicę wartości
      const groupedDataArray = Object.values(groupedData);
      return groupedDataArray;
    },

    async fetchData() {
      const currentTime = Date.now();
      const twentyFourHoursAgo = currentTime - 24 * 60 * 60 * 1000;
      await this.$store.dispatch("getPowerForecast", {country: ["HU", "IT", "PL"]});
      await this.$store.dispatch("getAllCountryCapacities");

      this.totalCapacities = this.$store.getters.getTotalCapacities;
      this.uniqueTimeISOObj = this.getUniqueTimeISOWithCountry(
        this.sortedData(this.storeData),
      );
      
      this.copyDeteRange();
    },
    handleScale(selectedScale) {
      this.scale = selectedScale;
    },
    findLowHigh() {
      this.lowValue = 0;
      this.highValue = 0;
      for (const key in this.countryData) {
        
        if (Object.prototype.hasOwnProperty.call(this.countryData, key)) {
          const value = this.countryData[key];
          if (typeof value === "number") {
            if (value > this.highValue) {
              this.highValue = value;
            }
            if (value < this.lowValue) {
              this.lowValue = value;
            }
          }
        }
      }
      //delete if want dynamic scale
      // this.highValue = 12000;
    },
    async selectRegion(SelectedRegion) {
      this.countryFound = false;
      try {
        await this.$store.dispatch("getCountryCapacities", SelectedRegion)
        const countriesDetails = await this.$store.getters.getRegion[0];
        this.selectedRegionData = countriesDetails;
        if(!!this.selectedRegionData.solar_capacity_avg_high) {
          this.countryFound = true;
        } else {
          this.selectedRegionData = {}
          this.countryFound = false;
        }
      }
      catch {
        this.selectedRegionData = {};
        this.countryFound = false;
      }

   

    },
    findSelectedTime(proxyObj, keyToFind) {
      const keys = Object.keys(proxyObj);
     
      const keyToFindTrimmed = keyToFind.trim();
      
      keys.forEach((key) => {
        
        const keyTrimmed = key.trim();
        
        if (keyTrimmed === keyToFindTrimmed) {
          const selectedObj = proxyObj[key];
         
          
        
          this.countryData = selectedObj;
          //this.countryData.MAX = this.maxPowerValue;
          this.findLowHigh();
        }
      });
    },
    copySelectedTimeFromUniqueTimeObj(
      countryData,
      uniqueTimeISOObj,
      selectedTimeKey,
    ) {
      if (!countryData || !uniqueTimeISOObj || !selectedTimeKey) {
        console.error("Nieprawidłowe dane wejściowe.");
        return;
      }

      if (!(selectedTimeKey in uniqueTimeISOObj)) {
        console.error("Klucz selectedTimeKey nie istnieje w uniqueTimeISOObj.");
        return;
      }
      const selectedTimeValueTrimmed =
        uniqueTimeISOObj[selectedTimeKey]?.trim();

      if (!selectedTimeValueTrimmed) {
        console.error(
          `Brak danych pod kluczem ${selectedTimeKey} w uniqueTimeISOObj.`,
        );
        return;
      }

      Object.keys(countryData).forEach((key) => {
        if (countryData[key] && typeof countryData[key] === "object") {
          countryData[key].selectedTime = selectedTimeValueTrimmed;
        }
      });
    },
    handleSelectedTime(SelectedTime) {
      this.selectedTime = SelectedTime;
      this.findSelectedTime(this.uniqueTimeISOObj, this.selectedTime);
      this.recalcForecastDetails();
    },

    copyDeteRange() {
      const keys = Object.keys(this.uniqueTimeISOObj);
      this.dateRange = [];
      keys.forEach((key) => {
        
        this.dateRange.push(key);
      });
      
    },

    getUniqueTimeISOWithCountry(data) {
      


    
    data[0].weatherData.forEach((data) => {
      
      const { time_iso, ...rest } = data;
      if (!this.uniqueTimeISOObj[time_iso]) {
        this.uniqueTimeISOObj[time_iso] ={ [data.country_code]: data.total_power } 
      } else {
        this.uniqueTimeISOObj[time_iso][data.country_code] = data.total_power;
      }

      
  
    })
  
    return this.uniqueTimeISOObj;
    },


    setDefaultTime() {
      if (
        !this.uniqueTimeISOObj ||
        Object.keys(this.uniqueTimeISOObj).length === 0
      ) {
        return undefined;
      }
      const keys = Object.keys(this.uniqueTimeISOObj);
      const lastKey = keys[keys.length - 1];

      this.selectedTime = lastKey;
    },
    updateMousePosition(event) {
      // Aktualizuj pozycję myszy
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
    },
    recalcForecastDetails () {
      Object.keys(this.countryData).forEach((countryCode) => {
        const currentObj = this.storeData.find((item) => {
          return item.country_code === countryCode && item.time_iso === this.selectedTime;
        });
        
        if(currentObj) {
          debugger
          const displayCurrentWindAndSolarPower = naiveRound(Math.round(parseFloat(currentObj.wind_power) + parseFloat(currentObj.solar_power)) / 1000);
          let displayCurrentWindAndSolarPowerLabel = transformPercentToText(displayCurrentWindAndSolarPower);
              displayCurrentWindAndSolarPowerLabel = displayCurrentWindAndSolarPowerLabel.label;
          const displayCurrentRatioWindAndSolarToItsSumPower = naiveRound((displayCurrentWindAndSolarPower / parseFloat(this.totalCapacities[countryCode])) * 100, 1);

          document.querySelector(`#text-power-${countryCode}`).textContent = displayCurrentWindAndSolarPowerLabel;
          document.querySelector(`#text-ratio-${countryCode}`).textContent = displayCurrentRatioWindAndSolarToItsSumPower + '%';
        }

      });
    },
    closeRegionDetails () {
      this.selectedRegionData = {};
    }
  },

  computed: {
    isRatioToLoad() {
      return this.$store.getters.getIsRatioToLoad;
    },
    storeData() {
      return this.$store.getters.getData;
    },
    followerStyle() {
      const left = this.mouseX + 70 - this.followerWidth / 2 + "px";
      const top = this.mouseY - 30 - this.followerHeight / 2 + "px";

      return {
        left,
        top,
        width: this.followerWidth + "px",
        height: this.followerHeight + "px",
      };
    },
  },
  mounted() {
    this.setDefaultTime();
    this.findSelectedTime(this.uniqueTimeISOObj, this.selectedTime);
    document.addEventListener("mousemove", this.updateMousePosition);
    this.data = this.fetchData();
  },

  beforeUnmount() {
    clearInterval(this.intervalId);
    document.removeEventListener("mousemove", this.updateMousePosition);
  },
};
</script>
