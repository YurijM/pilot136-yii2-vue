import Vue from 'vue';
import App from './admin/App.vue';

import {Vue2Storage} from 'vue2-storage';
Vue.use(Vue2Storage);
/*// Можно заодно передать опции
Vue.use(Vue2Storage, {
	prefix: 'ym_',
	driver: 'session',
	//ttl: 60 * 60 * 24 * 1000 // 24 часа
	ttl: 60 * 5 * 1000 // 5 минут
});*/

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
	faQuestionCircle,
	faMinusCircle
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
	faQuestionCircle,
	faMinusCircle
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import {router} from './admin/routes';
import {store} from './store';

Vue.config.productionTip = false;

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount('#app');
