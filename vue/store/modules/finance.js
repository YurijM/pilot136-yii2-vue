import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		finances: [],
		finance: null
	},
	getters: {
		getFinances: state => state.finances
	},
	mutations: {
		CLEAR_FINANCES(state) {
			state.finances = [];
		},
		SET_FINANCES(state, payload) {
			state.finances = payload;
		},
		SORT_FINANCES(state) {
			state.finances.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
				const year1 = a.year;
				const year2 = b.year;
				const quarter1 = a.quarter;
				const quarter2 = b.quarter;

				let result = 0;
				if (year1 < year2) {
					result = 1;
				} else if (year1 > year2) {
					result = -1;
				} else {
					if (quarter1 < quarter2) {
						result = 1;
					} else {
						result = -1;
					}
				}
				return result;
			});
		},
		GET_FINANCE(state, payload) {
			state.finance = state.finances.filter(el => el.id === payload)[0];
		},
		ADD_FINANCE(state, payload) {
			state.finances.push(payload);
		},
		UPDATE_FINANCE(state, payload) {
			const i = state.finances.map(el => parseInt(el.id)).indexOf(payload.id);
			state.finances[i] = payload;
		},
		DELETE_FINANCE(state, payload) {
			state.finances = state.finances.filter(el => el.id !== payload);
		}
	},
	actions: {
		clearFinances({commit}) {
			commit('CLEAR_FINANCES');
		},
		async loadFinances({commit, dispatch}) {
			await axios
			.get('finance/list')
			.then(response => {
				dispatch('clearFinances');
				commit('SET_FINANCES', response.data);
				commit('SORT_FINANCES');
			});
		},
		async createFinance({commit, dispatch}, finance) {
			const formData = new FormData();
			formData.append('title', finance.title);
			formData.append('year', finance.year);
			formData.append('quarter', finance.quarter);
			formData.append('file', finance.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/finance/add', formData, {
			.post('finance/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => {
				if (response.data.result === '') {
					commit('ADD_FINANCE', response.data.finance);
					commit('SORT_FINANCES');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${finance.title}' (файл '${response.data.finance.file}') сохранён`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Create Finance Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении документа (см. в консоли "Create Finance Error")'
				}, {root: true});
			});
		},
		async updateFinance({commit, dispatch}, finance) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('id', finance.id);
			formData.set('title', finance.title);
			formData.set('year', finance.year);
			formData.set('quarter', finance.quarter);
			formData.set('fileName', finance.fileName);
			formData.set('file', finance.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/finance/edit', formData)
			.post('finance/edit', formData)
			.then(response => {
				if (response.data.result === '') {
					commit('UPDATE_FINANCE', response.data.finance);
					commit('SORT_FINANCES');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${finance.title}' обновлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Update Finance Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении документа (см. в консоли "Update Finance Error")'
				}, {root: true});
			});
		},
		async deleteFinance({state, commit, dispatch}, id) {
			const formData = new FormData();
			formData.set('_method', 'DELETE');
			formData.set('id', id);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/finance/remove', formData)
			.post('finance/remove', formData)
			.then(response => {
				commit('GET_FINANCE', id);
				commit('DELETE_FINANCE', id);
				if (response.data === '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${state.finance.title}' удален`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Delete Finance Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении документа (см. в консоли "Delete Finance Error")'
				}, {root: true});
			});
		}
	}
};