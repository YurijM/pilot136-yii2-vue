<template>
	<div>
		<div class="w-100 mx-auto mb-n3" style="border: 1px solid #777"></div>

		<div class="notice w-100 my-5 bg-white mx-auto py-2 px-4 border border-secondary">
			<div class="d-flex justify-content-between text-secondary mt-n5">
				<font-awesome-icon icon="paperclip" class="fa-2x" transform="rotate-300"/>
				<font-awesome-icon icon="paperclip" class="fa-2x" transform="rotate-315"/>
				<font-awesome-icon icon="paperclip" class="fa-2x" transform="rotate-335"/>
			</div>

			<div
				v-if="i === idx"
				class="animated fadeIn slow"
			>
				<div class="d-flex mt-3 mb-2 pb-1 font-weight-bold font-italic border-bottom border-dark">
					<div class="w-75" :style="{fontSize: '1.15em'}">
						{{notice.sign}}
					</div>

					<div class="w-25 text-right" :style="{fontSize: '1.05em'}">
						{{new Date(notice.date).toLocaleDateString()}}
					</div>
				</div>

				<markdown-it-vue :style="{color: '#000080', fontSize: '1.7rem'}" :content="notice.notice"/>
			</div>
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
			idx: {
				type: Number,
				default: -1
			},
			notice: {
				type: Object
			}
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
				}, 1);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.notice {
		border-radius: 1em;
		min-height: 50vh;
		line-height: 22px;
		background: repeating-linear-gradient(
				transparent,
				transparent 20px,
				#ccf 22px
		),
		repeating-linear-gradient(
				90deg,
				transparent,
				transparent 20px,
				#ccf 22px
		);
	}
</style>