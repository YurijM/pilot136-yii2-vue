import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		protocols: [],
		protocol: null
	},
	getters: {
		getProtocols: state => state.protocols
	},
	mutations: {
		CLEAR_PROTOCOLS(state) {
			state.protocols = [];
		},
		SET_PROTOCOLS(state, payload) {
			state.protocols = payload;
		},
		SORT_PROTOCOLS(state) {
			state.protocols.sort((a, b) => {
				const item1 = a.date.toInteger;
				const item2 = b.date.toInteger;

				let result = 0;
				if (item1 < item2) {
					result = 1;
				} else if (item1 > item2) {
					result = -1;
				}

				return result;
			});
		},
		GET_PROTOCOL(state, payload) {
			state.protocol = state.protocols.filter(el => el.id === payload)[0];
		},
		ADD_PROTOCOL(state, payload) {
			state.protocols.push(payload);
		},
		UPDATE_PROTOCOL(state, payload) {
			const i = state.protocols.map(el => parseInt(el.id)).indexOf(payload.id);
			state.protocols[i] = payload;
		},
		DELETE_PROTOCOL(state, payload) {
			state.protocols = state.protocols.filter(el => el.id !== payload);
		}
	},
	actions: {
		clearProtocols({commit}) {
			commit('CLEAR_PROTOCOLS');
		},
		async loadProtocols({commit, dispatch}) {
			await axios
			.get('protocol/list')
			.then(response => {
				dispatch('clearProtocols');
				commit('SET_PROTOCOLS', response.data);
				commit('SORT_PROTOCOLS');
			});
		},
		async createProtocol({commit, dispatch}, protocol) {
			const formData = new FormData();
			formData.append('title', protocol.title);
			formData.append('date', protocol.date);
			formData.append('file', protocol.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/protocol/add', formData, {
			.post('protocol/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => {
				if (response.data.result === '') {
					commit('ADD_PROTOCOL', response.data.protocol);
					commit('SORT_PROTOCOLS');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Протокол от ${new Date(response.data.protocol.date).toLocaleDateString()} добавлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Create Protocol Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении протокола (см. в консоли "Create Protocol Error")'
				}, {root: true});
			});
		},
		async updateProtocol({commit, dispatch}, protocol) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('id', protocol.id);
			formData.set('title', protocol.title);
			formData.set('date', protocol.date);
			formData.set('fileName', protocol.fileName);
			formData.set('file', protocol.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/protocol/edit', formData)
			.post('protocol/edit', formData)
			.then(response => {
				if (response.data.result === '') {
					commit('UPDATE_PROTOCOL', response.data.protocol);
					commit('SORT_PROTOCOLS');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Протокол от ${new Date(protocol.date).toLocaleDateString()} обновлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Update Protocol Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении протокола (см. в консоли "Update Protocol Error")'
				}, {root: true});
			});
		},
		async deleteProtocol({state, commit, dispatch}, id) {
			const formData = new FormData();
			formData.set('_method', 'DELETE');
			formData.set('id', id);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/protocol/remove', formData)
			.post('protocol/remove', formData)
			.then(response => {
				commit('GET_PROTOCOL', id);
				commit('DELETE_PROTOCOL', id);
				if (response.data === '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Протокол от ${new Date(state.protocol.date).toLocaleDateString()} удален`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Delete Protocol Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении протокола (см. в консоли "Delete Protocol Error")'
				}, {root: true});
			});
		}
	}
};