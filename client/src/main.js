import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import axios from 'axios'
import vuetify from './plugins/vuetify';
import VueToastify from "vue-toastify";
import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.use( CKEditor );
Vue.use(VueToastify);
Vue.config.productionTip = false;

Vue.prototype.$hostname = (Vue.config.productionTip) ? 'http://dd063408700b.ngrok.io' : 'http://localhost:3000';

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (401 === error.response.status) {
    if (confirm("Sessison expired. you want to logout and login again")) {
      localStorage.clear();
      console.log("cleared");
      store.state.isAuthenticated = false;
      router.push("/login");
    }
  } 
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
