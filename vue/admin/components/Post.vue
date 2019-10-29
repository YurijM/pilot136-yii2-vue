<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="posts.length"
			link="Добавить должность"
			@onAddNewDoc="addPost"
		/>

		<b-modal
			id="postEdit"
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
					:state="statePost"
					label="Должность"
					label-for="inputPost"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Должность должна быть заполнена"
				>
					<b-form-input
						id="inputPost"
						v-model="post.post"
						:state="statePost"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					:state="stateOrderNo"
					label="Порядок отображения"
					label-for="inputOrderNo"
					label-size="sm"
					label-class="font-weight-bold"
					:invalid-feedback="errorOrderNo"
				>
					<b-form-input
						id="inputOrderNo"
						v-model="post.order_no"
						:state="statePost"
						type="number"
						min="1"
						required
					></b-form-input>
				</b-form-group>
			</form>
		</b-modal>

		<b-alert
			v-if="posts.length === 0"
			class="text-center"
			show
			variant="info"
		>
			Должности не заведены
		</b-alert>

		<b-table
			v-else
			striped
			small
			class="mx-auto"
			:style="{maxWidth: '500px'}"
			responsive="sm"
			:fields="fields"
			:items="posts"
		>
			<template v-slot:cell(recNo)="data">
				{{data.index + 1}}
			</template>
			<template v-slot:cell(edit)="data">
				<b-button @click="editPost(data.item, $event.target)" variant="outline-primary">
					<font-awesome-icon icon="pencil-alt"/>
				</b-button>
				<b-button @click="deletePost(data.item)" variant="outline-danger">
					<font-awesome-icon icon="trash-alt"/>
				</b-button>
			</template>
		</b-table>
	</b-container>
</template>

<script>
	import YmPageHeader from './PageHeader'
	import {mapGetters, mapActions} from 'vuex'

	export default {
		name: 'Post',
		components: {
			YmPageHeader
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Должности',
				post: {
					id: null,
					post: '',
					order_no: null
				},
				statePost: null,
				stateOrderNo: null,
				errorOrderNo: null,
				modalTitle: '',
				okTitle: '',
				fields: [
					{
						key: 'recNo',
						label: '№',
						thClass: ['text-center', 'align-middle'],
						thStyle: {width: '2em'},
						tdClass: ['py-0', 'px-2', 'align-middle', 'text-center']
					},
					/*{key: 'id', thClass: 'text-center', tdClass: ['py-0', 'px-2', 'align-middle', 'text-center']},*/
					{
						key: 'post',
						label: 'Должность',
						thClass: ['text-center', 'align-middle'],
						tdClass: ['px-2', 'align-middle']
					},
					{
						key: 'order_no',
						label: 'Порядок отображения',
						thClass: ['text-center', 'align-middle'],
						tdClass: ['px-2', 'align-middle', 'text-center']
					},
					{
						key: 'edit',
						label: '',
						thStyle: {width: '7em'},
						thClass: ['text-center', 'align-middle'],
						tdClass: ['py-1', 'px-2', 'align-middle', 'text-right']
					}
				],
			}
		},
		computed: {
			...mapGetters('post', [
				'getPosts'
			]),
			posts() {
				return this.getPosts;
			}
		},
		methods: {
			...mapActions('post', [
				'createPost',
				'updatePost',
				'removePost'
			]),
			addPost() {
				this.modalTitle = 'Добавить должность';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('postEdit');
			},
			editPost(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.post.id = item.id;
				this.post.post = item.post;
				this.post.order_no = item.order_no;
				this.$root.$emit('bv::show::modal', 'postEdit', button)
			},
			deletePost(item) {
				this.deleteDoc(this, item, {
					type: 'post',
					name: 'должность',
					title: item.post
				});
			},
			checkFormValidity() {
				/*const validPost = this.$refs.form.inputPost.checkValidity();
				this.statePost = validPost ? 'valid' : 'invalid';

				const validOrderNo = this.$refs.form.inputOrderNo.checkValidity();
				this.stateOrderNo = validOrderNo ? 'valid' : 'invalid';*/

				this.statePost = this.$refs.form.inputPost.checkValidity();
				this.stateOrderNo = this.$refs.form.inputOrderNo.checkValidity();

				if (!this.$refs.form.inputOrderNo.value) {
					this.errorOrderNo = "Поле должно быть заполнено"
				} else if (!this.$refs.form.inputOrderNo.value < 1) {
					this.errorOrderNo = "Значение должно быть не меньше 1"
				}

				//return (validPost && validOrderNo);
				return (this.statePost && this.stateOrderNo);
			},
			resetModal() {
				this.post.id = null;
				this.post.post = '';
				this.post.order_no = null;

				this.statePost = null;
				this.stateOrderNo = null
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
					/*if (this.post.id) {
						await this.$store.dispatch('post/update', this.post);
					} else {
						await this.$store.dispatch('post/create', this.post);
					}

					this.docs = await this.$store.dispatch('post/list');

					this.resetModal();
				} catch (e) {
					this.$store.dispatch('setInfo', {type: 'danger', message: e.message})
				}*/
					if (!this.post.id) {
						await this.createPost(this.post);
					} else {
						await this.updatePost(this.post.id);
					}
				} catch (e) {
					console.log('Ошибка try post: ', e)
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