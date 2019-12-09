import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		contracts: [],
		contract: null
	},
	getters: {
		getContracts: state => state.contracts
	},
	mutations: {
		CLEAR_CONTRACTS(state) {
			state.contracts = [];
		},
		SET_CONTRACTS(state, payload) {
			state.contracts = payload;
		},
		SORT_CONTRACTS(state) {
			state.contracts.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
				const year1 = a.year;
				const year2 = b.year;
				const title1 = a.title.toUpperCase();
				const title2 = b.title.toUpperCase();

				let result = 0;
				if (year1 < year2) {
					result = 1;
				} else if (year1 > year2) {
					result = -1;
				} else {
					if (title1 > title2) {
						result = 1;
					} else {
						result = -1;
					}
				}
				return result;
			});
		},
		GET_CONTRACT(state, payload) {
			state.contract = state.contracts.filter(el => el.id === payload)[0];
		},
		ADD_CONTRACT(state, payload) {
			state.contracts.push(payload);
		},
		UPDATE_CONTRACT(state, payload) {
			const i = state.contracts.map(el => parseInt(el.id)).indexOf(payload.id);
			state.contracts[i] = payload;
		},
		DELETE_CONTRACT(state, payload) {
			state.contracts = state.contracts.filter(el => el.id !== payload);
		}
	},
	contractions: {
		clearContracts({commit}) {
			commit('CLEAR_CONTRACTS');
		},
		async loadContracts({commit, dispatch}) {
			await axios
			.get('contract/list')
			.then(response => {
				dispatch('clearContracts');
				commit('SET_CONTRACTS', response.data.contracts);
				commit('SORT_CONTRACTS');
			});
		},
		async createContract({commit, dispatch}, contract) {
			const formData = new FormData();
			formData.append('title', contract.title);
			formData.append('year', contract.year);
			formData.append('file', contract.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/contract/add', formData, {
			.post('contract/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => {
				if (response.data.result === '') {
					commit('ADD_CONTRACT', response.data.contract);
					commit('SORT_CONTRACTS');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${contract.title}' (файл '${response.data.contract.file}') сохранён`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Create Contract Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении акта (см. в консоли "Create Contract Error")'
				}, {root: true});
			});
		},
		async updateContract({commit, dispatch}, contract) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('id', contract.id);
			formData.set('title', contract.title);
			formData.set('year', contract.year);
			formData.set('fileName', contract.fileName);
			formData.set('file', contract.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/contract/edit', formData)
			.post('contract/edit', formData)
			.then(response => {
				if (response.data.result === '') {
					commit('UPDATE_CONTRACT', response.data.contract);
					commit('SORT_CONTRACTS');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${contract.title}' обновлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Update Contract Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении акта (см. в консоли "Update Contract Error")'
				}, {root: true});
			});
		},
		async deleteContract({state, commit, dispatch}, id) {
			const formData = new FormData();
			formData.set('_method', 'DELETE');
			formData.set('id', id);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/contract/remove', formData)
			.post('contract/remove', formData)
			.then(response => {
				commit('GET_CONTRACT', id);
				commit('DELETE_CONTRACT', id);
				if (response.data === '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${state.contract.title}' удален`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Delete Contract Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении акта (см. в консоли "Delete Contract Error")'
				}, {root: true});
			});
		}
	}
};