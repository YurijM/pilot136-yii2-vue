<template>
	<div>
		<div class="w-100 mx-auto mb-n3" style="border: 1px solid #777"></div>

		<div class="notice w-100 my-5 bg-white mx-auto py-2 px-4 border border-secondary">
			<div class="d-flex justify-content-between text-secondary mt-n5">
				<font-awesome-icon icon="paperclip" class="fa-2x" transform="rotate-300"/>
				<font-awesome-icon icon="paperclip" class="fa-2x" transform="rotate-315"/>
				<font-awesome-icon icon="paperclip" class="fa-2x" transform="rotate-335"/>
			</div>

			<div class="d-flex justify-content-between mt-3 mb-2 pb-1 font-weight-bold font-italic border-bottom border-dark">
				<div>
					{{notice.sign}}
				</div>

				<div class="text-right">
					{{new Date(notice.date).toLocaleDateString()}}
				</div>
			</div>

			<markdown-it-vue :style="{color: '#000080', fontSize: '1.7rem'}" :content="notice.notice"/>
		</div>
	</div>
</template>

<script>
	import MarkdownItVue from 'markdown-it-vue'

	export default {
		name: 'ViewNotice',
		components: {
			MarkdownItVue
		},
		props: {
			notice: {
				type: Object
			}
		}
	}
</script>

<style lang="scss" scoped>
	.notice {
		border-radius: 1em;
		min-height: 200px;
		line-height: 22px;
		background: repeating-linear-gradient(
				transparent, transparent 20px, #ccf 22px
		),
		repeating-linear-gradient(
				90deg,
				transparent, transparent 20px, #ccf 22px
		);
	}
</style>