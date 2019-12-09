import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Main from './components/Main';
import Docs from './components/Docs';
import Notice from './components/Notice';
import Photo from './components/Photo';

import {store} from '../store';

const routes = [
	{
		path: '',
		redirect: {name: 'main'}
	},
	{
		name: 'main',
		path: '/',
		component: Main,
		async beforeEnter(from, to, next){
			await store.dispatch('requisite/loadRequisites');
			await store.dispatch('post/getStaffByPost');
			next();
		}
	},
	{
		name: 'docs',
		path: '/docs',
		component: Docs,
		async beforeEnter(from, to, next) {
			await store.dispatch('act/loadActs');
			await store.dispatch('contract/loadContracts');
			next();
		}
	},
	{
		name: 'notice',
		path: '/notice',
		component: Notice,
		async beforeEnter(from, to, next) {
			await store.dispatch('notice/loadNotices');
			next();
		}
	},
	{
		name: 'photo',
		path: '/photo',
		component: Photo
	},
	/*{
		path: '*',
		component: E404
	}*/
];

export const router = new VueRouter({
	routes,
	mode: 'history'
});