import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./services/store"; // Importuj swój skonfigurowany store Vuex
import "intersection-observer";

const app = createApp(App);

app.use(router); // Dodaj router do aplikacji
app.use(store); // Dodaj Vuex store do aplikacji

app.mount("#app");
