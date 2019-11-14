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
		/*async beforeEnter(from, to, next){
			await store.dispatch('staff/loadPosts');
			await store.dispatch('staff/sortPostsByOrderNo');
			await store.dispatch('staff/loadStaff');
			next();
		}*/
	},
	{
		name: 'docs',
		path: '/docs',
		component: Docs
	},
	{
		name: 'notice',
		path: '/notice',
		component: Notice
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