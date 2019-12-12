import axios from 'axios';

import {config} from '../../config';

axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		photos: [],
		photo: null
	},
	getters: {
		getPhotos: state => state.photos
	},
	mutations: {
		CLEAR_PHOTOS(state) {
			state.photos = [];
		},
		SET_PHOTOS(state, payload) {
			state.photos = payload;
		},
		SORT_PHOTOS(state) {
			state.photos.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
				const file1 = a.file.toUpperCase();
				const file2 = b.file.toUpperCase();

				let result = 0;
				if (file1 < file2) {
					result = 1;
				} else {
					result = -1;
				}

				return result;
			});
		},
		GET_PHOTO(state, payload) {
			state.photo = state.photos.filter(el => el.id === payload)[0];
		},
		ADD_PHOTO(state, payload) {
			state.photos.push(payload);
		},
		DELETE_PHOTO(state, payload) {
			state.photos = state.photos.filter(el => el.id !== payload);
		}
	},
	actions: {
		clearPhotos({commit}) {
			commit('CLEAR_PHOTOS');
		},
		async loadPhotos({commit, dispatch}) {
			await axios
			.get('photo/list')
			.then(response => {
				dispatch('clearPhotos');
				commit('SET_PHOTOS', response.data);
				commit('SORT_PHOTOS');
			});
		},
		async createPhoto({commit, dispatch}, photo) {
			const formData = new FormData();
			formData.append('file', photo.file);
			await axios
			.post('photo/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => {
				if (response.data.result === '') {
					commit('ADD_PHOTO', response.data.photo);
					commit('SORT_PHOTOS');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Фотография '${response.data.photo.file}' сохранёна`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Create Photo Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении фотографии (см. в консоли "Create Photo Error")'
				}, {root: true});
			});
		},
		async deletePhoto({state, commit, dispatch}, id) {
			const formData = new FormData();
			formData.set('_method', 'DELETE');
			formData.set('id', id);
			await axios
			.post('photo/remove', formData)
			.then(response => {
				commit('GET_PHOTO', id);
				commit('DELETE_PHOTO', id);
				if (response.data === '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Фотография '${state.photo.file}' удалена`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Delete Photo Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении фотографии (см. в консоли "Delete Photo Error")'
				}, {root: true});
			});
		}
	}
};