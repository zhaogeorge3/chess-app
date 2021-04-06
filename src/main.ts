import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { VueClipboard } from '@soerenmartius/vue3-clipboard'
import Toaster from "@meforma/vue-toaster";


createApp(App).use(router).use(VueClipboard).use(Toaster).mount('#app')
