import Vue from 'vue';
import App from './site/App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import BootstrapVue from 'bootstrap-vue';

import './site/style/main.scss';
import './site/style/animate.min.css';

Vue.use(BootstrapVue);

import {library} from '@fortawesome/fontawesome-svg-core';
import {
	faFileContract,
	faAd,
	faCameraRetro,
	faUsers,
	faThList
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(
	faFileContract,
	faAd,
	faCameraRetro,
	faUsers,
	faThList
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

import {router} from './site/routes';
import {store} from './store';

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount('#app');
