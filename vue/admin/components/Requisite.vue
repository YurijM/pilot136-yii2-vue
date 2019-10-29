<template>
	<b-container>
		<ym-page-header
			:title="title"
			:count="requisites.length"
			link="Добавить реквизит"
			@onAddNewDoc="addRequisite"
		/>

		<b-modal
			id="requisiteEdit"
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
					:state="stateRequisite"
					label="Реквизит"
					label-for="inputRequisite"
					label-size="sm"
					label-class="font-weight-bold"
					invalid-feedback="Реквизит должен быть заполнен"
				>
					<b-form-input
						id="inputRequisite"
						v-model="requisite.requisite"
						:state="stateRequisite"
						:autofocus="true"
						required
					></b-form-input>
				</b-form-group>

				<b-form-group
					:state="stateValue"
					label="Значение"
					label-for="inputValue"
					label-size="sm"
					label-class="font-weight-bold"
					:invalid-feedback="errorValue"
				>
					<b-form-input
						id="inputValue"
						v-model="requisite.value"
						:state="stateRequisite"
						required
					></b-form-input>
				</b-form-group>
			</form>
		</b-modal>

		<b-alert
			v-if="requisites.length === 0"
			class="text-center"
			show
			variant="info"
		>
			Реквизиты не заведены
		</b-alert>

		<b-table
			v-else
			striped
			small
			class="mx-auto"
			:style="{maxWidth: '350px'}"
			responsive="sm"
			:fields="fields"
			:items="requisites"
		>
			<template v-slot:cell(recNo)="data">
				{{data.index + 1}}
			</template>
			<template v-slot:cell(edit)="data">
				<b-button @click="updateRequisite(data.item, $event.target)" variant="outline-primary">
					<font-awesome-icon icon="pencil-alt"/>
				</b-button>
				<b-button @click="deleteRequisite(data.item)" variant="outline-danger">
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
		name: 'Requisite',
		components: {
			YmPageHeader
		},
		inject: ['deleteDoc'],
		data() {
			return {
				title: 'Реквизиты',
				requisite: {
					id: null,
					requisite: '',
					value: null
				},
				stateRequisite: null,
				stateValue: null,
				errorValue: null,
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
						key: 'requisite',
						label: 'Реквизит',
						thClass: ['text-center', 'align-middle'],
						tdClass: ['px-2', 'align-middle']
					},
					{
						key: 'value',
						label: 'Значение',
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
			...mapGetters('requisite', [
				'getRequisites'
			]),
			requisites() {
				return this.getRequisites;
			}
		},
		methods: {
			...mapActions('requisite', [
				'createRequisite',
				'removeRequisite'
			]),
			addRequisite() {
				this.modalTitle = 'Добавить реквизит';
				this.okTitle = 'Сохранить';
				this.$bvModal.show('requisiteEdit');
			},
			updateRequisite(item, button) {
				this.modalTitle = 'Редактировать запись';
				this.okTitle = 'Обновить';
				this.requisite.id = item.id;
				this.requisite.requisite = item.requisite;
				this.requisite.value = item.value;
				this.$root.$emit('bv::show::modal', 'requisiteEdit', button)
			},
			deleteRequisite(item) {
				this.deleteDoc(this, item, {
					type: 'requisite',
					name: 'реквизит',
					title: item.requisite
				});
			},
			checkFormValidity() {
				/*const validRequisite = this.$refs.form.inputRequisite.checkValidity();
				this.stateRequisite = validRequisite ? 'valid' : 'invalid';

				const validValue = this.$refs.form.inputValue.checkValidity();
				this.stateValue = validValue ? 'valid' : 'invalid';*/

				this.stateRequisite = this.$refs.form.inputRequisite.checkValidity();
				this.stateValue = this.$refs.form.inputValue.checkValidity();

				if (!this.$refs.form.inputValue.value) {
					this.errorValue = "Поле должно быть заполнено"
				} else if (!this.$refs.form.inputValue.value < 1) {
					this.errorValue = "Значение должно быть не меньше 1"
				}

				//return (validRequisite && validValue);
				return (this.stateRequisite && this.stateValue);
			},
			resetModal() {
				this.requisite.id = null;
				this.requisite.requisite = '';
				this.requisite.value = null;

				this.stateRequisite = null;
				this.stateValue = null
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
					/*if (this.requisite.id) {
						await this.$store.dispatch('requisite/update', this.requisite);
					} else {
						await this.$store.dispatch('requisite/create', this.requisite);
					}

					this.docs = await this.$store.dispatch('requisite/list');

					this.resetModal();
				} catch (e) {
					this.$store.dispatch('setInfo', {type: 'danger', message: e.message})
				}*/
					if (!this.requisite.id) {
						await this.createRequisite(this.requisite);
					}
				} catch (e) {
					console.log('Ошибка try requisite: ', e)
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