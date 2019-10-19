import Vue from 'vue';
import App from './admin/App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import '../node_modules/nprogress/nprogress.css';
import './admin/style/main.scss';

import {library} from '@fortawesome/fontawesome-svg-core';
import {
	faPencilAlt,
	faTrashAlt,
	faUsers,
	faUserLock,
	faUserCircle,
	faBriefcase,
	faPassport,
	faMoneyBillAlt,
	faFileContract,
	faTools,
	faAd,
	faCameraRetro,
	faSignOutAlt,
	faInfoCircle,
	faExclamationCircle,
	faQuestionCircle
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(
	faPencilAlt,
	faTrashAlt,
	faUsers,
	faUserLock,
	faUserCircle,
	faBriefcase,
	faPassport,
	faMoneyBillAlt,
	faFileContract,
	faTools,
	faAd,
	faCameraRetro,
	faSignOutAlt,
	faInfoCircle,
	faExclamationCircle,
	faQuestionCircle
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import {router} from './admin/routes';
import {store} from './admin/store';

Vue.config.productionTip = false;

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount('#app');
