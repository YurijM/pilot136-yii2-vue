<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="notices.length"
			link="Добавить объявление"
			@onAddNewDoc="addNotice"
		/>

		<b-modal
			id="noticeEdit"
			:header-class="['alert-primary', 'border-primary', 'border-bottom']"
			:footer-class="['alert-primary', 'border-primary', 'border-top']"
			modal-class="in"
			ref="modal"
			size="lg"
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
				<div class="d-flex">
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
							v-model="notice.date"
							type="date"
							:state="stateDate"
							:autofocus="true"
							required
						></b-form-input>
					</b-form-group>

					<b-form-group
						class="w-100 ml-3"
						label="Подпись"
						label-for="inputSign"
						label-size="sm"
						label-class="font-weight-bold"
					>
						<b-form-input
							id="inputSign"
							v-model="notice.sign"
						></b-form-input>
					</b-form-group>
				</div>

				<b-form-group
					:state="stateNotice"
					invalid-feedback="Введите текст объявления"
				>
					<div class="d-inline-block col-form-label-sm font-weight-bold mr-1">
						Текст объявления
					</div>
					<span class="small">
            (в формате
            <em><strong>
              <a href="http://paulradzkov.com/2014/markdown_cheatsheet" target="_blank">markdown</a>
            </strong></em>
            )
          </span>

					<b-form-textarea
						id="inputNotice"
						v-model="notice.notice"
						rows="5"
						:state="stateNotice"
						required
					></b-form-textarea>
				</b-form-group>
			</form>

			<div v-if="notice.notice">
				<div class="col-form-label-sm font-weight-bold">
					Результат
				</div>
				<!--<div class="markdown alert alert-success" v-html="$md.render(notice.notice)"></div>-->
				<!--<markdown-it-vue class="mt-5" :content="content"/>-->
				<markdown-it-vue class="alert alert-success" :content="notice.notice"/>
			</div>
		</b-modal>

		<b-alert
			v-if="notices.length === 0"
			class="text-center"
			variant="info"
		>
			Объявления не заведены
		</b-alert>

		<div
			v-else
			class="d-flex flex-column justify-content-between mt-3 mx-2"
			:style="{minHeight: '80vh'}"
		>
			<b-table
				striped
				small
				class="mx-auto mt-3"
				responsive="sm"
				:fields="fields"
				:items="notices"
			>
				<template v-slot:cell(recNo)="data">
					{{data.index + 1}}
				</template>

				<template v-slot:cell(notice)="data">
					<markdown-it-vue :content="data.value"/>
				</template>

				<template v-slot:cell(edit)="data">
					<b-button @click="editNotice(data.item, $event.target)" variant="outline-primary">
						<font-awesome-icon icon="pencil-alt"/>
					</b-button>
					<b-button @click="deleteNotice(data.item)" variant="outline-danger">
						<font-awesome-icon icon="trash-alt"/>
					</b-button>
				</template>
			</b-table>
		</div>
	</b-container>
</template>

<script>
	import YmPageHeader from './PageHeader'
	import MarkdownItVue from 'markdown-it-vue'
	//import 'markdown-it-vue/dist/markdown-it-vue.css'
	import {mapGetters, mapActions} from 'vuex'

	export default {
		name: 'Notice',
		components: {
			YmPageHeader,
			MarkdownItVue
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Объявления',
				notice: {
					id: null,
					notice: '',
					sign: '',
					date: this.dateToString(new Date())
				},
				stateDate: null,
				stateNotice: null,
				stateSign: null,
				modalTitle: '',
				okTitle: '',
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
					}, {
						key: 'notice',
						label: 'Объявление',
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1'],
						formatter: value => {
							let strLength = 80;
							//let str = value;

							if (value.length > strLength) {
								value = (value.substr(0, strLength));
								let substr = '***';

								while (substr.length > 0) {
									let count = ((strLength - (value.split(substr).join('')).length) / substr.length);
									if (count % 2 !== 0) {
										value = value.substr(0, strLength - substr.length).trim() + substr;
										break
									} else {
										substr = substr.substr(0, substr.length - 1);
									}
								}

								value += '...'
							}

							return value;
						}
					},
					{
						key: 'edit',
						label: '',
						thStyle: {width: '6em'},
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1', 'text-right']
					}
				]
			}
		},
		computed: {
			...mapGetters('notice', [
				'getNotices'
			]),
			notices() {
				return this.getNotices
			},
			docRows() {
				return this.notices.length
			}
		},
		methods: {
			...mapActions('notice', [
				'createNotice',
				'updateNotice'
			]),
			...mapActions('notice', {
				removeDoc: 'deleteNotice'
			}),
			dateToString(date) {
				let dd = date.getDate();
				let mm = date.getMonth() + 1;
				const yyyy = date.getFullYear();

				dd = (dd < 10 ? '0' + dd : dd);
				mm = (mm < 10 ? '0' + mm : mm);

				return yyyy + '-' + mm + '-' + dd;
			},
			addNotice() {
				this.modalTitle = 'Добавить объявление';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('noticeEdit');
			},
			editNotice(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.notice.id = item.id;
				this.notice.notice = item.notice;
				this.notice.sign = item.sign;
				this.notice.date = this.dateToString(new Date(item.date));
				this.$root.$emit('bv::show::modal', 'noticeEdit', button)
			},
			deleteNotice(item) {
				this.deleteDoc(this, item, {
					type: 'Notice',
					name: 'объявление от',
					title: new Date(item.date).toLocaleDateString()
				});
			},
			checkFormValidity() {
				this.stateNotice = this.$refs.form.inputNotice.checkValidity();
				this.stateSign = this.$refs.form.inputSign.checkValidity();
				this.stateDate = this.$refs.form.inputDate.checkValidity();

				return (this.stateNotice && this.stateSign && this.stateDate);
			},
			resetModal() {
				this.notice.id = null;
				this.notice.notice = '';
				this.notice.sign = this.dateToString(new Date());

				this.stateNotice = null;
				this.stateSign = null;
				this.stateDate = null;
			},
			handleOk(bvModalEvt) {
				// Prevent modal from closing
				bvModalEvt.preventDefault();
				// Trigger submit handler
				this.handleSubmit()
			},
			async handleSubmit() {
				// Exit when the form isn't valid
				if (!this.checkFormValidity()) {
					return
				}

				try {
					if (!this.notice.id) {
						await this.createNotice(this.notice);
					} else {
						await this.updateNotice(this.notice);
					}

					this.resetModal();
				} catch (e) {
					console.log('Ошибка try notice: ', e)
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

	.markdown-body {
		max-height: 10em !important;
		overflow: auto !important;
	}
</style>