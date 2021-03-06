import axios from 'axios';

import {config} from '../../config';
axios.defaults.baseURL = config.apiUrl;

export default {
	namespaced: true,
	state: {
		posts: [],
		post: null,
		staffByPost: null
	},
	getters: {
		getPosts: state => state.posts,
		getStaffByPost: state => state.staffByPost
	},
	mutations: {
		CLEAR_POSTS(state) {
			state.posts = [];
		},
		SET_POSTS(state, payload) {
			state.posts = payload;
		},
		SET_STAFF_BY_POST(state, payload) {
			state.staffByPost = payload;
		},
		SORT_POSTS(state) {
			state.posts.sort((a, b) => {
				// Используем toUpperCase() для преобразования регистра
				const item1 = a.post.toUpperCase();
				const item2 = b.post.toUpperCase();

				let result = 0;
				if (item1 > item2) {
					result = 1;
				} else if (item1 < item2) {
					result = -1;
				}
				return result;
			});
		},
		GET_POST(state, payload) {
			state.post = null;
			state.post = state.posts.filter(post => post.id === payload)[0];
		},
		ADD_POST(state, payload) {
			state.posts.push({
				id: payload.id,
				post: payload.post,
				order_no: payload.order_no
			});
		},
		UPDATE_POST(state, payload) {
			const i = state.posts.map(el => parseInt(el.id)).indexOf(payload.id);
			state.posts[i] = payload;
		},
		DELETE_POST(state, payload) {
			state.posts = state.posts.filter(post => post.id !== payload);
		}
	},
	actions: {
		async loadPosts({commit}) {
			commit('CLEAR_POSTS');

			await axios
			.get('post/list')
			.then(response => {
				commit('SET_POSTS', response.data.posts);
			});
		},
		async createPost({commit, dispatch}, post) {
			const formData = new FormData();
			formData.set('post', post.post);
			formData.set('order_no', post.order_no);
			await axios
			.post('post', formData)
			.then(response => {
				commit('ADD_POST', response.data);
				commit('SORT_POSTS');
				dispatch('common/setInfo', {
					type: 'success',
					message: `Должность '${response.data.post}' добавлена`
				}, {root: true});
			})
			.catch(error => {
				console.log('Create Post Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при добавлении должности (см. в консоли "Create Post Error")'
				}, {root: true});
			});
		},
		async getStaffByPost({commit}, id) {
			await axios
			.get('post/staff-by-post')//, {params: {id: id}})
			.then(response => {
				commit('SET_STAFF_BY_POST', response.data);
			});
		},
		async updatePost({commit, dispatch}, post) {
			const formData = new FormData();
			formData.set('_method', 'PUT');
			formData.set('post', post.post);
			formData.set('order_no', post.order_no);
			await axios
			.post(`post/${post.id}`, formData)
			.then(response => {
				commit('UPDATE_POST', response.data);
				commit('SORT_POSTS');

				dispatch('common/setInfo', {
					type: 'success',
					message: `Должность '${response.data.post}' обновлена`
				}, {root: true});
			})
			.catch(error => {
				console.log('Update Post Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при изменении должности (см. в консоли "Update Post Error")'
				}, {root: true});
			});
		},
		async deletePost({state, commit, dispatch}, id) {
			await axios
			.delete(`post/${id}`)
			.then(response => {
				commit('GET_POST', id);
				commit('DELETE_POST', id);
				dispatch('common/setInfo', {
					type: 'success',
					message: `Должность '${state.post.post}' удалена`
				}, {root: true});
			})
			.catch(error => {
				console.log('Delete Post Error ', error);
				dispatch('common/setInfo', {
					type: 'danger',
					message: 'Ошибка при удалении должности (см. в консоли "Delete Post Error")'
				}, {root: true});
			});
		}
	}
};