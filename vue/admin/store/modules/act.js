import axios from 'axios';

export default {
	namespaced: true,
	state: {
		acts: []
	},
	getters: {
		getActs: state => state.acts
	},
	mutations: {
		CLEAR_ACTS(state) {
			state.acts = [];
		},
		SET_ACTS(state, payload) {
			state.acts = payload;
		}
	},
	actions: {
		clearActs({commit}) {
			commit('CLEAR_ACTS');
		},
		async loadActs({commit, dispatch}) {
			await axios
			.get('http://pilot136-yii2-vue-api/v1/act/list')
			.then(response => {
				dispatch('clearActs');
				commit('SET_ACTS', response.data.acts);

			});
		},
		async createAct({commit, dispatch}, act) {
			const formData = new FormData();
			formData.append('title', act.title);
			formData.append('year', act.year);
			formData.append('file', act.file);
			await axios
			.post('http://pilot136-yii2-vue-api/v1/act/add', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			.then(response => {
				if (response.data.result !== '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Акт '${act.title}' (файл '${response.data.act.file}' сохранён`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
				//console.log('response.data: ', response.data);
				/*if (response.data.result === '') {
					commit('ADD_PERSON', {staff: response.data.staff, post: staff.posts, post_id: staff.postIds});
					commit('SORT_STAFF');
					dispatch('common/setInfo', {
						type: 'success',
						message: `Сотрудник '${staff.family} ${staff.name} ${staff.patronymic}' добавлен в штат`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}*/
			})
			.catch(error => {
				console.log('Create Act Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении акта (см. в консоли "Create Act Error")'
				}, {root: true});
			});
		},
		updateAct({commit, dispatch}) {},
	}
};