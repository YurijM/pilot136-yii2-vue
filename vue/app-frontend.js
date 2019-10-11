import Vue from 'vue';
import App from './site/App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);

import {router} from './site/routes';
import {store} from './site/store';

Vue.config.productionTip = false;

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount('#app');
