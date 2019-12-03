<template>
	<b-container>
		<b-row>
			<section class="col-auto">
				<h4 class="font-weight-bold text-center">Объявления</h4>

				<b-list-group>
					<b-list-group-item
						v-for="notice in notices"
						:key="notice.id"
						variant="info"
						href="javascript:void(0)"
						@focus="viewNotice(notice)"
					>
						{{new Date(notice.date).toLocaleDateString()}}
					</b-list-group-item>
				</b-list-group>
			</section>

			<section class="col pt-3">
				<ym-view-notice
					:notice="noticeCurrent"
				/>
			</section>
		</b-row>
	</b-container>
</template>

<script>
	import YmViewNotice from './ViewNotice'

	export default {
		name: "Notice",
		components: {
			YmViewNotice
		},
		data() {
			return {
				notices: null,
				noticeCurrent: null,
			}
		},
		async created() {
			this.notices = this.$store.getters['notice/getNotices'];

			this.noticeCurrent = this.notices[0]
		},
		methods: {
			viewNotice(notice) {
				this.noticeCurrent = notice;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list-group-item-action:focus {
		color: #fff;
		background-color: #007bff;
	}

	.notice {
		border-radius: 1em;
		min-height: 200px;
		line-height: 30px;
		/*background: linear-gradient(#bbb, transparent 1px), linear-gradient(90deg, #bbb, transparent 1px);
		background-size: 20px 20px;
		background-position: center center;*/
		background: repeating-linear-gradient(
				transparent, transparent 20px, #ccf 22px
		),
		repeating-linear-gradient(
				90deg,
				transparent, transparent 20px, #ccf 22px
		);
	}
</style>