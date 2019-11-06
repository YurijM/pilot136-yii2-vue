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
			.get('http://pilot136-yii2-vue-api/v1/act')
			.then(response => {
				dispatch('clearActs');
				commit('SET_ACTS', response.data);

			});
		},
	}
};