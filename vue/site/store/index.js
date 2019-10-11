import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

//import user from './modules/user'
//import staff from './modules/staff'

export const store = new Vuex.Store({
	modules: {
		//user,
		//staff
	},
	strict: process.env.NODE_ENV !== 'production'
});
