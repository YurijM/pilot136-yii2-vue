import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';

Vue.use(VueRouter);

import Login from './components/Login';
import Act from "./components/Act";
import Contract from "./components/Contract";
import Finance from "./components/Finance";
import Overhaul from "./components/Overhaul";
import Certificate from "./components/Certificate";
import Protocol from "./components/Protocol";
import Notice from "./components/Notice";
import Post from './components/Post';
import Staff from './components/Staff';
import Requisite from './components/Requisite';
import Photo from './components/Photo';
//import NotFound from './components/NotFound';

import {store} from "../store";

const routes = [
	{
		path: '',
		redirect: {name: 'login'}
	},
	{
		name: 'login',
		path: '/login',
		component: Login,
		meta: {
			title: 'Авторизация'
		}
	},
	{
		name: 'requisite',
		path: '/requisite',
		component: Requisite,
		meta: {
			title: 'Реквизиты'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('requisite/loadRequisites');
			next();
		}
	},
	{
		name: 'post',
		path: '/post',
		component: Post,
		meta: {
			title: 'Должности'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('post/loadPosts');
			next();
		}
	},
	{
		name: 'staff',
		path: '/staff',
		component: Staff,
		meta: {
			title: 'Штат'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('staff/loadStaff');
			next();
		}
	},
	{
		name: 'act',
		path: '/act',
		component: Act,
		meta: {
			title: 'Акты'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('act/loadActs');
			next();
		}
	},
	{
		name: 'contract',
		path: '/contract',
		component: Contract,
		meta: {
			title: 'Договоры'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('contract/loadContracts');
			next();
		}
	},
	{
		name: 'certificate',
		path: '/certificate',
		component: Certificate,
		meta: {
			title: 'Свидетельства и паспорта'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('certificate/loadCertificates');
			next();
		}
	},
	{
		name: 'finance',
		path: '/finance',
		component: Finance,
		meta: {
			title: 'Финансы'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('finance/loadFinances');
			next();
		}
	},
	{
		name: 'overhaul',
		path: '/overhaul',
		component: Overhaul,
		meta: {
			title: 'Капитальный ремонт'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('overhaul/loadOverhauls');
			next();
		}
	},
	{
		name: 'protocol',
		path: '/protocol',
		component: Protocol,
		meta: {
			title: 'Протоколы'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('protocol/loadProtocols');
			next();
		}
	},
	{
		name: 'notice',
		path: '/notice',
		component: Notice,
		meta: {
			title: 'Объявления'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('notice/loadNotices');
			next();
		}
	},
	{
		name: 'photo',
		path: '/photo',
		component: Photo,
		meta: {
			title: 'Объявления'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('photo/loadPhotos');
			next();
		}
	}


	/*{
		name: 'logout',
		path: '/logout',
		component: Logout,
	},
	{
		name: 'not-found',
		path: '*',
		component: NotFound,
		async beforeEnter(from, to, next){
			next(router.back());
		}
	}*/
];

/*
export const router = new VueRouter({
	routes,
	mode: 'history'
});*/

async function checkLogin(action, next) {
	if (store.getters['login/isAdmin']) {
		await store.dispatch(action);
		next();
	} else {
		next('/login');
	}
}

const router = new VueRouter({
	routes,
	mode: 'history'
});

const TITLE_DEFAULT = 'ТСЖ "Пилот"';

router.beforeEach(async (from, to, next) => {
	await store.dispatch('common/clearInfo');

	if (store.getters['login/isAdmin']) {
		next();
	} else {
		Vue.$storage.setOptions({
			prefix: 'ym_',
			driver: 'local',
			//ttl: 60 * 60 * 24 * 1000 // 24 часа
			ttl: 60 * 60 * 8 * 1000 // 8 часов
		});

		const admin = Vue.$storage.get('admin');
		if (admin) {
			await store.commit(
				'login/SET_ADMIN',
				{
					id: admin.id,
					name: admin.name,
					codeError: 0
				}
			);
			next();
		} else {
			if (from.name !== 'login') {
				await store.dispatch('common/setInfo', {
					type: 'info',
					message: 'Сначала необходимо авторизоваться.'
				});

				next('/login');
			} else {
				next();
			}
		}
	}
});

router.beforeResolve((to, from, next) => {
	if (to.name) {
		NProgress.start();
	}
	next();
});

router.afterEach((to, from) => {
	//document.title = to.meta.title || TITLE_DEFAULT;
	document.title = (to.meta.title ? to.meta.title + ' - ' : '') + TITLE_DEFAULT;

	NProgress.done();
});

export {router};
