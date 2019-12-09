<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="contracts.length"
			link="Добавить договор"
			@onAddNewDoc="addContract"
		/>

		<b-modal
			id="contractEdit"
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
					label="Название договора"
					label-for="inputTitle"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Введите название договора"
				>
					<b-form-input
						id="inputTitle"
						v-model="contract.title"
						:state="stateTitle"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					label="Год составления договора"
					label-for="inputYear"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Год должен быть указан"
				>
					<b-form-select
						id="inputYear"
						v-model="contract.year"
						:state="stateYear"
						:options="years"
					/>
				</b-form-group>

				<ym-file-input
					:isEdit="contract.id !== null"
					:doc="contract"
					:stateFile="stateFile"
					:accept="accept"
				/>
			</form>
		</b-modal>

		<b-alert
			v-if="contracts.length === 0"
			class="text-center"
			show
			variant="info"
		>
			Договоры не заведены
		</b-alert>

		<div
			v-else
			class="d-flex flex-column justify-content-between mt-3 mx-2"
			:style="{minHeight: '80vh'}"
		>
			<div>
				<b-pagination
					v-if="contracts.length > perPage"
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
					:items="contracts"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template v-slot:cell(recNo)="data">
						{{data.index + 1 + (currentPage - 1) * perPage}}
					</template>

					<template v-slot:cell(edit)="data">
						<b-button @click="editContract(data.item, $event.target)" variant="outline-primary">
							<font-awesome-icon icon="pencil-alt"/>
						</b-button>
						<b-button @click="deleteContract(data.item)" variant="outline-danger">
							<font-awesome-icon icon="trash-alt"/>
						</b-button>
					</template>
				</b-table>
			</div>

			<b-pagination
				v-if="contracts.length > perPage"
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
		name: 'Contract',
		components: {
			YmPageHeader,
			YmFileInput
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Договоры',
				contract: {
					id: null,
					title: '',
					year: this.appConfig.yearNone,
					fileName: '',
					file: null
				},
				stateTitle: null,
				stateYear: null,
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
			this.years.push({value: this.appConfig.yearNone, text: 'Укажите год'});

			for (let year = this.appConfig.startYear; year <= this.appConfig.endYear; year++) {
				this.years.push({value: year, text: '' + year})
			}
		},
		computed: {
			...mapGetters('contract', [
				'getContracts'
			]),
			contracts() {
				return this.getContracts;
			},
			docRows() {
				return this.contracts.length
			},
		},
		methods: {
			...mapActions('contract', [
				'createContract',
				'updateContract',
			]),
			...mapActions('contract', {
				removeDoc: 'deleteContract'
			}),
			addContract() {
				this.modalTitle = 'Добавить договор';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('contractEdit');
			},
			editContract(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.contract.id = item.id;
				this.contract.title = item.title;
				this.contract.year = item.year;
				this.contract.fileName = item.file;
				this.$root.$emit('bv::show::modal', 'contractEdit', button)
			},
			deleteContract(item) {
				this.deleteDoc(this, item, {
					type: 'Contract',
					name: 'договор',
					title: item.title
				});
			},
			checkFormValidity() {
				this.stateTitle = this.$refs.form.inputTitle.checkValidity();
				this.stateYear = (this.$refs.form.inputYear.value !== this.appConfig.yearNone);
				this.stateFile = (this.contract.id ? true : Boolean(this.contract.file));

				return (this.stateTitle && this.stateYear && this.stateFile);
			},
			resetModal() {
				this.contract.id = null;
				this.contract.title = '';
				this.contract.year = this.appConfig.yearNone;
				this.contract.fileName = '';
				this.contract.file = null;

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
					if (!this.contract.id) {
						await this.createContract(this.contract);
					} else {
						await this.updateContract(this.contract);
					}
				} catch (e) {
					console.log('Ошибка try contract: ', e)
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