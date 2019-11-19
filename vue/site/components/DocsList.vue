<template>
	<div>
		<h5 class="font-weight-bold text-center">{{docs.title}}</h5>

		<b-card-group class="justify-content-center" deck>
			<b-card v-for="doc in docs.docs" :key="doc._id"
							body-class="alert-info"
							border-variant="primary"
							class="my-2 text-center"
							:style="{minWidth: '19rem', maxWidth: '19rem'}"
							footer-tag="footer"
							footer-class="alert-primary"
			>
				<b-card-text>
					{{doc.title}}
				</b-card-text>

				<template v-slot:footer>
					<b-button
						size="sm"
						class="d-inline-flex align-items-center"
						:href="`./${doc.file}`"
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
			docs: {
				type: Object
			},
		}
	}
</script>

<style scoped>

</style>