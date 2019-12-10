<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="finances.length"
			link="Добавить документ"
			@onAddNewDoc="addFinance"
		/>

		<b-modal
			id="financeEdit"
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
					label="Название документа"
					label-for="inputTitle"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Введите название документа"
				>
					<b-form-input
						id="inputTitle"
						v-model="finance.title"
						:state="stateTitle"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					:state="statePeriod"
					label="Отчётный период"
					label-for="inputPeriod"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Если указан отчётный год, то надо указать и период"
				>
					<b-form-select
						id="inputPeriod"
						:state="statePeriod"
						v-model="finance.period"
						:options="periods"
					/>
				</b-form-group>

				<b-form-group
					label="Год составления документа"
					label-for="inputYear"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Год должен быть указан"
				>
					<b-form-select
						id="inputYear"
						v-model="finance.year"
						:state="stateYear"
						:options="years"
					/>
				</b-form-group>

				<ym-file-input
					:isEdit="finance.id !== null"
					:doc="finance"
					:stateFile="stateFile"
					:accept="accept"
				/>
			</form>
		</b-modal>

		<b-alert
			v-if="finances.length === 0"
			class="text-center"
			show
			variant="info"
		>
			Документы не заведены
		</b-alert>

		<div
			v-else
			class="d-flex flex-column justify-content-between mt-3 mx-2"
			:style="{minHeight: '80vh'}"
		>
			<div>
				<b-pagination
					v-if="finances.length > perPage"
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
					:items="finances"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template v-slot:cell(recNo)="data">
						{{data.index + 1 + (currentPage - 1) * perPage}}
					</template>

					<template v-slot:cell(edit)="data">
						<b-button @click="editFinance(data.item, $event.target)" variant="outline-primary">
							<font-awesome-icon icon="pencil-alt"/>
						</b-button>
						<b-button @click="deleteFinance(data.item)" variant="outline-danger">
							<font-awesome-icon icon="trash-alt"/>
						</b-button>
					</template>
				</b-table>
			</div>

			<b-pagination
				v-if="finances.length > perPage"
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

	export default {
		name: 'Finance',
		components: {
			YmPageHeader,
			YmFileInput
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Финансы',
				finance: {
					id: null,
					title: '',
					period: this.appConfig.periodNone,
					year: this.appConfig.yearNone,
					fileName: '',
					file: null
				},
				stateTitle: null,
				statePeriod: null,
				stateYear: null,
				stateFile: null,
				modalTitle: '',
				okTitle: '',
				perPage: this.appConfig.perPage,
				currentPage: 1,
				periods: [],
				years: [],
				accept: [...this.appConfig.mimetypePdf, ...this.appConfig.extPdf].join(','),
				fields: [
					{
						key: 'recNo',
						label: '№',
						thClass: ['p-1', 'text-center', 'align-middle'],
						thStyle: {width: '2em'},
						tdClass: ['p-1', 'text-center'],
					},
					{
						key: 'title',
						label: 'Договор',
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1'],
					},
					{
						key: 'period',
						label: 'Период',
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1', 'text-center'],
						formatter: value => {
							if (value === this.appConfig.periodNone) return '';

							const item = this.periods.find(period => period.value === parseFloat(value));

							return (item ? item.text : '')
						}
					},
					{
						key: 'year',
						label: 'Год',
						thClass: ['p-1', 'text-center', 'align-middle'],
						thStyle: {width: '4em'},
						tdClass: ['p-1', 'text-center'],
					},
					{
						key: 'file',
						label: 'Файл',
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1', 'text-center'],
					},
					{
						key: 'edit',
						label: '',
						thStyle: {width: '6em'},
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1', 'text-right']
					}
				],
			}
		},
		created() {
			this.periods = [
				{value: this.appConfig.periodNone, text: 'Укажите период'},
				{value: 1, text: '1-й квартал'},
				{value: 2, text: '2-й квартал'},
				{value: 2.5, text: '1-ое полугодие'},
				{value: 3, text: '3-й квартал'},
				{value: 4, text: '4-й квартал'},
				{value: 5, text: 'год'},
			];

			this.years.push({value: this.appConfig.yearNone, text: 'Укажите год'});

			for (let year = this.appConfig.startYear; year <= this.appConfig.endYear; year++) {
				this.years.push({value: year, text: '' + year})
			}
		},
		computed: {
			...mapGetters('finance', [
				'getFinances'
			]),
			finances() {
				return this.getFinances;
			},
			docRows() {
				return this.finances.length
			},
		},
		methods: {
			...mapActions('finance', [
				'createFinance',
				'updateFinance',
			]),
			...mapActions('finance', {
				removeDoc: 'deleteFinance'
			}),
			addFinance() {
				this.modalTitle = 'Добавить документ';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('financeEdit');
			},
			editFinance(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.finance.id = item.id;
				this.finance.title = item.title;
				this.finance.period = item.period;
				this.finance.year = item.year;
				this.finance.fileName = item.file;
				this.$root.$emit('bv::show::modal', 'financeEdit', button)
			},
			deleteFinance(item) {
				this.deleteDoc(this, item, {
					type: 'Finance',
					name: 'документ',
					title: item.title
				});
			},
			checkFormValidity() {
				this.stateTitle = this.$refs.form.inputTitle.checkValidity();
				this.statePeriod = (this.$refs.form.inputPeriod.value !== this.appConfig.periodNone);
				this.stateYear = (this.$refs.form.inputYear.value !== this.appConfig.yearNone);
				this.stateFile = (this.finance.id ? true : Boolean(this.finance.file));

				return (this.stateTitle && this.statePeriod && this.stateYear && this.stateFile);
			},
			resetModal() {
				this.finance.id = null;
				this.finance.title = '';
				this.finance.period = this.appConfig.periodNone;
				this.finance.year = this.appConfig.yearNone;
				this.finance.fileName = '';
				this.finance.file = null;

				this.stateTitle = null;
				this.statePeriod = null;
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
					if (!this.finance.id) {
						await this.createFinance(this.finance);
					} else {
						await this.updateFinance(this.finance);
					}
				} catch (e) {
					console.log('Ошибка try finance: ', e)
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