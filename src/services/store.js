import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state() {
    return {
      data: null,
      region: null,
      capacities: null,
      totalCapacities: null
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
          acc[currEl.country_code] = (parseFloat(currEl.wind_capacity) + parseFloat(currEl.solar_capacity)) / 1000;
          return acc;
        }, {})

        commit("setCapacities", response.data);
        commit("setTotalCapacities", totalCapacities);
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
      return state.totalCapacities;
    }
  },
});

export default store;
