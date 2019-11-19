<template>
	<b-container class="animated fadeIn slow">
		<h4 class="font-weight-bold text-center">Документы</h4>

		<b-list-group class="mt-2 mb-3 justify-content-center flex-wrap" :style="{fontSize: '1.15em'}" horizontal>
			<b-list-group-item
				v-for="(doc, i) in docs"
				:key="i"
				variant="info"
				class="d-flex justify-content-between align-items-center"
				@click="listDocs(doc)"
			>
				{{doc.title}}
				<b-badge class="ml-3" variant="primary" pill>{{doc.docs.length}}</b-badge>
			</b-list-group-item>
		</b-list-group>

		<ym-docs-list
			:docs="docsCurrent"
		/>
	</b-container>
</template>

<script>
	import YmDocsList from './DocsList'

	export default {
		name: 'DocsList',
		components: {
			YmDocsList
		},
		data() {
			return {
				docs: [],
				docsCurrent: null,
				acts: null
			}
		},
		async created() {
			this.acts = this.$store.getters['act/getActs'];

			this.docs.push({title: 'Свидетельства и паспорта', docs: this.acts});
			this.docs.push({title: 'Финансы', docs: this.acts});
			this.docs.push({title: 'Договоры', docs: this.acts});
			this.docs.push({title: 'Акты', docs: this.acts});
			this.docs.push({title: 'Протоколы', docs: this.acts});
			this.docs.push({title: 'Капитальный ремонт', docs: this.acts});

			this.docs.sort(this.sortDocs);

			this.docsCurrent = this.docs[0];
		},
		methods: {
			sortDocs(a, b) {
				// Используем toUpperCase() для преобразования регистра
				const item1 = a.title.toUpperCase();
				const item2 = b.title.toUpperCase();

				let result = 0;
				if (item1 > item2) {
					result = 1;
				} else if (item1 < item2) {
					result = -1;
				}
				return result;
			},
			listDocs(docs) {
				/*this.showDocs = false;
				this.docsCurrent = docs;
				setTimeout(() => {
					this.showDocs = true;
				}, 1000);*/
			}
		}
	}
</script>

<style scoped>

</style>