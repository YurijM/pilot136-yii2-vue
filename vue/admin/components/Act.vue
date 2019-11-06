<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="acts.length"
			link="Добавить акт"
			@onAddNewDoc="addAct"
		/>

		<b-modal
			id="actEdit"
			:header-class="['alert-primary', 'border-primary', 'border-bottom']"
			modal-class="in"
			:footer-class="['alert-primary', 'border-primary', 'border-top']"
			ref="modal"
			:title="modalTitle"
			hide-header-close
			ok-variant="primary"
			:ok-title="okTitle"
			cancel-variant="outline-dark"
			cancel-title="Отменить"
			@hidden="resetModal"
			@ok="handleOk"
		>
			<form ref="form" @submit.stop.prevent="handleSubmit">
				<b-form-group
					:state="stateTitle"
					label="Название акта"
					label-for="inputTitle"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Введите название акта"
				>
					<b-form-input
						id="inputTitle"
						v-model="act.title"
						:state="stateTitle"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					label="Год составления акта"
					label-for="inputYear"
					label-size="sm"
					label-class="font-weight-bold"
				>
					<b-form-select
						id="inputYear"
						v-model="act.year"
						:options="years"
					/>
				</b-form-group>

				<ym-file-input
					:isEdit="(act.id !== null && act.fileName !== '')"
					typeDoc="Акт (pdf-файл)"
					:doc="act"
					:stateFile="stateFile"
					:accept="accept"
					@onDeleteOldFile="deleteFile"
				/>
			</form>
		</b-modal>

		<b-alert
			v-if="acts.length === 0"
			class="text-center"
			show
			variant="info"
		>
			Акты не заведены
		</b-alert>

		<div
			v-else
			class="d-flex flex-column justify-content-between mt-3 mx-2"
			:style="{minHeight: '80vh'}"
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
					<template v-slot:cell(recNo)="data">
						{{data.index + 1 + (currentPage - 1) * perPage}}
					</template>

					<template v-slot:cell(edit)="data">
						<b-button @click="updateAct(data.item, $event.target)" variant="outline-primary">
							<font-awesome-icon icon="pencil-alt"/>
						</b-button>
						<b-button @click="deleteAct(data.item)" variant="outline-danger">
							<font-awesome-icon icon="trash-alt"/>
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
	import YmFileInput from './FileInput'

	const {PER_PAGE, START_YEAR, END_YEAR, YEAR_NONE, MIMETYPE_PDF, EXT_PDF} = require('../../constants');

	export default {
		name: 'Act',
		components: {
			YmPageHeader,
			YmFileInput
		},
		data() {
			return {
				title: 'Акты',
				act: {
					id: null,
					title: '',
					year: YEAR_NONE,
					fileName: '',
					oldFile: '',
					file: null
				},
				stateTitle: null,
				stateFile: null,
				modalTitle: '',
				okTitle: '',
				perPage: PER_PAGE,
				currentPage: 1,
				years: [],
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
		created() {
			this.years.push({value: YEAR_NONE, text: 'Без указания года'});

			for (let year = START_YEAR; year <= END_YEAR; year++) {
				this.years.push({value: year, text: '' + year})
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
				this.modalTitle = 'Добавить акт';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('actEdit');
			},
		}
	}
</script>

<style scoped>

</style>