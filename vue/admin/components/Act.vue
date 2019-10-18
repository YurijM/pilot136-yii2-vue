<template>
	<b-container>
		<ym-page-header :title="head" :count="count" link="Добавить акт" @onAddNewDoc="addAct"/>
	</b-container>
</template>

<script>
	import YmPageHeader from './PageHeader'

	export default {
		name: 'act',
		components: {
			YmPageHeader
		},
		data() {
			return {
				head: 'Акты',
				count: 4
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