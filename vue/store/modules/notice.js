import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		notices: [],
		notice: null,
	},
	getters: {
		getNotices: state => state.notices,
	},
	mutations: {
		CLEAR_NOTICES(state) {
			state.notices = [];
		},
		SET_NOTICES(state, payload) {
			state.notices = payload;
		},
		SORT_NOTICES(state) {
			state.notices.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
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
		GET_NOTICE(state, payload) {
			state.notice = state.notices.filter(notice => notice.id === payload)[0];
		},
		ADD_NOTICE(state, payload) {
			state.notices.push({
				id: payload.id,
				notice: payload.notice,
				sign: payload.sign,
				date: payload.date
			});
		},
		UPDATE_NOTICE(state, payload) {
			const i = state.notices.map(el => parseInt(el.id)).indexOf(payload.id);
			state.notices[i] = payload;
		},
		DELETE_NOTICE(state, payload) {
			state.notices = state.notices.filter(el => el.id !== payload);
		}
	},
	actions: {
		async loadNotices({commit}) {
			commit('CLEAR_NOTICES');

			await axios
			.get('notice/list')
			.then(response => {
				commit('SET_NOTICES', response.data.notices);
			});
		},
		async createNotice({commit, dispatch}, notice) {
			const formData = new FormData();
			formData.set('notice', notice.notice);
			formData.set('sign', notice.sign);
			formData.set('date', notice.date);
			await axios
			.post('notice', formData)
			.then(response => {
				commit('ADD_NOTICE', response.data);
				commit('SORT_NOTICES');
				dispatch('common/setInfo', {
					type: 'success',
					message: `Объявление от ${new Date(response.data.date).toLocaleDateString()} добавлено`
				}, {root: true});
			})
			.catch(error => {
				console.log('Create Notice Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении объявления (см. в консоли "Create Notice Error")'
				}, {root: true});
			});
		},
		async updateNotice({commit, dispatch}, notice) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('notice', notice.notice);
			formData.set('sign', notice.sign);
			formData.set('date', notice.date);
			await axios
			.post(`notice/${notice.id}`, formData)
			.then(response => {
				commit('UPDATE_NOTICE', response.data);
				commit('SORT_NOTICES');

				dispatch('common/setInfo', {
					type: 'success',
					message: `Объявление от ${new Date(response.data.date).toLocaleDateString()} обновлено`
				}, {root: true});
			})
			.catch(error => {
				console.log('Update Notice Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении объявления (см. в консоли "Update Notice Error")'
				}, {root: true});
			});
		},
		async deleteNotice({state, commit, dispatch}, id) {
			await axios
			.delete(`notice/${id}`)
			.then(response => {
				commit('GET_NOTICE', id);
				commit('DELETE_NOTICE', id);
				dispatch('common/setInfo', {
					type: 'success',
					message: `Объявление от ${new Date(state.notice.date).toLocaleDateString()} удалено`
				}, {root: true});
			})
			.catch(error => {
				console.log('Delete Notice Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении объявления (см. в консоли "Delete Notice Error")'
				}, {root: true});
			});
		}
	}
};