import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
  state() {
    return {
      data: null,
      region: null,
    };
  },
  mutations: {
    setData(state, newData) {
      
      state.data = newData.res.data;
    },
    setRegion(state, newData) {
      state.region = newData.res.data;
    },
  },
  actions: {
    async getAllCoutriesData({ commit }) {
      try {
        const response = await axios.get(
          "http://greenenergydata19892023.dev-bay.com/countries-capacities",
        );
        commit("setData", response.data);
      } catch (error) {
        console.error("Błąd pobierania danych z API:", error);
      }
    },
    async getPowerForecast({ commit }, requestData) {
      try {
        const response = await axios.post(
          "http://greenenergydata19892023.dev-bay.com/power-forecast",
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
          `http://greenenergydata19892023.dev-bay.com/countries-capacities/${country}`,
        );
        commit("setRegion", response.data);
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
  },
});

export default store;
