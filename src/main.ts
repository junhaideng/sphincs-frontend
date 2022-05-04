import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import axios from "axios";

axios.interceptors.request.use((config) => {
  config.baseURL = import.meta.env.VITE_APP_BACKEND;
  return config
});

const app = createApp(App);
app.use(Antd);

app.mount("#app");
