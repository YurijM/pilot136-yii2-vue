<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="protocols.length"
			link="Добавить протокол"
			@onAddNewDoc="addProtocol"
		/>

		<b-modal
			id="protocolEdit"
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
						v-model="protocol.date"
						type="date"
						:state="stateDate"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					:state="stateTitle"
					label="Название протокола"
					label-for="inputTitle"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Введите название протокола"
				>
					<b-form-input
						id="inputTitle"
						v-model="protocol.title"
						:state="stateTitle"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<ym-file-input
					:isEdit="protocol.id !== null"
					:doc="protocol"
					:stateFile="stateFile"
					:accept="accept"
				/>
			</form>
		</b-modal>

		<b-alert
			v-if="protocols.length === 0"
			class="text-center"
			show
			variant="info"
		>
			Протоколы не заведены
		</b-alert>

		<div
			v-else
			class="d-flex flex-column justify-content-between mt-3 mx-2"
			:style="{minHeight: '80vh'}"
		>
			<div>
				<b-pagination
					v-if="protocols.length > perPage"
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
					:items="protocols"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template v-slot:cell(recNo)="data">
						{{data.index + 1 + (currentPage - 1) * perPage}}
					</template>

					<template v-slot:cell(edit)="data">
						<b-button @click="editProtocol(data.item, $event.target)" variant="outline-primary">
							<font-awesome-icon icon="pencil-alt"/>
						</b-button>
						<b-button @click="deleteProtocol(data.item)" variant="outline-danger">
							<font-awesome-icon icon="trash-alt"/>
						</b-button>
					</template>
				</b-table>
			</div>

			<b-pagination
				v-if="protocols.length > perPage"
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
		name: 'Protocol',
		components: {
			YmPageHeader,
			YmFileInput
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Протоколы',
				protocol: {
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
						label: 'Протокол',
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
			...mapGetters('protocol', [
				'getProtocols'
			]),
			protocols() {
				return this.getProtocols;
			},
			docRows() {
				return this.protocols.length
			},
		},
		methods: {
			...mapActions('protocol', [
				'createProtocol',
				'updateProtocol',
			]),
			...mapActions('protocol', {
				removeDoc: 'deleteProtocol'
			}),
			dateToString(date) {
				let dd = date.getDate();
				let mm = date.getMonth() + 1;
				const yyyy = date.getFullYear();

				dd = (dd < 10 ? '0' + dd : dd);
				mm = (mm < 10 ? '0' + mm : mm);

				return yyyy + '-' + mm + '-' + dd;
			},
			addProtocol() {
				this.modalTitle = 'Добавить протокол';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('protocolEdit');
			},
			editProtocol(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.protocol.id = item.id;
				this.protocol.title = item.title;
				this.protocol.date = this.dateToString(new Date(item.date));
				this.protocol.fileName = item.file;
				this.$root.$emit('bv::show::modal', 'protocolEdit', button)
			},
			deleteProtocol(item) {
				this.deleteDoc(this, item, {
					type: 'Protocol',
					name: 'протокол от',
					title: new Date(item.date).toLocaleDateString()
				});
			},
			checkFormValidity() {
				this.stateTitle = this.$refs.form.inputTitle.checkValidity();
				this.stateDate = this.$refs.form.inputDate.checkValidity();
				this.stateFile = (this.protocol.id ? true : Boolean(this.protocol.file));

				return (this.stateTitle && this.stateDate && this.stateFile);
			},
			resetModal() {
				this.protocol.id = null;
				this.protocol.title = '';
				this.protocol.date = this.dateToString(new Date());
				this.protocol.fileName = '';
				this.protocol.file = null;

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
					if (!this.protocol.id) {
						await this.createProtocol(this.protocol);
					} else {
						await this.updateProtocol(this.protocol);
					}
				} catch (e) {
					console.log('Ошибка try protocol: ', e)
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