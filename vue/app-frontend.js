import Vue from 'vue';
import App from './site/App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import BootstrapVue from 'bootstrap-vue';

import '../node_modules/nprogress/nprogress.css';
import './site/style/main.scss';
import './site/style/animate.min.css';

Vue.use(BootstrapVue);

import {library} from '@fortawesome/fontawesome-svg-core';
import {
	faFileContract,
	faBars,
	faCameraRetro,
	faUsers,
	faThList,
	faFilePdf,
	faPaperclip
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

library.add(
	faFileContract,
	faBars,
	faCameraRetro,
	faUsers,
	faThList,
	faFilePdf,
	faPaperclip
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
