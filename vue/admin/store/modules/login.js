import axios from 'axios';

export default {
	namespaced: true,
	state: {
		admin: {
			id: 0,
			name: '',
			codeError: 1
		}	},
	getters: {
		getAdmin: state => state.admin,
		isAdmin: (state, getters) => getters.getAdmin.id > 0,
		getCodeError: (state, getters) => getters.getAdmin.codeError,
	},
	mutations: {
		SET_ADMIN(state, payload) {
			state.admin = payload;
		},
		CLEAR_ADMIN(state) {
			state.admin = {
				id: 0,
				name: '',
				codeError: 1
			};
		}
	},
	actions: {
		clearAdmin({commit}) {
			commit('CLEAR_ADMIN');
			//Cookies.remove('pilot-admin');
		},
		async setAdmin({commit}, admin) {
			await axios
			.get('http://pilot-vue-api/v1/user/check', {
				params: {
					name: admin.name,
					password: admin.password
				}
			})
			.then(response => {
				if (isNaN(response.data))
					commit('SET_ADMIN', {
						id: response.data.id,
						name: response.data.username,
						codeError: 0
					});
				else
					commit('SET_ADMIN', {
						id: 0,
						name: '',
						codeError: response.data
					});
			});
		},
		logout({dispatch}) {
			//dispatch('clearToken');
			dispatch('clearAdmin');
			/*dispatch('setInfo',
				{type: 'info', message: 'Сессия закрыта'},
				{root: true}
			);*/
		},
	}
};
