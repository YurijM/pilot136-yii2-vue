<template>
	<b-container>
		<ul>
			<li v-for="act in acts">
				{{act.id}}
			</li>
		</ul>
	</b-container>
</template>

<script>
	import {mapGetters} from 'vuex'
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
		computed: {
			...mapGetters('act', [
				'getActs'
			]),
			acts() {
				return this.getActs;
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