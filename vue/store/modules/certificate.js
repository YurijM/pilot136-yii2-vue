import axios from 'axios';

import {config} from '../../config';

axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		certificates: [],
		certificate: null
	},
	getters: {
		getCertificates: state => state.certificates
	},
	mutations: {
		CLEAR_CERTIFICATES(state) {
			state.certificates = [];
		},
		SET_CERTIFICATES(state, payload) {
			state.certificates = payload;
		},
		SORT_CERTIFICATES(state) {
			state.certificates.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
				const title1 = a.title.toUpperCase();
				const title2 = b.title.toUpperCase();

				let result = 0;
				if (title1 > title2) {
					result = 1;
				} else {
					result = -1;
				}

				return result;
			});
		},
		GET_CERTIFICATE(state, payload) {
			state.certificate = state.certificates.filter(el => el.id === payload)[0];
		},
		ADD_CERTIFICATE(state, payload) {
			state.certificates.push(payload);
		},
		UPDATE_CERTIFICATE(state, payload) {
			const i = state.certificates.map(el => parseInt(el.id)).indexOf(payload.id);
			state.certificates[i] = payload;
		},
		DELETE_CERTIFICATE(state, payload) {
			state.certificates = state.certificates.filter(el => el.id !== payload);
		}
	},
	actions: {
		clearCertificates({commit}) {
			commit('CLEAR_CERTIFICATES');
		},
		async loadCertificates({commit, dispatch}) {
			await axios
			.get('certificate/list')
			.then(response => {
				dispatch('clearCertificates');
				commit('SET_CERTIFICATES', response.data);
				commit('SORT_CERTIFICATES');
			});
		},
		async createCertificate({commit, dispatch}, certificate) {
			const formData = new FormData();
			formData.append('title', certificate.title);
			formData.append('file', certificate.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/certificate/add', formData, {
			.post('certificate/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => {
				if (response.data.result === '') {
					commit('ADD_CERTIFICATE', response.data.certificate);
					commit('SORT_CERTIFICATES');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${certificate.title}' (файл '${response.data.certificate.file}') сохранён`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Create Certificate Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении сертификата (см. в консоли "Create Certificate Error")'
				}, {root: true});
			});
		},
		async updateCertificate({commit, dispatch}, certificate) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('id', certificate.id);
			formData.set('title', certificate.title);
			formData.set('fileName', certificate.fileName);
			formData.set('file', certificate.file);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/certificate/edit', formData)
			.post('certificate/edit', formData)
			.then(response => {
				if (response.data.result === '') {
					commit('UPDATE_CERTIFICATE', response.data.certificate);
					commit('SORT_CERTIFICATES');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${certificate.title}' обновлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Update Certificate Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении сертификата (см. в консоли "Update Certificate Error")'
				}, {root: true});
			});
		},
		async deleteCertificate({state, commit, dispatch}, id) {
			const formData = new FormData();
			formData.set('_method', 'DELETE');
			formData.set('id', id);
			await axios
			//.post('http://pilot136-yii2-vue-api/v1/certificate/remove', formData)
			.post('certificate/remove', formData)
			.then(response => {
				commit('GET_CERTIFICATE', id);
				commit('DELETE_CERTIFICATE', id);
				if (response.data === '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Документ '${state.certificate.title}' удален`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Delete Certificate Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении сертификата (см. в консоли "Delete Certificate Error")'
				}, {root: true});
			});
		}
	}
};