import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		users: []
	},
	getters: {
		getUsers: state => state.users
	},
	mutations: {
		CLEAR_USERS(state) {
			state.users = [];
		},
		SET_USERS(state, payload) {
			state.users = payload;
		}
	},
	actions: {
		clearUsers({commit}) {
			commit('CLEAR_USERS');
		},
		async loadUsers({commit, dispatch}) {
			dispatch('clearUsers');

			await axios
			.get('user')
			.then(response => commit('SET_USERS', response.data));
		}
	}
};