import axios from 'axios';

export default {
	namespaced: true,
	state: {
		info: {
			type: '',
			message: ''
		},
	},
	getters: {
		getInfo: state => state.info
	},
	mutations: {
		SET_INFO(state, info) {
			state.info.type = info.type;
			state.info.message = info.message;
		},
		CLEAR_INFO(state) {
			state.info = {type: '', message: ''};
		}
	},
	actions: {
		setInfo({commit}, info) {
			commit('SET_INFO', info);
		},
		clearInfo({commit}) {
			commit('CLEAR_INFO');
		}
	}
};
