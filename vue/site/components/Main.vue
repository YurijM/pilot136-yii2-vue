<template>
	<b-container>
		<div class="animated fadeInDownBig">
			<b-card
				no-body
				class="p-3 mb-2 alert-success"
				body-class="alert-success"
				border-variant="primary"
			>
				<b-card-title
					class="mb-xs-1 mb-xl-0 text-center font-weight-bold"
					title-tag="h4"
				>
					Товарищество собственников жилья "Пилот"
				</b-card-title>

				<b-row class="align-items-center">
					<b-col xs="12" md="9">
						<b-card-text text-tag="div">
							<div class="mb-xs-2 mb-sm-0 mb-xl-2">
								<strong>ТСЖ "Пилот"</strong> зарегистрировано <strong>17 июня 2005 года</strong>.
							</div>

							<div class="mb-xs-2 mb-sm-0 mb-xl-2">
								Благоустроенный <strong>5</strong>-этажный <strong>100</strong>-квартирный жилой дом. Построен в период с
								<strong>1985г.</strong> по <strong>1988г</strong>.
							</div>

							Общая полезная площадь жилого дома составляет <strong>6127.3 кв.м</strong>, кроме того:
							<ul class="ml-5">
								<li>площадь лестничных клеток составляет <strong>629.2 кв.м</strong>,</li>
								<li>площадь подвального помещения (парикмахерская) - <strong>29.5 кв.м</strong>,</li>
								<li>площадь подвального помещения (магазин) - <strong>282.7 кв.м</strong>,</li>
								<li>площадь помещений, используемых под сараи - <strong>729.1 кв.м</strong>.</li>
							</ul>

							<div class="mb-xs-2 mb-sm-0 mb-xl-2">
								Общий объём жилого дома составляет <strong>32756.0 куб.м</strong>, в т.ч. подвальные помещения - <strong>5054
								куб.м</strong>.
							</div>

							<div class="mt-xl-4">
								<strong>Адрес</strong>: 357207 Ставропольский край, г.Минеральные Воды, ул.Анджиевского, д.136.
							</div>
						</b-card-text>
					</b-col>

					<b-col class="hidden-xs pb-xl-3" md="3">
						<b-card-img src="img/house.png" class="rounded-0"></b-card-img>
					</b-col>
				</b-row>
			</b-card>
		</div>

		<b-card-group deck class="mx-0">
			<div class="card col-xs-12 col-sm-7 px-0 ml-0 mr-sm-1 mb-2 animated fadeInRightBig">
				<b-card
					class="mx-0 mb-0"
					border-variant="primary"
					header-tag="header"
					header-class="px-4 py-2 alert-primary border-primary"
					body-class="p-2 alert-info"
				>
					<template v-slot:header>
						<div class="d-flex justify-content-between align-items-center">
							<h5 class="mb-0 font-weight-bold">Штат</h5>
							<font-awesome-icon icon="users" :style="{fontSize: '2.25rem'}"/>
						</div>
					</template>

					<b-card-text text-tag="div">
						<b-row v-for="person in staff" :key="person.post">
							<div class="col-5 text-right">
								<strong>{{person.post}}:</strong>
							</div>
							<div class="col-7 pl-0 d-flex flex-wrap">
								<div class="pr-2" v-for="(item, i) in person.staff" :key="item.id">
									{{item.family}} {{item.name[0]}}. {{item.patronymic[0]}}.{{i < person.staff.length - 1 ? ',' : ''}}
								</div>
							</div>
						</b-row>
					</b-card-text>
				</b-card>
			</div>

			<div class="card col-xs-12 col-sm-5 px-0 ml-sm-1 mr-0 mb-2 animated fadeInLeftBig">
				<b-card
					class="mx-0 mb-0"
					border-variant="primary"
					header-tag="header"
					header-class="px-4 py-2 alert-primary border-primary"
					body-class="p-2 alert-info"
				>
					<template v-slot:header>
						<div class="d-flex justify-content-between align-items-center">
							<h5 class="mb-0 font-weight-bold">Реквизиты</h5>
							<font-awesome-icon icon="th-list" :style="{fontSize: '2.25rem'}"/>
						</div>
					</template>

					<b-card-text text-tag="div">
						<b-row v-for="requisite in requisites" :key="requisite.id">
							<div class="col-5 text-right">
								<strong>{{requisite.requisite}}:</strong>
							</div>
							<div class="col-7 pl-0">
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
	import {mapGetters} from 'vuex'

	export default {
		name: 'Main',
		async mounted() {
			await this.$store.dispatch('requisite/loadRequisites');
			await this.$store.dispatch('post/getStaffByPost');
		},
		computed: {
			...mapGetters('requisite', [
				'getRequisites'
			]),
			...mapGetters('post', [
				'getStaffByPost'
			]),
			requisites() {
				return this.getRequisites;
			},
			staff() {
				return this.getStaffByPost;
			}
		},
	}
</script>

<style lang="scss" scoped>
</style>