<template>
	<b-container>
		<ym-page-header :title="title" :count="count" link="Добавить сотрудника" @onAddNewDoc="addPerson"/>

		<b-modal
			id="staffEdit"
			:header-class="['alert-primary', 'border-primary', 'border-bottom']"
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
						:select-size="4">
					</b-form-select>
				</b-form-group>
			</form>
		</b-modal>

		<b-alert v-if="docs.length === 0" class="text-center" show variant="info">Сотрудники не заведены</b-alert>

		<div
			v-else
			class="d-flex flex-column justify-content-between mt-3 mx-auto"
			:style="{minHeight: '70vh', maxWidth: '750px'}"
		>
			<div>
				<b-pagination
					v-if="docs.length > perPage"
					v-model="currentPage"
					:total-rows="staffRows"
					:per-page="perPage"
					aria-controls="table-staff"
					align="center"
				></b-pagination>

				<b-table
					striped
					small
					responsive="sm"
					:fields="fields"
					:items="docs"
					:per-page="perPage"
					:current-page="currentPage"
				>
					<template v-slot:cell(recNo)="data">
						{{data.index + ((currentPage - 1) * perPage) + 1}}
					</template>

					<template v-slot:cell(person)="data">
						{{data.item.family}} {{data.item.name}} {{data.item.patronymic}}
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
				v-if="docs.length > perPage"
				v-model="currentPage"
				:total-rows="staffRows"
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
					posts: []
				},
				stateFamily: null,
				stateName: null,
				statePatronymic: null,
				statePost: null,
				modalTitle: '',
				okTitle: ''
			}
		}
	}
</script>

<style scoped>

</style>