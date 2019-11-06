<template>
	<b-container>
		<div
			v-if="acts.length > 0"
			class="d-flex flex-column justify-content-between mt-3 mx-2"
			:style="{minHeight: '70vh'}"
		>
			<div>
				<b-pagination
					v-if="acts.length > perPage"
					v-model="currentPage"
					:total-rows="docRows"
					:per-page="perPage"
					aria-controls="table-doc"
					align="center"
				></b-pagination>

				<b-table
					id="table-doc"
					striped
					small
					responsive="sm"
					:fields="fields"
					:items="acts"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template slot="recNo" slot-scope="data">
						{{data.index + ((currentPage - 1) * perPage) + 1}}
					</template>

					<template slot="edit" slot-scope="row">
						<b-button @click="updateAct(row.item, $event.target)" variant="outline-primary">
							<fa icon="pencil-alt"/>
						</b-button>
						<b-button @click="deleteAct(row.item)" variant="outline-danger">
							<fa icon="trash-alt"/>
						</b-button>
					</template>
				</b-table>
			</div>

			<b-pagination
				v-if="acts.length > perPage"
				v-model="currentPage"
				:total-rows="docRows"
				:per-page="perPage"
				aria-controls="table-doc"
				align="center"
			></b-pagination>
		</div>
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
				count: 0,
				perPage: 5,
				currentPage: 1,
				fields: [
					{
						key: 'recNo',
						label: '№',
						thClass: ['text-center', 'align-middle'],
						thStyle: {width: '2em'},
						tdClass: ['px-1', 'text-center', 'table-rec-no'],
					},
					{
						key: 'title',
						label: 'Акт',
						thClass: ['text-center', 'align-middle'],
						tdClass: ['px-1'],
					},
					{
						key: 'year',
						label: 'Год',
						thClass: ['text-center', 'align-middle'],
						thStyle: {width: '4em'},
						tdClass: ['px-1', 'text-center'],
					},
					{
						key: 'file',
						label: 'Файл',
						thClass: ['text-center', 'align-middle'],
						thStyle: {width: '10em'},
						tdClass: ['px-1', 'text-center'],
					},
					{
						key: 'edit',
						label: '',
						thStyle: {width: '6em'},
						thClass: ['text-center', 'align-middle'],
						tdClass: ['px-1', 'text-right', 'table-edit-button']
					}
				],
			}
		},
		computed: {
			...mapGetters('act', [
				'getActs'
			]),
			acts() {
				return this.getActs;
			},
			docRows() {
				return this.acts.length
			},
		},
		methods: {
			addAct() {

			}
		}
	}
</script>

<style scoped>

</style>