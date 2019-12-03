import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		requisites: [],
		requisite: null,
	},
	getters: {
		getRequisites: state => state.requisites,
	},
	mutations: {
		CLEAR_REQUISITES(state) {
			state.requisites = [];
		},
		SET_REQUISITES(state, payload) {
			state.requisites = payload;
		},
		SORT_REQUISITES(state) {
			state.requisites.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
				const item1 = a.requisite.toUpperCase();
				const item2 = b.requisite.toUpperCase();

				let result = 0;
				if (item1 > item2) {
					result = 1;
				} else if (item1 < item2) {
					result = -1;
				}
				return result;
			});
		},
		GET_REQUISITE(state, payload) {
			state.requisite = state.requisites.filter(requisite => requisite.id === payload)[0];
		},
		ADD_REQUISITE(state, payload) {
			state.requisites.push({
				id: payload.id,
				requisite: payload.requisite,
				value: payload.value
			});
		},
		UPDATE_REQUISITE(state, payload) {
			const i = state.requisites.map(el => parseInt(el.id)).indexOf(payload.id);
			state.requisites[i] = payload;
		},
		DELETE_REQUISITE(state, payload) {
			state.requisites = state.requisites.filter(el => el.id !== payload);
		}
	},
	actions: {
		async loadRequisites({commit}) {
			commit('CLEAR_REQUISITES');

			await axios
			.get('requisite/list')
			.then(response => {
				commit('SET_REQUISITES', response.data.requisites);
			});
		},
		async createRequisite({commit, dispatch}, requisite) {
			const formData = new FormData();
			formData.set('requisite', requisite.requisite);
			formData.set('value', requisite.value);
			await axios
			.post('requisite', formData)
			.then(response => {
				commit('ADD_REQUISITE', response.data);
				commit('SORT_REQUISITES');
				dispatch('common/setInfo', {
					type: 'success',
					message: `Реквизит '${response.data.requisite}' добавлен`
				}, {root: true});
			})
			.catch(error => {
				console.log('Create Requisite Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении реквизита (см. в консоли "Create Requisite Error")'
				}, {root: true});
			});
		},
		async updateRequisite({commit, dispatch}, requisite) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('requisite', requisite.requisite);
			formData.set('value', requisite.value);
			await axios
			.post(`requisite/${requisite.id}`, formData)
			.then(response => {
				commit('UPDATE_REQUISITE', response.data);
				commit('SORT_REQUISITES');

				dispatch('common/setInfo', {
					type: 'success',
					message: `Реквизит '${response.data.requisite}' обновлен`
				}, {root: true});
			})
			.catch(error => {
				console.log('Update Requisite Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении реквизита (см. в консоли "Update Requisite Error")'
				}, {root: true});
			});
		},
		async deleteRequisite({state, commit, dispatch}, id) {
			await axios
			.delete(`requisite/${id}`)
			.then(response => {
				commit('GET_REQUISITE', id);
				commit('DELETE_REQUISITE', id);
				dispatch('common/setInfo', {
					type: 'success',
					message: `Реквизит '${state.requisite.requisite}' удален`
				}, {root: true});
			})
			.catch(error => {
				console.log('Delete Requisite Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении реквизита (см. в консоли "Delete Requisite Error")'
				}, {root: true});
			});
		}
	}
};