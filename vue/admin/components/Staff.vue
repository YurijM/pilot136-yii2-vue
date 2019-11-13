<template>
	<b-container>
		<ym-page-header :title="title" :count="count" link="Добавить сотрудника" @onAddNewDoc="addPerson"/>

		<b-modal
			id="personEdit"
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
					:state="stateFamily"
					label="Фамилия"
					label-for="inputFamily"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Введите фамилию сотрудника"
				>
					<b-form-input
						id="inputFamily"
						v-model="person.family"
						:state="stateFamily"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					:state="stateName"
					label="Имя"
					label-for="inputName"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Введите имя сотрудника"
				>
					<b-form-input
						id="inputName"
						v-model="person.name"
						:state="stateName"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					:state="statePatronymic"
					label="Отчество"
					label-for="inputPatronymic"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Введите отчество сотрудника"
				>
					<b-form-input
						id="inputPatronymic"
						v-model="person.patronymic"
						:state="statePatronymic"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					:state="statePost"
					label="Должность(и):"
					label-for="inputPost"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Укажите должность(и) сотрудника"
				>
					<div class="mt-n3 mb-2 pl-5">
						{{labelPost}}
					</div>
					<b-form-select
						id="inputPost"
						v-model="selected"
						:options="options"
						multiple
						:select-size="posts.length">
					</b-form-select>
				</b-form-group>
			</form>
		</b-modal>

		<b-alert v-if="count == 0" class="text-center" show variant="info">Сотрудники не заведены</b-alert>

		<div
			v-else
			class="d-flex flex-column justify-content-between mt-3 mx-auto"
			:style="{minHeight: '70vh', maxWidth: '675px'}"
		>
			<div>
				<b-pagination
					v-if="count > perPage"
					v-model="currentPage"
					:total-rows="count"
					:per-page="perPage"
					pills
					size="sm"
					aria-controls="table-staff"
					align="center"
				></b-pagination>

				<b-table
					id="table-staff"
					class="mt-3"
					striped
					small
					responsive="sm"
					:fields="fields"
					:items="staff"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template v-slot:cell(recNo)="data">
						{{data.index + ((currentPage - 1) * perPage) + 1}}
					</template>

					<template v-slot:cell(edit)="data">
						<b-button @click="editPerson(data.item, $event.target)" variant="outline-primary">
							<font-awesome-icon icon="pencil-alt"/>
						</b-button>
						<b-button @click="deletePerson(data.item)" variant="outline-danger">
							<font-awesome-icon icon="trash-alt"/>
						</b-button>
					</template>
				</b-table>
			</div>

			<b-pagination
				v-if="count > perPage"
				v-model="currentPage"
				pills
				size="sm"
				:total-rows="count"
				:per-page="perPage"
				aria-controls="table-staff"
				align="center"
			></b-pagination>
		</div>
	</b-container>
</template>

<script>
	import YmPageHeader from './PageHeader'
	import {mapGetters, mapActions} from 'vuex'

	const {PER_PAGE} = require('../../constants');

	export default {
		name: 'Staff',
		components: {
			YmPageHeader
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Штат',
				posts: [],
				options: [],
				selected: [],
				labelPost: 'ещё ничего не выбрано',
				selectedPosts: '',
				perPage: PER_PAGE,
				currentPage: 1,
				person: {
					id: null,
					family: '',
					name: '',
					patronymic: '',
					postIds: [],
					posts: ''
				},
				stateFamily: null,
				stateName: null,
				statePatronymic: null,
				statePost: null,
				modalTitle: '',
				okTitle: '',
				fields: [
					{
						key: 'recNo',
						label: '№',
						thClass: ['p-1', 'text-center', 'align-middle'],
						thStyle: {width: '2em'},
						tdClass: ['p-1', 'align-middle', 'text-center']
					},
					{
						key: 'person',
						label: 'Сотрудник',
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1', 'align-middle']
					},
					{
						key: 'post',
						label: 'Должность(и)',
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1', 'text-center', 'align-middle']
					},
					{
						key: 'edit',
						label: '',
						thStyle: {width: '6em'},
						thClass: ['p-1', 'text-center', 'align-middle'],
						tdClass: ['p-1', 'align-middle', 'text-right']
					}
				],
			}
		},
		async created() {
			await this.$store.dispatch('post/loadPosts');
			this.posts = this.$store.getters['post/getPosts'];
			this.options = [];
			this.posts.forEach((item, i, posts) => {
				this.options.push({
					value: item.id,
					text: item.post
				})
			});
		},
		computed: {
			...mapGetters('staff', [
				'getStaff',
				'getCount',
				'getCurrentIdx'
			]),
			...mapGetters('post', [
				'getPosts'
			]),
			staff() {
				return this.getStaff;
			},
			count() {
				return this.getCount;
			},
			postChange() {
				return this.selected
			}
		},
		watch: {
			postChange(selected) {
				this.selectedPosts = '';
				selected.forEach((item, i, items) => {
					if (i > 0) this.selectedPosts += ', ';
					this.selectedPosts += this.options.find(option => option.value === item).text
				});
				this.labelPost = (this.selectedPosts ? this.selectedPosts : 'ещё ничего не выбрано')
			}
		},
		methods: {
			...mapActions('staff', [
				'createStaff',
				'updateStaff'
			]),
			...mapActions('staff', {
				removeDoc: 'deleteStaff'
			}),
			addPerson() {
				this.modalTitle = 'Добавить сотрудника';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('personEdit');
			},
			editPerson(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.person.id = item.id;
				const person = item.person.split(' ');
				this.person.family = person[0];
				this.person.name = person[1];
				this.person.patronymic = person[2];
				this.selected = item.post_id;
				this.selectedPosts = item.post;
				this.$root.$emit('bv::show::modal', 'personEdit', button)
			},
			deletePerson(item) {
				this.deleteDoc(this, item, {
					type: 'Staff',
					name: 'сотрудник',
					title: item.person
				});
			},
			checkFormValidity() {
				this.stateFamily = this.$refs.form.inputFamily.checkValidity();
				this.stateName = this.$refs.form.inputName.checkValidity();
				this.statePatronymic = this.$refs.form.inputPatronymic.checkValidity();
				this.statePost = (this.selected.length > 0);

				return (this.stateFamily && this.stateName && this.statePatronymic && this.statePost);
			},
			resetModal() {
				this.person.id = null;
				this.person.family = '';
				this.person.name = '';
				this.person.patronymic = '';
				this.person.postIds = [];
				this.person.posts = '';

				this.selected = [];
				this.selectedPosts = '';

				this.stateFamily = null;
				this.stateName = null;
				this.statePatronymic = null;
				this.statePost = null;
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
					this.person.postIds = this.selected;
					this.person.posts = this.selectedPosts;

					if (this.person.id) {
						await this.updateStaff(this.person);
					} else {
						await this.createStaff(this.person);
					}

					this.currentPage = Math.trunc(this.getCurrentIdx / this.perPage + 1);
				} catch (e) {
					console.log('Ошибка try staff: ', e)
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