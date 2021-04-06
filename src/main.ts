import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import Toaster from "@meforma/vue-toaster";


let app = createApp(App);
app.use(Toaster).provide('toast', app.config.globalProperties.$toast).use(router).use(VueClipboard).mount('#app');
