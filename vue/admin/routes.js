import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';

Vue.use(VueRouter);

import Login from './components/Login';
import Act from "./components/Act";
/*import User from './components/User';
import Staff from './components/Staff';
import Logout from './components/Logout';
import NotFound from './components/NotFound';*/

import {store} from "./store";

const routes = [
	{
		path: '',
		redirect: {name: 'login'}
	},
	{
		name: 'login',
		path: '/login',
		component: Login,
		/*async beforeEnter(from, to, next) {
			if (store.getters['login/isAdmin']) {
				next(router.back());
			} else {
				Vue.$storage.setOptions({
					prefix: 'ym_',
					driver: 'local',
					//ttl: 60 * 60 * 24 * 1000 // 24 часа
					ttl: 60 * 5 * 1000 // 5 минут
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
					next(router.back());
				} else {
					next();
				}
			}
		}*/
	},
	{
		name: 'act',
		path: '/act',
		component: Act,
		/*async beforeEnter(from, to, next) {
			await checkLogin('act/loadActs', next);
		}*/
	}
	/*{
		name: 'user',
		path: '/user',
		component: User,
		async beforeEnter(from, to, next){
			if (store.getters['login/isAdmin']) {
				await store.dispatch('user/loadUsers');
				next();
			} else {
				next('/login');
			}
		}
	},
	{
		name: 'staff',
		path: '/staff/:page',
		component: Staff,
		async beforeEnter(from, to, next){
			if (store.getters['login/isAdmin']) {
				await store.dispatch('staff/loadStaff');
				next();
			} else {
				next('/login');
			}
		}
	},
	{
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

router.beforeEach(async(from, to, next) => {
	await store.dispatch('common/clearInfo');

	if (store.getters['login/isAdmin']) {
		/*if (from.name === 'login') {
			next(router.back());
		} else {
			next();
		}*/
		next();
	} else {
		Vue.$storage.setOptions({
			prefix: 'ym_',
			driver: 'local',
			//ttl: 60 * 60 * 24 * 1000 // 24 часа
			ttl: 60 * 5 * 1000 // 5 минут
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

			/*if (from.name === 'login') {
				next(router.back());
			} else {
				next();
			}*/
			next();
		} else {
			if (from.name !== 'login') {
				await store.dispatch('common/setInfo', {
					type: 'info',
					message: '<pre>Сессия закрыта.\nНеоходимо сначала авторизоваться.</pre>'
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
	NProgress.done();
});

export {router};
