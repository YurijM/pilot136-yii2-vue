import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

/*import Main from './components/Main';
import Certificate from './components/Certificate';
import Finance from './components/Finance';*/

import {store} from './store';

const routes = [
	/*{
		path: '',
		redirect: {name: 'main'}
	},
	{
		name: 'main',
		path: '/',
		component: Main,
		async beforeEnter(from, to, next){
			await store.dispatch('staff/loadPosts');
			await store.dispatch('staff/sortPostsByOrderNo');
			await store.dispatch('staff/loadStaff');
			next();
		}
	},
	{
		name: 'certificate',
		path: '/certificate',
		component: Certificate
	},
	{
		name: 'finance',
		path: '/finance',
		component: Finance
	},*/
	/*{
		path: '*',
		component: E404
	}*/
];

export const router = new VueRouter({
	routes,
	mode: 'history'
});