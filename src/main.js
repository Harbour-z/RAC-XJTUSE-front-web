import '@/assets/main.scss'
import 'element-plus/dist/index.css'

import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import router from "@/router";
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-persistedstate-plugin";
import locale from 'element-plus/dist/locale/zh-cn'
import BaiduMap from 'vue-baidu-map-3x'


const app = createApp(App)
const pinia = createPinia()
const persistedState = createPersistedState();
pinia.use(persistedState)

app.use(pinia)
app.use(router)
app.use(ElementPlus, {locale})

app.use(BaiduMap, {
    // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
    ak: 'hhjZ06cLZHAg7WIb17a7xqxr70jVCX8Z',
    // v:'2.0',  // 默认使用3.0
    // type: 'WebGL' // ||API 默认API  (使用此模式 BMap=BMapGL)
});
app.mount('#app')





