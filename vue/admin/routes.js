import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

/*import Login from './components/Login';
import User from './components/User';
import Staff from './components/Staff';
import Logout from './components/Logout';
import NotFound from './components/NotFound';*/

import {store} from "./store";

const routes = [
	/*{
		path: '',
		redirect: {name: 'login'}
	},
	{
		name: 'login',
		path: '/login',
		component: Login
	},
	{
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

export const router = new VueRouter({
	routes,
	mode: 'history'
});