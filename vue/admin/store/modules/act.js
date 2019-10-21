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
			commit('CLEAR_USERS');
		},
		async loadActs({commit, dispatch}) {
			dispatch('clearActs');

			/*await axios
			.get('http://pilot136-yii2-vue-api/v1/act')
			.then(response => commit('SET_USERS', response.data));*/
		}
	}
};