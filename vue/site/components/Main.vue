<template>
	<b-container>
		<div class="animated fadeInDownBig">
			<b-card
				no-body
				class="p-3 mb-3 alert-success"
				body-class="alert-success"
				border-variant="primary"
			>
				<b-card-title class="mb-3 text-center font-weight-bold" title-tag="h3">
					Товарищество собственников жилья "Пилот"
				</b-card-title>
				<b-row>
					<b-col xs="12" md="8" lg="9">
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
					</b-col>
					<b-col class="hidden-xs" md="4" lg="3">
						<b-card-img src="img/house.png" class="rounded-0"></b-card-img>
					</b-col>
				</b-row>
			</b-card>
			<!--<b-card
				class="mb-3 alert-success"
				body-class="alert-success"
				border-variant="primary"
			>
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
			</b-card>-->
		</div>

		<b-card-group deck>
			<div class="card mx-0 animated fadeInRightBig">
				<b-card class="mx-0 mb-0" border-variant="primary" header="Адрес" body-class="alert-info" header-tag="h5"
								header-border-variant="primary"
								header-class="alert-primary font-weight-bold">
					<b-card-text>
						357207 Ставропольский край, г.Минеральные Воды, ул.Анджиевского, д.136.
					</b-card-text>
				</b-card>
			</div>

			<div class="card mx-0 animated fadeInUpBig">
				<b-card
					class="mx-0 mb-0"
					border-variant="primary"
					header="Штат"
					body-class="alert-info"
					header-tag="h5"
				  header-border-variant="primary"
					header-class="alert-primary font-weight-bold"
				>
					<b-card-text text-tag="div">
						<b-row v-for="person in staff" :key="person.post">
							<div class="col-6 text-right">
								<strong>{{person.post}}:</strong>
							</div>
							<div class="col-6 pl-0">
								<div v-for="item in person.staff" :key="item.id">
									{{item.family}} {{item.name[0]}}. {{item.patronymic[0]}}.
								</div>
							</div>
						</b-row>
					</b-card-text>
				</b-card>
			</div>

			<div class="card mx-0 animated fadeInLeftBig">
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