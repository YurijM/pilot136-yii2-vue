<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="overhauls.length"
			link="Добавить документ"
			@onAddNewDoc="addOverhaul"
		/>

		<b-modal
			id="overhaulEdit"
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
						v-model="overhaul.title"
						:state="stateTitle"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					:state="stateMonth"
					label="Отчётный месяц"
					label-for="inputMonth"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Если указан отчётный год, то надо указать и месяц"
				>
					<b-form-select
						id="inputMonth"
						:state="stateMonth"
						v-model="overhaul.month"
						:options="months"
					/>
				</b-form-group>

				<b-form-group
					label="Отчётный год"
					label-for="inputYear"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Год должен быть указан"
				>
					<b-form-select
						id="inputYear"
						v-model="overhaul.year"
						:state="stateYear"
						:options="years"
					/>
				</b-form-group>

				<ym-file-input
					:isEdit="overhaul.id !== null"
					:doc="overhaul"
					:stateFile="stateFile"
					:accept="accept"
				/>
			</form>
		</b-modal>

		<b-alert
			v-if="overhauls.length === 0"
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
					v-if="overhauls.length > perPage"
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
					:items="overhauls"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template v-slot:cell(recNo)="data">
						{{data.index + 1 + (currentPage - 1) * perPage}}
					</template>

					<template v-slot:cell(edit)="data">
						<b-button @click="editOverhaul(data.item, $event.target)" variant="outline-primary">
							<font-awesome-icon icon="pencil-alt"/>
						</b-button>
						<b-button @click="deleteOverhaul(data.item)" variant="outline-danger">
							<font-awesome-icon icon="trash-alt"/>
						</b-button>
					</template>
				</b-table>
			</div>

			<b-pagination
				v-if="overhauls.length > perPage"
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
		name: 'Overhaul',
		components: {
			YmPageHeader,
			YmFileInput
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Капитальный ремонт',
				overhaul: {
					id: null,
					title: '',
					month: this.appConfig.monthNone,
					year: this.appConfig.yearNone,
					fileName: '',
					file: null
				},
				stateTitle: null,
				stateMonth: null,
				stateYear: null,
				stateFile: null,
				modalTitle: '',
				okTitle: '',
				perPage: this.appConfig.perPage,
				currentPage: 1,
				months: [],
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
						key: 'year',
						label: 'Год',
						thClass: ['p-1', 'text-center', 'align-middle'],
						thStyle: {width: '4em'},
						tdClass: ['p-1', 'text-center'],
					},
					{
						key: 'month',
						label: 'Месяц',
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1', 'text-center'],
						formatter: value => {
							if (value === this.appConfig.monthNone) return '';

							const item = this.months.find(month => month.value === parseFloat(value));

							return (item ? item.text : '')
						}
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
			this.months = [
				{value: this.appConfig.monthNone, text: 'Укажите месяц'},
				{value: 1, text: 'январь'},
				{value: 2, text: 'февраль'},
				{value: 3, text: 'март'},
				{value: 4, text: 'апрель'},
				{value: 5, text: 'май'},
				{value: 6, text: 'июнь'},
				{value: 7, text: 'июль'},
				{value: 8, text: 'август'},
				{value: 9, text: 'сентябрь'},
				{value: 10, text: 'октябрь'},
				{value: 11, text: 'ноябрь'},
				{value: 12, text: 'декабрь'},
			];

			this.years.push({value: this.appConfig.yearNone, text: 'Укажите год'});

			for (let year = this.appConfig.startYear; year <= this.appConfig.endYear; year++) {
				this.years.push({value: year, text: '' + year})
			}
		},
		computed: {
			...mapGetters('overhaul', [
				'getOverhauls'
			]),
			overhauls() {
				return this.getOverhauls;
			},
			docRows() {
				return this.overhauls.length
			},
		},
		methods: {
			...mapActions('overhaul', [
				'createOverhaul',
				'updateOverhaul',
			]),
			...mapActions('overhaul', {
				removeDoc: 'deleteOverhaul'
			}),
			addOverhaul() {
				this.modalTitle = 'Добавить документ';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('overhaulEdit');
			},
			editOverhaul(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.overhaul.id = item.id;
				this.overhaul.title = item.title;
				this.overhaul.month = item.month;
				this.overhaul.year = item.year;
				this.overhaul.fileName = item.file;
				this.$root.$emit('bv::show::modal', 'overhaulEdit', button)
			},
			deleteOverhaul(item) {
				this.deleteDoc(this, item, {
					type: 'Overhaul',
					name: 'документ',
					title: item.title
				});
			},
			checkFormValidity() {
				this.stateTitle = this.$refs.form.inputTitle.checkValidity();
				this.stateMonth = (this.$refs.form.inputMonth.value !== this.appConfig.monthNone);
				this.stateYear = (this.$refs.form.inputYear.value !== this.appConfig.yearNone);
				this.stateFile = (this.overhaul.id ? true : Boolean(this.overhaul.file));

				return (this.stateTitle && this.stateMonth && this.stateYear && this.stateFile);
			},
			resetModal() {
				this.overhaul.id = null;
				this.overhaul.title = '';
				this.overhaul.month = this.appConfig.monthNone;
				this.overhaul.year = this.appConfig.yearNone;
				this.overhaul.fileName = '';
				this.overhaul.file = null;

				this.stateTitle = null;
				this.stateMonth = null;
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
					if (!this.overhaul.id) {
						await this.createOverhaul(this.overhaul);
					} else {
						await this.updateOverhaul(this.overhaul);
					}
				} catch (e) {
					console.log('Ошибка try overhaul: ', e)
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