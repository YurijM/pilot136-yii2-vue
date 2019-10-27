<template>
	<b-container>
		<ym-page-header :title="title" :count="posts.length" link="Добавить должность" @onAddNewDoc="addPost"/>

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
			<template v-slot:cell(edit)="row">
				<b-button @click="updatePost(row.item, $event.target)" variant="outline-primary">
					<font-awesome-icon icon="pencil-alt"/>
				</b-button>
				<b-button @click="deletePost(row.item)" variant="outline-danger">
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
		data() {
			return {
				title: 'Должности',
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
			addPost() {

			}
		}
	}
</script>

<style scoped>

</style>