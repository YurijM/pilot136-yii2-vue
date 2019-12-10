<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="certificates.length"
			link="Добавить документ"
			@onAddNewDoc="addCertificate"
		/>

		<b-modal
			id="certificateEdit"
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
						v-model="certificate.title"
						:state="stateTitle"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<ym-file-input
					:isEdit="certificate.id !== null"
					:doc="certificate"
					:stateFile="stateFile"
					:accept="accept"
				/>
			</form>
		</b-modal>

		<b-alert
			v-if="certificates.length === 0"
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
					v-if="certificates.length > perPage"
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
					:items="certificates"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template v-slot:cell(recNo)="data">
						{{data.index + 1 + (currentPage - 1) * perPage}}
					</template>

					<template v-slot:cell(edit)="data">
						<b-button @click="editCertificate(data.item, $event.target)" variant="outline-primary">
							<font-awesome-icon icon="pencil-alt"/>
						</b-button>
						<b-button @click="deleteCertificate(data.item)" variant="outline-danger">
							<font-awesome-icon icon="trash-alt"/>
						</b-button>
					</template>
				</b-table>
			</div>

			<b-pagination
				v-if="certificates.length > perPage"
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
		name: 'Certificate',
		components: {
			YmPageHeader,
			YmFileInput
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Свидетельства и паспорта',
				certificate: {
					id: null,
					title: '',
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
			...mapGetters('certificate', [
				'getCertificates'
			]),
			certificates() {
				return this.getCertificates;
			},
			docRows() {
				return this.certificates.length
			},
		},
		methods: {
			...mapActions('certificate', [
				'createCertificate',
				'updateCertificate',
			]),
			...mapActions('certificate', {
				removeDoc: 'deleteCertificate'
			}),
			addCertificate() {
				this.modalTitle = 'Добавить документ';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('certificateEdit');
			},
			editCertificate(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.certificate.id = item.id;
				this.certificate.title = item.title;
				this.certificate.fileName = item.file;
				this.$root.$emit('bv::show::modal', 'certificateEdit', button)
			},
			deleteCertificate(item) {
				this.deleteDoc(this, item, {
					type: 'Certificate',
					name: 'документ',
					title: item.title
				});
			},
			checkFormValidity() {
				this.stateTitle = this.$refs.form.inputTitle.checkValidity();
				this.stateFile = (this.certificate.id ? true : Boolean(this.certificate.file));

				return (this.stateTitle && this.stateFile);
			},
			resetModal() {
				this.certificate.id = null;
				this.certificate.title = '';
				this.certificate.fileName = '';
				this.certificate.file = null;

				this.stateTitle = null;
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
					if (!this.certificate.id) {
						await this.createCertificate(this.certificate);
					} else {
						await this.updateCertificate(this.certificate);
					}
				} catch (e) {
					console.log('Ошибка try certificate: ', e)
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