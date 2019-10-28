import axios from 'axios';
import common from './common';

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
		},
		ADD_POST(state, payload) {
			state.posts.push({
				id: payload.id,
				post: payload.post,
				order_no: payload.order_no
			});
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
		async createPost({commit, dispatch}, post) {
			const formData = new FormData();
			formData.set('post', post.post);
			formData.set('order_no', post.order_no);
			await axios
			.post('http://pilot136-yii2-vue-api/v1/post/create', formData)
			.then(response => {
				commit('ADD_POST', response.data);
				dispatch('common/setInfo', {
					type: 'success',
					message: `Должность '${response.data.post}' добавлена`
				}, {root: true});
			})
			.catch(error => {
				console.log('Create Post Error ', error);
			});
		}
	}
};