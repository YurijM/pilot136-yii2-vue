<template>
	<div class="w-100 animated fadeIn slow">
		<div v-if="(photos.length === 0)" class="w-100 text-center alert alert-warning">
			Фотографии не заведены
		</div>

		<div v-else class="mx-auto" :style="{maxWidth: '900px'}">
			<h4 class="d-flex align-items-center justify-content-center font-weight-bold mb-3">
				Фотографии
				<b-badge
					class="ml-3"
					pill
					variant="primary"
				>
					{{photos.length}}
				</b-badge>
			</h4>

			<b-carousel
				id="carousel-fade"
				controls
				indicators
			>
				<b-carousel-slide
					v-for="photo in photos"
					:key="photo.id"
					:img-src="`downloads/photos/${photo.file}`"
					:caption-html="`<div class='text-right' style='font-size: 1rem'>${photo.file}</div>`"
				/>
			</b-carousel>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'Photo',
		data() {
			return {
				photos: []
			}
		},
		async created() {
			this.photos = this.$store.getters['photo/getPhotos'];
		}
	}
</script>

<style lang="scss">
	.carousel-caption {
		right: 3% !important;
		bottom: -20px;
	}
</style>

<style lang="scss" scoped>
</script