<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="reports.length"
			link="Добавить документ"
			@onAddNewDoc="addReport"
		/>

		<b-modal
			id="reportEdit"
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
					style="width: 12em"
					:state="stateDate"
					label="Дата"
					label-for="inputDate"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Укажите дату"
				>
					<b-form-input
						id="inputDate"
						v-model="report.date"
						type="date"
						:state="stateDate"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					:state="stateTitle"
					label="Название документа"
					label-for="inputTitle"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Введите название документа"
				>
          <b-form-textarea
              id="inputTitle"
              v-model="report.title"
              :state="stateTitle"
              rows="2"
          ></b-form-textarea>

<!--          <b-form-input
						id="inputTitle"
						v-model="report.title"
						:state="stateTitle"
						required
					></b-form-input>-->
				</b-form-group>

				<ym-file-input
					:isEdit="report.id !== null"
					:doc="report"
					:stateFile="stateFile"
					:accept="accept"
				/>
			</form>
		</b-modal>

		<b-alert
			v-if="reports.length === 0"
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
					v-if="reports.length > perPage"
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
					:items="reports"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template v-slot:cell(recNo)="data">
						{{data.index + 1 + (currentPage - 1) * perPage}}
					</template>

					<template v-slot:cell(edit)="data">
						<b-button @click="editReport(data.item, $event.target)" variant="outline-primary">
							<font-awesome-icon icon="pencil-alt"/>
						</b-button>
						<b-button @click="deleteReport(data.item)" variant="outline-danger">
							<font-awesome-icon icon="trash-alt"/>
						</b-button>
					</template>
				</b-table>
			</div>

			<b-pagination
				v-if="reports.length > perPage"
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
		name: 'Report',
		components: {
			YmPageHeader,
			YmFileInput
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Разное',
				report: {
					id: null,
					title: '',
					date: this.dateToString(new Date()),
					fileName: '',
					file: null
				},
				stateTitle: null,
				stateDate: null,
				stateFile: null,
				modalTitle: '',
				okTitle: '',
				perPage: this.appConfig.perPage,
				currentPage: 1,
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
						key: 'date',
						label: 'Дата',
						thClass: ['p-1', 'text-center', 'align-middle'],
						thStyle: {width: '5em'},
						tdClass: ['p-1', 'text-center'],
						formatter: value => {
							return (new Date(value)).toLocaleDateString();
						}
					},
					{
						key: 'title',
						label: 'Документ',
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1'],
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
		computed: {
			...mapGetters('report', [
				'getReports'
			]),
			reports() {
				return this.getReports;
			},
			docRows() {
				return this.reports.length
			},
		},
		methods: {
			...mapActions('report', [
				'createReport',
				'updateReport',
			]),
			...mapActions('report', {
				removeDoc: 'deleteReport'
			}),
			dateToString(date) {
				let dd = date.getDate();
				let mm = date.getMonth() + 1;
				const yyyy = date.getFullYear();

				dd = (dd < 10 ? '0' + dd : dd);
				mm = (mm < 10 ? '0' + mm : mm);

				return yyyy + '-' + mm + '-' + dd;
			},
			addReport() {
				this.modalTitle = 'Добавить документ';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('reportEdit');
			},
			editReport(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.report.id = item.id;
				this.report.title = item.title;
				this.report.date = this.dateToString(new Date(item.date));
				this.report.fileName = item.file;
				this.$root.$emit('bv::show::modal', 'reportEdit', button)
			},
			deleteReport(item) {
				this.deleteDoc(this, item, {
					type: 'Report',
					name: 'документ от',
					title: new Date(item.date).toLocaleDateString()
				});
			},
			checkFormValidity() {
				this.stateTitle = this.$refs.form.inputTitle.checkValidity();
				this.stateDate = this.$refs.form.inputDate.checkValidity();
				this.stateFile = (this.report.id ? true : Boolean(this.report.file));

				return (this.stateTitle && this.stateDate && this.stateFile);
			},
			resetModal() {
				this.report.id = null;
				this.report.title = '';
				this.report.date = this.dateToString(new Date());
				this.report.fileName = '';
				this.report.file = null;

				this.stateTitle = null;
				this.stateDate = null;
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
					if (!this.report.id) {
						await this.createReport(this.report);
					} else {
						await this.updateReport(this.report);
					}
				} catch (e) {
					console.log('Ошибка try report: ', e)
				}

				// Hide the modal manually
				this.$nextTick(() => {
					this.$refs.modal.hide()
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	input[type="date"].form-control {
		line-height: normal;
	}
</style>