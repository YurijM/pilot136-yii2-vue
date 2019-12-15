<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="photos.length"
			link="Добавить фотографию"
			@onAddNewDoc="addPhoto"
		/>

		<b-modal
			id="photoEdit"
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
				<ym-file-input
					:isEdit="photo.id !== null"
					:doc="photo"
					:stateFile="stateFile"
					:accept="accept"
				/>
			</form>
		</b-modal>

		<b-alert
			v-if="photos.length === 0"
			class="text-center"
			show
			variant="info"
		>
			Фотографии не заведены
		</b-alert>

		<div
			v-else
			class="d-flex flex-column justify-content-between mt-3 mx-auto"
			:style="{minHeight: '78vh', maxWidth: '350px'}"
		>
			<div>
				<b-pagination
					v-if="photos.length > perPage"
					v-model="currentPage"
					:total-rows="docRows"
					:per-page="perPage"
					pills
					size="sm"
					aria-controls="table-doc"
					align="center"
				></b-pagination>

				<b-table
					id="table-doc"
					class="mt-3"
					striped
					small
					responsive="sm"
					:fields="fields"
					:items="photos"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template v-slot:cell(recNo)="data">
						{{data.index + 1 + (currentPage - 1) * perPage}}
					</template>

					<template v-slot:cell(edit)="data">
						<b-button @click="deletePhoto(data.item)" variant="outline-danger">
							<font-awesome-icon icon="trash-alt"/>
						</b-button>
					</template>
				</b-table>
			</div>

			<b-pagination
				v-if="photos.length > perPage"
				v-model="currentPage"
				pills
				size="sm"
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
		name: 'Photo',
		components: {
			YmPageHeader,
			YmFileInput
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Фотографии',
				photo: {
					id: null,
					fileName: '',
					file: null
				},
				stateFile: null,
				modalTitle: '',
				okTitle: '',
				perPage: this.appConfig.perPage,
				currentPage: 1,
				accept: [...this.appConfig.mimetypeImg, ...this.appConfig.extImg].join(','),
				fields: [
					{
						key: 'recNo',
						label: '№',
						thClass: ['p-1', 'text-center', 'align-middle'],
						thStyle: {width: '2em'},
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
		computed: {
			...mapGetters('photo', [
				'getPhotos'
			]),
			photos() {
				return this.getPhotos;
			},
			docRows() {
				return this.photos.length
			},
		},
		methods: {
			...mapActions('photo', [
				'createPhoto',
			]),
			...mapActions('photo', {
				removeDoc: 'deletePhoto'
			}),
			addPhoto() {
				this.modalTitle = 'Добавить фотографию';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('photoEdit');
			},
			deletePhoto(item) {
				this.deleteDoc(this, item, {
					type: 'Photo',
					name: 'фотография',
					title: item.file
				});
			},
			checkFormValidity() {
				return (this.photo.id ? true : Boolean(this.photo.file));
			},
			resetModal() {
				this.photo.id = null;
				this.photo.fileName = '';
				this.photo.file = null;

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
						await this.createPhoto(this.photo);
				} catch (e) {
					console.log('Ошибка try photo: ', e)
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