<template>
	<div
		v-if="i === idx"
		class="animated fadeIn slow"
	>
		<h5 class="font-weight-bold text-center">{{docs.title}}</h5>

		<b-card-group class="justify-content-center" deck>
			<b-card v-for="doc in docs.docs" :key="doc.id"
							body-class="alert-info py-1 px-2"
							border-variant="primary"
							class="m-2 text-center"
							:style="{minWidth: '17.5rem', maxWidth: '17.5rem'}"
							footer-tag="footer"
							footer-class="alert-primary"
			>
				<b-card-text>
					{{doc.title}}
					<span v-if="docs.showYear">
						({{doc.year}}г.)
					</span>
				</b-card-text>

				<template v-slot:footer>
					<b-button
						size="sm"
						class="d-inline-flex align-items-center"
						:href="`downloads/${docs.folder}/${doc.file}`"
						target="_blank"
						variant="primary"
					>
						Загрузить <font-awesome-icon icon="file-pdf" class="ml-3" :style="{fontSize: '2.5rem'}"/>
					</b-button>
				</template>

			</b-card>
		</b-card-group>
	</div></template>

<script>
	export default {
		name: 'DocsList',
		props: {
			idx: {
				type: Number,
				default: -1
			},
			docs: {
				type: Object
			},
		},
		data() {
			return {
				i: 0
			}
		},
		computed: {
			show() {
				return this.idx
			}
		},
		watch: {
			show(index) {
				setTimeout(() => {
					this.i = index;
				}, .001);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@media (min-width: 200px) {
		.card-deck {
			flex-flow: row wrap !important;
		}
	}
</style>