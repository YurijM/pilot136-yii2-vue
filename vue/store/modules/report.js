import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		reports: [],
		report: null
	},
	getters: {
		getReports: state => state.reports
	},
	mutations: {
		CLEAR_REPORTS(state) {
			state.reports = [];
		},
		SET_REPORTS(state, payload) {
			state.reports = payload;
		},
		SORT_REPORTS(state) {
			state.reports.sort((a, b) => {
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
		GET_REPORT(state, payload) {
			state.report = state.reports.filter(el => el.id === payload)[0];
		},
		ADD_REPORT(state, payload) {
			state.reports.push(payload);
		},
		UPDATE_REPORT(state, payload) {
			const i = state.reports.map(el => parseInt(el.id)).indexOf(payload.id);
			state.reports[i] = payload;
		},
		DELETE_REPORT(state, payload) {
			state.reports = state.reports.filter(el => el.id !== payload);
		}
	},
	actions: {
		clearReports({commit}) {
			commit('CLEAR_REPORTS');
		},
		async loadReports({commit, dispatch}) {
			await axios
			.get('report/list')
			.then(response => {
				dispatch('clearReports');
				commit('SET_REPORTS', response.data);
				commit('SORT_REPORTS');
			});
		},
		async createReport({commit, dispatch}, report) {
			const formData = new FormData();
			formData.append('title', report.title);
			formData.append('date', report.date);
			formData.append('file', report.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/report/add', formData, {
			.post('report/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => {
				if (response.data.result === '') {
					commit('ADD_REPORT', response.data.report);
					commit('SORT_REPORTS');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ от ${new Date(response.data.report.date).toLocaleDateString()} добавлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Create Report Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении документа (см. в консоли "Create Report Error")'
				}, {root: true});
			});
		},
		async updateReport({commit, dispatch}, report) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('id', report.id);
			formData.set('title', report.title);
			formData.set('date', report.date);
			formData.set('fileName', report.fileName);
			formData.set('file', report.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/report/edit', formData)
			.post('report/edit', formData)
			.then(response => {
				if (response.data.result === '') {
					commit('UPDATE_REPORT', response.data.report);
					commit('SORT_REPORTS');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ от ${new Date(report.date).toLocaleDateString()} обновлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Update Report Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении документа (см. в консоли "Update Report Error")'
				}, {root: true});
			});
		},
		async deleteReport({state, commit, dispatch}, id) {
			const formData = new FormData();
			formData.set('_method', 'DELETE');
			formData.set('id', id);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/report/remove', formData)
			.post('report/remove', formData)
			.then(response => {
				commit('GET_REPORT', id);
				commit('DELETE_REPORT', id);
				if (response.data === '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ от ${new Date(state.report.date).toLocaleDateString()} удален`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Delete Report Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении документа (см. в консоли "Delete Report Error")'
				}, {root: true});
			});
		}
	}
};