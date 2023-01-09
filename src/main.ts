import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import VueCookies from "vue-cookies";

const vapp = createApp( App )
vapp.use( VueCookies )
vapp.mount('#app')
