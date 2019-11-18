<template>
	<b-container>
		<div class="animated fadeInDownBig">
			<b-card class="mb-3" body-class="alert-success" border-variant="primary">
				<b-card-title class="mb-3 text-center font-weight-bold" title-tag="h3">
					Товарищество собственников жилья "Пилот"
				</b-card-title>
				<b-card-text text-tag="div">
					<strong>ТСЖ "Пилот"</strong> зарегистрировано <strong>17 июня 2005 года</strong>.<br>

					Благоустроенный <strong>5</strong>-этажный <strong>100</strong>-квартирный жилой дом. Построен в период с
					<strong>1985г.</strong> по <strong>1988г</strong>.
					<br>

					Общая полезная площадь жилого дома составляет <strong>6127.3 кв.м</strong>, кроме того:
					<ul class="ml-5">
						<li>площадь лестничных клеток составляет <strong>629.2 кв.м</strong>,</li>
						<li>площадь подвального помещения (парикмахерская) - <strong>29.5 кв.м</strong>,</li>
						<li>площадь подвального помещения (магазин) - <strong>282.7 кв.м</strong>,</li>
						<li>площадь помещений, используемых под сараи - <strong>729.1 кв.м</strong>.</li>
					</ul>
					Общий объём жилого дома составляет <strong>32756.0 куб.м</strong>, в т.ч. подвальные помещения - <strong>5054
					куб.м</strong>.
				</b-card-text>
			</b-card>
		</div>

		<b-card-group deck>
			<div class="card animated fadeInRightBig">
				<b-card class="mx-0 mb-0" border-variant="primary" header="Адрес" body-class="alert-info" header-tag="h5"
								header-border-variant="primary"
								header-class="alert-primary font-weight-bold">
					<b-card-text>
						357207 Ставропольский край, г.Минеральные Воды, ул.Анджиевского, д.136.
					</b-card-text>
				</b-card>
			</div>

			<div class="card animated fadeInUpBig">
				<b-card class="mx-0 mb-0" border-variant="primary" header="Штат" body-class="alert-info" header-tag="h5"
				        header-border-variant="primary"
								header-class="alert-primary font-weight-bold">
					<b-card-text text-tag="div">
						<b-row v-for="post in posts" :key="post.id">
							<div class="col-6 text-right">
								<strong>{{post.post}}:</strong>
							</div>
							<div class="col-6 pl-0">
								<div v-for="(item, i) in staffByPost(post.id)" :key="i">
									{{item}}
								</div>
								<!--{{staff}}-->
								<!--{{staff.find(person => person._id === '5d42dbee9c158e265840f13b')}}-->
								<!--{{staff.find(person => person.posts.indexOf(post._id) !== -1).family}}-->
								<!--{{staff.filter(person => {return person.post_id.filter(item => {return item === post.id}).length >
								0})[0].person}}-->
							</div>
						</b-row>
					</b-card-text>
				</b-card>
			</div>

			<div class="card animated fadeInLeftBig">
				<b-card class="mx-0 mb-0" border-variant="primary" header="Реквизиты" body-class="alert-info"
				        header-tag="h5" header-border-variant="primary"
								header-class="alert-primary font-weight-bold">
					<b-card-text text-tag="div">
						<b-row v-for="requisite in requisites" :key="requisite.id">
							<div class="col-6 text-right">
								<strong>{{requisite.requisite}}:</strong>
							</div>
							<div class="col-6 pl-0">
								{{requisite.value}}
							</div>
						</b-row>
					</b-card-text>
				</b-card>
			</div>
		</b-card-group>
	</b-container>
</template>

<script>
	import {mapGetters, mapMutations} from 'vuex'

	export default {
		name: 'Main',
		async mounted() {
			await this.$store.dispatch('requisite/loadRequisites');

			await this.$store.dispatch('post/loadPosts');
			this.$store.commit('post/SORT_POSTS_BY_ORDER');

			const posts = this.$store.getters['post/getPosts'];
			let post;
			for (post in posts) {
				await this.$store.dispatch('post/getStaffByPost', post.id);
			}

			await this.$store.dispatch('staff/loadStaff');
		},
		computed: {
			...mapGetters('requisite', [
				'getRequisites'
			]),
			...mapGetters('post', [
				'getPosts'
			]),
			requisites() {
				return this.getRequisites;
			},
			posts() {
				return this.getPosts;
			}
		},
		methods: {
			staffByPost(id) {
				const staff = this.$store.state.staff.staff.map(el => {if(el.post_id.indexOf(id) > -1) return el.person});
				//console.log('id: ', id);
				//console.log('staff :', staff);
				//return staff
				return staff.map(el => {
					if (el) {
						let person = el.split(' ');
						return person[0] + ' ' + person[1].charAt(0) + '.' + person[2].charAt(0) + '.'
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
</style>