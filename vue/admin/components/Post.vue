<template>
	<b-container>
		<ym-page-header :title="title" :count="posts.length" link="Добавить должность" @onAddNewDoc="addPost"/>

		<b-alert v-if="posts.length === 0" class="text-center" show variant="info">Должности не заведены</b-alert>

		<div v-else></div>
	</b-container>
</template>

<script>
	import YmPageHeader from './PageHeader'
	import {mapGetters} from 'vuex'

	export default {
		name: 'Post',
		components: {
			YmPageHeader
		},
		data() {
			return {
				title: 'Должности'
			}
		},
		computed: {
			...mapGetters('post', [
				'getPosts'
			]),
			posts() {
				return this.getPosts;
			}
		},
		methods: {
			addPost() {

			}
		}
	}
</script>

<style scoped>

</style>