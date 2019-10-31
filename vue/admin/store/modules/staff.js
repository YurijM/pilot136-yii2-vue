import axios from 'axios';

export default {
	namespaced: true,
	state: {
		staff: [],
		person: [],
		count: 0
	},
	getters: {
		getStaff: state => state.staff,
		getCount: state => state.staff.length
	},
	mutations: {
		CLEAR_STAFF(state) {
			state.staff = [];
		},
		SET_STAFF(state, payload) {
			let prevPersonId = 0;
			let postIds = [];
			let posts = [];
			for (let i = 0, len = payload.length; i < len; ++i) {
				if (prevPersonId === payload[i].id || prevPersonId === 0) {
					postIds.push(payload[i].post_id);
					posts.push(payload[i].post);
					payload[i].post_id = null;
				} else {
					payload[i - 1].post_id = postIds;
					payload[i - 1].post = posts;
					postIds = [payload[i].post_id];
					posts = [payload[i].post];
				}

				prevPersonId = payload[i].id;
			}

			state.staff = payload.filter(el => el.post_id !== null);
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
		ADD_PERSON(state, payload) {

			state.staff.push({
				id: payload.id,
				person: `${payload.family} ${payload.name} ${payload.patronymic}`,
				post: payload.posts
			});
		},
		UPDATE_STAFF(state, payload) {
			const i = state.staff.map(el => el.id.toInteger()).indexOf(payload.id.toInteger());
			state.staff[i] = payload;
		},
		DELETE_STAFF(state, payload) {
			state.staff = state.staff.filter(el => el.id !== payload);
		}
	},
	actions: {
		async loadStaff({commit}) {
			commit('CLEAR_STAFF');

			await axios
			.get('http://pilot136-yii2-vue-api/v1/staff/list')
			.then(response => {
				commit('SET_STAFF', response.data);
			});
		},
		async createStaff({commit, dispatch}, staff) {
			const formData = new FormData();
			formData.set('family', staff.family);
			formData.set('name', staff.name);
			formData.set('patronymic', staff.patronymic);
			formData.set('posts', staff.posts);
			await axios
			.post('http://pilot136-yii2-vue-api/v1/staff/add', formData)
			.then(response => {
				if (response === '') {
					commit('ADD_PERSON', staff);
					commit('SORT_STAFF');
					dispatch('common/setInfo', {
						type: 'success',
						message: `Сотрудник '${staff.family} ${staff.name} ${staff.patronymic}' добавлен в штат`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response
					}, {root: true});
				}
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
			.post(`http://pilot136-yii2-vue-api/v1/requisite/${requisite.id}`, formData)
			.then(response => {
				commit('UPDATE_REQUISITE', response.data);
				commit('SORT_REQUISITES');

				dispatch('common/setInfo', {
					type: 'success',
					message: `Реквизит ${response.data.requisite} обновлен`
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
			.delete(`http://pilot136-yii2-vue-api/v1/requisite/${id}`)
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