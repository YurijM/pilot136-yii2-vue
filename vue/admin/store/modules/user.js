import axios from 'axios';

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
			.get('http://pilot-vue-api/v1/user')
			.then(response => commit('SET_USERS', response.data));
		}
	}
};