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
					invalid-feedback="Год должен быть указан"
				>
					<b-form-select
						id="inputYear"
						v-model="act.year"
						:state="stateYear"
						:options="years"
					/>
				</b-form-group>

				<ym-file-input
					:isEdit="act.id !== null"
					:doc="act"
					:stateFile="stateFile"
					:accept="accept"
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
						<b-button @click="editAct(data.item, $event.target)" variant="outline-primary">
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
	import {mapGetters, mapActions} from 'vuex'
	import YmPageHeader from './PageHeader'
	import YmFileInput from './FileInput'

	const {PER_PAGE, START_YEAR, END_YEAR, YEAR_NONE, MIMETYPE_PDF, EXT_PDF} = require('../../constants');

	export default {
		name: 'Act',
		components: {
			YmPageHeader,
			YmFileInput
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Акты',
				act: {
					id: null,
					title: '',
					year: YEAR_NONE,
					fileName: '',
					file: null
				},
				stateTitle: null,
				stateYear: null,
				stateFile: null,
				modalTitle: '',
				okTitle: '',
				perPage: PER_PAGE,
				currentPage: 1,
				years: [],
				accept: [...MIMETYPE_PDF, ...EXT_PDF].join(','),
				fields: [
					{
						key: 'recNo',
						label: '№',
						thClass: ['p-1', 'text-center', 'align-middle'],
						thStyle: {width: '2em'},
						tdClass: ['p-1', 'text-center', 'table-rec-no'],
					},
					{
						key: 'title',
						label: 'Акт',
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1'],
					},
					{
						key: 'year',
						label: 'Год',
						thClass: ['p-1', 'text-center', 'align-middle'],
						thStyle: {width: '4em'},
						tdClass: ['p-1', 'text-center'],
						/*formatter: value => {
							return (value === YEAR_NONE ? '' : value)
						}*/
					},
					{
						key: 'file',
						label: 'Файл',
						thClass: ['p-1', 'text-center', 'align-middle'],
						//thStyle: {width: '10em'},
						tdClass: ['p-1', 'text-center'],
					},
					{
						key: 'edit',
						label: '',
						thStyle: {width: '6em'},
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1', 'text-right', 'table-edit-button']
					}
				],
			}
		},
		created() {
			this.years.push({value: YEAR_NONE, text: 'Укажите год'});

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
			...mapActions('act', [
				'createAct',
				'updateAct',
			]),
			...mapActions('act', {
				removeDoc: 'deleteAct'
			}),
			addAct() {
				this.modalTitle = 'Добавить акт';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('actEdit');
			},
			editAct(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.act.id = item.id;
				this.act.title = item.title;
				this.act.year = item.year;
				this.act.fileName = item.file;
				this.$root.$emit('bv::show::modal', 'actEdit', button)
			},
			deleteAct(item) {
				this.deleteDoc(this, item, {
					type: 'Act',
					name: 'акт',
					title: item.title
				});
			},
			checkFormValidity() {
				this.stateTitle = this.$refs.form.inputTitle.checkValidity();
				this.stateYear = (this.$refs.form.inputYear.value !== YEAR_NONE);
				this.stateFile = (this.act.id ? true : Boolean(this.act.file));

				return (this.stateTitle && this.stateYear && this.stateFile);
			},
			resetModal() {
				this.act.id = null;
				this.act.title = '';
				this.act.year = YEAR_NONE;
				this.act.fileName = '';
				this.act.file = null;

				this.stateTitle = null;
				this.stateYear = null;
				this.stateFile = null;
			},
			handleOk(bvModalEvt) {
				// Prevent modal from closing
				bvModalEvt.preventDefault();
				// Trigger submit handler
				this.handleSubmit()
			},
			async handleSubmit() {
				if (!this.checkFormValidity()) {
					return
				}

				try {
					if (!this.act.id) {
						await this.createAct(this.act);
					} else {
						await this.updateAct(this.act);
					}
				} catch (e) {
					console.log('Ошибка try act: ', e)
				}

				// Hide the modal manually
				this.$nextTick(() => {
					this.$refs.modal.hide()
				})
			}
		}
	}
</script>

<style scoped>

</style>