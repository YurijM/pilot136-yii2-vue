import axios from 'axios';

export default {
	namespaced: true,
	state: {
		posts: []
	},
	getters: {
		getPosts: state => state.posts,
	},
	mutations: {
		CLEAR_POSTS(state) {
			state.posts = [];
		},
		SET_POSTS(state, payload) {
			state.posts = payload;
		}
	},
	actions: {
		async loadPosts({commit}) {
			commit('CLEAR_POSTS');

			await axios
			.get('http://pilot136-yii2-vue-api/v1/post/list')
			.then(response => {
				commit('SET_POSTS', response.data.posts);
			});
		},
	}
};