import Vue from 'vue';
import Vuex from 'vuex';
//import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

import common from './modules/common';
import login from './modules/login';
import user from './modules/user';
import requisite from './modules/requisite';
import post from './modules/post';
import staff from './modules/staff';
import act from './modules/act';
import contract from './modules/contract';
import finance from './modules/finance';
import overhaul from './modules/overhaul';
import protocol from './modules/protocol';
import certificate from './modules/certificate';
import notice from './modules/notice';
import photo from './modules/photo';

export const store = new Vuex.Store({
	modules: {
		common,
		login,
		user,
		requisite,
		post,
		staff,
		act,
		contract,
		finance,
		overhaul,
		protocol,
		certificate,
		notice,
		photo
	},
	/*plugins: [createPersistedState(
		{
			key: 'pilot-admin',
			paths: ['login.admin'],
			storage: window.sessionStorage
		}
	)],*/
	strict: process.env.NODE_ENV !== 'production'
});
