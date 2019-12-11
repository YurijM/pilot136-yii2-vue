<template>
	<b-container>
		<h4 class="font-weight-bold text-center">Документы</h4>

		<b-list-group
			class="mb-3 pb-3 justify-content-center flex-wrap"
			:style="{fontSize: '1.15em', borderBottom: '2px solid #007bff'}"
			horizontal
		>
			<b-list-group-item
				v-for="(doc, i) in docs"
				:key="i"
				variant="info"
				class="d-flex mt-2 justify-content-between align-items-center"
				@click="listDocs(doc, i)"
			>
				{{doc.title}}
				<b-badge class="ml-3" variant="primary" pill>{{doc.docs.length}}</b-badge>
			</b-list-group-item>
		</b-list-group>

		<ym-docs-list
			:docs="docsCurrent"
			:idx="currentIndex"
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
				acts: null,
				contracts: null,
				certificates: null,
				finances: null,
				overhauls: null,
				protocols: null,
				currentIndex: 0,
			}
		},
		async created() {
			this.acts = this.$store.getters['act/getActs'];
			this.contracts = this.$store.getters['contract/getContracts'];
			this.certificates = this.$store.getters['certificate/getCertificates'];
			this.finances = this.$store.getters['finance/getFinances'];
			this.overhauls = this.$store.getters['overhaul/getOverhauls'];
			this.protocols = this.$store.getters['protocol/getProtocols'];

			this.docs.push({
				title: 'Свидетельства и паспорта',
				docs: this.certificates,
				folder: 'certificates',
				period: ''
			});
			this.docs.push({
				title: 'Финансы',
				docs: this.finances,
				folder: 'finances',
				period: ''
			});
			this.docs.push({
				title: 'Договоры',
				docs: this.contracts,
				folder: 'contracts',
				period: 'year'
			});
			this.docs.push({
				title: 'Акты',
				docs: this.acts,
				folder: 'acts',
				period: 'year'
			});
			this.docs.push({
				title: 'Протоколы',
				docs: this.protocols,
				folder: 'protocols',
				period: 'date'
			});
			this.docs.push({
				title: 'Капитальный ремонт',
				docs: this.overhauls,
				folder: 'overhauls',
				period: ''
			});

			this.docs.sort(this.sortDocs);

			this.currentIndex = 0;
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
			listDocs(doc, i) {
				this.docsCurrent = doc;
				this.currentIndex = i;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-group-item {
		cursor: pointer
	}
</style>