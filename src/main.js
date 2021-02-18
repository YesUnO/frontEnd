/* eslint-disable */
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store'
import GAuth from 'vue-google-oauth2'
import { googleApiKey } from "../auth_config.json"

//google auth
const googleOptions = {
    clientId: googleApiKey,
    scope:'email',
    prompt:'consent',
    fetch_basic_profile:'true'
};

Vue.use(GAuth,googleOptions);

//axios rewusts
Vue.use(VueAxios, axios);

axios.interceptors.request.use(function(config){
    if (app.$store.state.credentials.token !== ''){
        config.headers['Origin'] = 'http://saras-sudoku.com'
        config.headers['Authorization'] = `Bearer ${app.$store.state.credentials.token}`;
    }
    return config;
},function(error){
    return Promise.reject(error);
});

//formating filters
Vue.filter('time',(value)=>{
    if (!value) return ''
    let min = Math.floor(value/60)
    let sec = Math.floor(value - 60*min)
    value = min + ':' + sec
    return value;
})

Vue.config.productionTip = false

let app = new Vue({
    vuetify,
    store: store,
    router,
  render: h => h(App)
}).$mount('#app')
