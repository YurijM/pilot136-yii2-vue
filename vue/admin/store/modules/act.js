import axios from 'axios';

export default {
	namespaced: true,
	state: {
		acts: [],
		act: null
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
		},
		SORT_ACTS(state) {
			state.acts.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
				const year1 = a.year;
				const year2 = b.year;
				const title1 = a.title.toUpperCase();
				const title2 = b.title.toUpperCase();

				let result = 0;
				if (year1 < year2) {
					result = 1;
				} else if (year1 > year2) {
					result = -1;
				} else {
					if (title1 > title2) {
						result = 1;
					} else {
						result = -1;
					}
				}
				return result;
			});
		},
		ADD_ACT(state, payload) {
			state.acts.push(payload);
		},
		UPDATE_ACT(state, payload) {
			const i = state.acts.map(el => parseInt(el.id)).indexOf(payload.id);
			state.acts[i] = payload;
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
				commit('SORT_ACTS');
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
				if (response.data.result === '') {
					dispatch('common/setInfo', {
						type: 'success',
						message: `Акт '${act.title}' (файл '${response.data.act.file}') сохранён`
					}, {root: true});
					commit('ADD_ACT', response.data.act);
					commit('SORT_ACTS');
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Create Act Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении акта (см. в консоли "Create Act Error")'
				}, {root: true});
			});
		},
		async updateAct({commit, dispatch}, act) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('id', act.id);
			formData.set('title', act.title);
			formData.set('file', act.file);
			await axios
			.post('http://pilot136-yii2-vue-api/v1/act/edit', formData)
			.then(response => {
				if (response.data.result === '') {
					commit('UPDATE_ACT', act);
					commit('SORT_ACTS');

					dispatch('common/setInfo', {
						type: 'success',
						message: `Аст '${act.title}' обновлен`
					}, {root: true});
				} else {
					dispatch('common/setInfo', {
						type: 'danger',
						message: response.data.result
					}, {root: true});
				}
			})
			.catch(error => {
				console.log('Update Act Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении акта (см. в консоли "Update Act Error")'
				}, {root: true});
			});
		},
		async deleteFileAct({commit, dispatch}, fileName) {
			const formData = new FormData();
			formData.set('_method', 'DELETE');
			formData.set('fileName', fileName);
			await axios
			.post('http://pilot136-yii2-vue-api/v1/act/deletefile', formData)
			.then(response => {
				/*dispatch('clearActs');
				commit('SET_ACTS', response.data.acts);
				commit('SORT_ACTS');*/
			});
		}
	}
};