import axios from 'axios';
import Vue from "vue";

export default {
	namespaced: true,
	state: {
		admin: {
			id: 0,
			name: '',
			codeError: 1
		}
	},
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
	//axios.defaults.headers.common['Authorization'] = 'Bearer ' + Cookies.get('Token')
	actions: {
		clearAdmin({commit}) {
			commit('CLEAR_ADMIN');
		},
		async checkAdmin({commit}, admin) {
			await axios
			.get('http://pilot136-yii2-vue-api/v1/user/check', {
				params: {
					name: admin.name,
					password: admin.password
				},
			})
			/*axios({
				method: 'get',
				url: 'http://pilot136-yii2-vue-api/v1/user/check',
				headers: { Authorization: 'Bearer 12345'}
			})*/
			.then(response => {
				if (isNaN(response.data)) {
					commit('SET_ADMIN', {
						id: response.data.id,
						name: response.data.username,
						codeError: 0
					});
				} else
					commit('SET_ADMIN', {
						id: 0,
						name: '',
						codeError: response.data
					});
			});
		},
		logout({dispatch}) {
			dispatch('clearAdmin');
			Vue.$storage.clear('admin');

			dispatch('common/setInfo', {
				type: 'info',
				message: 'Сессия закрыта'
			}, {root: true});
		},
	}
};
