<template>
	<b-container>
		<ym-page-header :title="title" :count="count" link="Добавить акт" @onAddNewDoc="addAct"/>

		<b-alert v-if="count = 0" class="text-center" show variant="info">Актов нет</b-alert>

		<div v-else></div>
	</b-container>
</template>

<script>
	import YmPageHeader from './PageHeader'

	export default {
		name: 'Act',
		components: {
			YmPageHeader
		},
		data() {
			return {
				title: 'Акты',
				count: 0
			}
		},
		methods: {
			addAct() {

			}
		}
	}
</script>

<style scoped>

</style>