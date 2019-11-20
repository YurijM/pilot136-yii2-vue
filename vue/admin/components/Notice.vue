<template>
	<div>
		<h3>Объявления</h3>
		<b-form-textarea
			id="inputNotice"
			v-model="content"
			rows="5"
			required
		></b-form-textarea>
		<markdown-it-vue class="mt-5" :content="content"/>
	</div>
</template>

<script>
	import MarkdownItVue from 'markdown-it-vue'
	import 'markdown-it-vue/dist/markdown-it-vue.css'

	export default {
		name: 'Notice',
		components: {
			MarkdownItVue
		},
		data() {
			return {
				content: ''
			}
		}
	}
</script>

<style scoped>

</style>