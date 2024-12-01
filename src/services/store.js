import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state() {
    return {
      data: null,
      region: null,
      capacities: null,
      totalCapacities: null,
      totalLoad: null,
      isRatioToLoad: false
    };
  },
  mutations: {
    setData(state, newData) {
      state.data = newData.res.data;
    },
    setRegion(state, newData) {
      state.region = newData.res.data;
    },
    setCapacities(state, newData) {
      state.capacities = newData.res.data;
    },
    setTotalCapacities(state, newData) {
      state.totalCapacities = newData;
    },
    setTotalLoad(state, newData) {
      state.totalLoad = newData;
    },
    setIsRatioToLoad(state, isGeneration) {
      state.isRatioToLoad = !!isGeneration;
    }
  },
  actions: {
    async getAllCoutriesData({ commit }) {
      try {
        const response = await axios.get(
          "https://greenenergydata19892023.dev-bay.com/countries-capacities",
        );
        commit("setData", response.data);
      } catch (error) {
        console.error("Błąd pobierania danych z API:", error);
      }
    },
    async getPowerForecast({ commit }, requestData) {
      try {
        const response = await axios.post(
          "https://greenenergydata19892023.dev-bay.com/power-forecast",
          requestData,
        );
        
        
        commit("setData", response.data);
      } catch (error) {
        console.error("Błąd pobierania prognozy mocy z API:", error);
      }
    },
    async getCountryCapacities({ commit }, country) {
      try {
        const response = await axios.get(
          `https://greenenergydata19892023.dev-bay.com/countries-capacities/${country}`,
        );
        commit("setRegion", response.data);
      } catch (error) {
        
        console.error("Błąd pobierania prognozy mocy z API:", error);
      }
    },
    async getAllCountryCapacities({ commit }) {
      try {
        const response = await axios.get(
          `https://greenenergydata19892023.dev-bay.com/countries-capacities/`,
        );
        const totalCapacities = response.data.res.data.reduce((acc, currEl) => {
          //acc[currEl.country_code] = (parseFloat(currEl.wind_capacity) + parseFloat(currEl.solar_capacity)) / 1000; // OLD
          acc[currEl.country_code] = parseFloat(currEl.total_capacity_avg_high) / 1000;
          return acc;
        }, {});

        const totalLoad = response.data.res.data.reduce((acc, currEl) => {
          //acc[currEl.country_code] = (parseFloat(currEl.wind_capacity) + parseFloat(currEl.solar_capacity)) / 1000; // OLD
          acc[currEl.country_code] = parseFloat(currEl.total_load_avg_high) / 1000;
          return acc;
        }, {});

        commit("setCapacities", response.data);
        commit("setTotalCapacities", totalCapacities);
        commit("setTotalLoad", totalLoad);
      } catch (error) {
        console.error("Błąd pobierania prognozy mocy z API:", error);
      }
    },
  },

  getters: {
    getData(state) {
      return state.data;
    },
    getRegion(state) {
      return state.region;
    },
    getCapacities(state) {
      return state.capacities;
    },
    getTotalCapacities(state) {
      console.log("state", state.isRatioToLoad);
      return state.isRatioToLoad ? state.totalCapacities : state.totalLoad;
    },
    getIsRatioToLoad(state) {
      return state.isRatioToLoad;
    }
  },
});

export default store;
