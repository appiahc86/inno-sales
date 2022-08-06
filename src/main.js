import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import PrimeVue from "primevue/config";
import InputText from "primevue/inputtext";
import vSelect from "vue-select"
import Vue3Apexcharts from "vue3-apexcharts";
const app = createApp(App)

import 'primevue/resources/themes/rhea/theme.css'
// import 'primevue/resources/themes/nova-vue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

app.use(PrimeVue);
app.use(Vue3Apexcharts)
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('InputText', InputText);
app.component('v-select', vSelect);
app.use(store);
app.use(router).mount('#app');
