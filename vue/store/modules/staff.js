import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		staff: [],
		staffByPost: [],
		person: [],
		count: 0,
		currentIdx: 1
	},
	getters: {
		getStaff: state => state.staff,
		getCount: state => state.staff.length,
		getCurrentIdx: state => state.currentIdx,
	},
	mutations: {
		CLEAR_STAFF(state) {
			state.staff = [];
		},
		SET_STAFF(state, payload) {
			if (payload.length === 0) return;

			let prevPersonId = 0;
			let postIds = [];
			let posts = [];
			for (let i = 0, len = payload.length; i < len; ++i) {
				if (prevPersonId === payload[i].id || prevPersonId === 0) {
					postIds.push(payload[i].post_id);
					posts.push(payload[i].post);
					if (i > 0) payload[i - 1].post_id = null;
				} else {
					payload[i - 1].post_id = postIds;
					payload[i - 1].post = posts;
					postIds = [payload[i].post_id];
					posts = [payload[i].post];
				}

				prevPersonId = payload[i].id;
			}

			payload[payload.length - 1].post_id = postIds;
			payload[payload.length - 1].post = posts;

			state.staff = payload.filter(el => el.post_id !== null);
			state.staff.forEach((item, i, arr) => item.post = item.post.join(', '));
		},
		SORT_STAFF(state) {
			state.staff.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
				const item1 = a.person.toUpperCase();
				const item2 = b.person.toUpperCase();

				let result = 0;
				if (item1 > item2) {
					result = 1;
				} else if (item1 < item2) {
					result = -1;
				}
				return result;
			});
		},
		GET_PERSON(state, payload) {
			state.person = state.staff.filter(el => el.id === payload)[0];
		},
		SET_CURRENT_IDX(state, payload) {
			state.currentIdx = payload;
		},
		ADD_PERSON(state, payload) {
			state.staff.push({
				id: payload.staff.id,
				person: `${payload.staff.family} ${payload.staff.name} ${payload.staff.patronymic}`,
				post_id: payload.post_id,
				post: payload.post
			});
		},
		UPDATE_STAFF(state, payload) {
			const i = state.staff.map(el => parseInt(el.id)).indexOf(payload.staff.id);
			state.staff[i].person = `${payload.staff.family} ${payload.staff.name} ${payload.staff.patronymic}`;
			state.staff[i].post_id = payload.post_id;
			state.staff[i].post = payload.posts;
		},
		DELETE_STAFF(state, payload) {
			state.staff = state.staff.filter(el => el.id !== payload);
		}
	},
	actions: {
		async loadStaff({commit}) {
			commit('CLEAR_STAFF');

			await axios
			.get('staff/list')
			.then(response => {
				commit('SET_STAFF', response.data);
			});
		},
		async createStaff({state, commit, dispatch}, staff) {
			const formData = new FormData();
			formData.set('family', staff.family);
			formData.set('name', staff.name);
			formData.set('patronymic', staff.patronymic);
			formData.set('postIds', staff.postIds);
			await axios
			.post('staff/add', formData)
			.then(response => {
				if (response.data.result === '') {
					commit('ADD_PERSON', {staff: response.data.staff, post: staff.posts, post_id: staff.postIds});
					commit('SORT_STAFF');
					commit(
						'SET_CURRENT_IDX',
						state.staff.map(el => parseInt(el.id)).indexOf(response.data.staff.id)
					);
					dispatch('common/setInfo', {
						type: 'success',
						message: `Сотрудник '${staff.family} ${staff.name} ${staff.patronymic}' добавлен в штат`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Create Staff Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении сотрудника (см. в консоли "Create Staff Error")'
				}, {root: true});
			});
		},
		async updateStaff({state, commit, dispatch}, staff) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('id', staff.id);
			formData.set('family', staff.family);
			formData.set('name', staff.name);
			formData.set('patronymic', staff.patronymic);
			formData.set('postIds', staff.postIds);
			await axios
			.post('staff/edit', formData)
			.then(response => {
				if (response.data.result === '') {
					commit('UPDATE_STAFF', {staff: response.data.staff, post_id: staff.postIds, posts: response.data.posts});
					commit('SORT_STAFF');
					commit(
						'SET_CURRENT_IDX',
						state.staff.map(el => parseInt(el.id)).indexOf(staff.id)
					);
					dispatch('common/setInfo', {
						type: 'success',
						message: `Сотрудник '${response.data.staff.family} ${response.data.staff.name} ${response.data.staff.patronymic}' обновлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Update Staff Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении сотрудника (см. в консоли "Update Staff Error")'
				}, {root: true});
			});
		},
		async deleteStaff({state, commit, dispatch}, id) {
			const formData = new FormData();
			formData.set('_method', 'DELETE');
			formData.set('id', id);
			await axios
			.post('staff/remove', formData)
			.then(response => {
				commit('GET_PERSON', id);
				commit('DELETE_STAFF', id);
				if (response.data === '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Сотрудник '${state.person.person}' удален`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Delete Staff Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении сотрудника (см. в консоли "Delete Staff Error")'
				}, {root: true});
			});
		}
	}
};