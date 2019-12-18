import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		overhauls: [],
		overhaul: null,
		count: 0,
		currentIdx: 1
	},
	getters: {
		getOverhauls: state => state.overhauls,
		getCount: state => state.overhauls.length,
		getCurrentIdx: state => state.currentIdx
	},
	mutations: {
		CLEAR_OVERHAULS(state) {
			state.overhauls = [];
		},
		SET_OVERHAULS(state, payload) {
			state.overhauls = payload;
		},
		SORT_OVERHAULS(state) {
			state.overhauls.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
				const year1 = parseInt(a.year);
				const year2 = parseInt(b.year);
				const month1 = parseInt(a.month);
				const month2 = parseInt(b.month);
				const title1 = a.title.toUpperCase();
				const title2 = b.title.toUpperCase();

				let result = 0;
				if (year1 < year2) {
					result = 1;
				} else if (year1 > year2) {
					result = -1;
				} else {
					if (month1 < month2) {
						result = 1;
					} else if (month1 > month2) {
						result = -1;
					} else {
						if (title1 > title2) {
							result = 1;
						} else {
							result = -1;
						}
					}
				}
				return result;
			});
		},
		GET_OVERHAUL(state, payload) {
			state.overhaul = state.overhauls.filter(el => el.id === payload)[0];
		},
		SET_CURRENT_IDX(state, payload) {
			state.currentIdx = payload;
		},
		ADD_OVERHAUL(state, payload) {
			state.overhauls.push(payload);
		},
		UPDATE_OVERHAUL(state, payload) {
			const i = state.overhauls.map(el => parseInt(el.id)).indexOf(payload.id);
			state.overhauls[i] = payload;
		},
		DELETE_OVERHAUL(state, payload) {
			state.overhauls = state.overhauls.filter(el => el.id !== payload);
		}
	},
	actions: {
		clearOverhauls({commit}) {
			commit('CLEAR_OVERHAULS');
		},
		async loadOverhauls({commit, dispatch}) {
			await axios
			.get('overhaul/list')
			.then(response => {
				dispatch('clearOverhauls');
				commit('SET_OVERHAULS', response.data);
				commit('SORT_OVERHAULS');
			});
		},
		async createOverhaul({state, commit, dispatch}, overhaul) {
			const formData = new FormData();
			formData.append('title', overhaul.title);
			formData.append('year', overhaul.year);
			formData.append('month', overhaul.month);
			formData.append('file', overhaul.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/overhaul/add', formData, {
			.post('overhaul/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => {
				if (response.data.result === '') {
					commit('ADD_OVERHAUL', response.data.overhaul);
					commit('SORT_OVERHAULS');
					commit(
						'SET_CURRENT_IDX',
						state.overhauls.map(el => parseInt(el.id)).indexOf(response.data.overhaul.id)
					);

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${overhaul.title}' (файл '${response.data.overhaul.file}') сохранён`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Create Overhaul Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении документа (см. в консоли "Create Overhaul Error")'
				}, {root: true});
			});
		},
		async updateOverhaul({state, commit, dispatch}, overhaul) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('id', overhaul.id);
			formData.set('title', overhaul.title);
			formData.set('year', overhaul.year);
			formData.set('month', overhaul.month);
			formData.set('fileName', overhaul.fileName);
			formData.set('file', overhaul.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/overhaul/edit', formData)
			.post('overhaul/edit', formData)
			.then(response => {
				if (response.data.result === '') {
					commit('UPDATE_OVERHAUL', response.data.overhaul);
					commit('SORT_OVERHAULS');
					commit(
						'SET_CURRENT_IDX',
						state.overhauls.map(el => parseInt(el.id)).indexOf(overhaul.id)
					);

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${overhaul.title}' обновлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Update Overhaul Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении документа (см. в консоли "Update Overhaul Error")'
				}, {root: true});
			});
		},
		async deleteOverhaul({state, commit, dispatch}, id) {
			const formData = new FormData();
			formData.set('_method', 'DELETE');
			formData.set('id', id);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/overhaul/remove', formData)
			.post('overhaul/remove', formData)
			.then(response => {
				commit('GET_OVERHAUL', id);
				commit('DELETE_OVERHAUL', id);
				if (response.data === '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${state.overhaul.title}' удален`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Delete Overhaul Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении документа (см. в консоли "Delete Overhaul Error")'
				}, {root: true});
			});
		}
	}
};