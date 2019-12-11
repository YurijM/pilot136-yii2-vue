import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import Main from './components/Main';
import Docs from './components/Docs';
import Notice from './components/Notice';
import Photo from './components/Photo';

import {store} from '../store';
import NProgress from "nprogress";

const routes = [
	{
		path: '',
		redirect: {name: 'main'}
	},
	{
		name: 'main',
		path: '/',
		component: Main,
		meta: {
			title: 'Главная'
		},
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
		meta: {
			title: 'Документы'
		},
		async beforeEnter(from, to, next) {
			await store.dispatch('act/loadActs');
			await store.dispatch('contract/loadContracts');
			await store.dispatch('certificate/loadCertificates');
			await store.dispatch('finance/loadFinances');
			await store.dispatch('overhaul/loadOverhauls');
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
			title: 'Фотографии'
		},
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

const TITLE_DEFAULT = 'ТСЖ "Пилот"';

router.beforeResolve((to, from, next) => {
	if (to.name) {
		NProgress.start();
	}
	next();
});

router.afterEach((to, from) => {
	document.title = (to.meta.title ? to.meta.title + ' - ' : '') + TITLE_DEFAULT;

	NProgress.done();
});
