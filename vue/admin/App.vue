<template>
	<b-container class="wrap d-flex flex-column">
		<header class="d-flex align-items-center justify-content-between p-3 bg-dark text-warning">
			<h5 class="text-center">Панель администрирования</h5>
			<div v-if="admin" class="d-flex align-items-center">
				<font-awesome-icon :icon="['fas', 'user-circle']" class="fa-2x"/>
				<span class="pl-3 font-weight-bold">{{admin}}</span>
			</div>
		</header>

		<main class="d-flex flex-grow-1">
			<aside v-if="admin" class="menu bg-secondary w-auto pr-3">
				<ym-admin-menu
					:items="menu"/>
			</aside>

			<article class="w-100">
				<router-view></router-view>
			</article>
		</main>

		<footer class="d-flex align-items-center justify-content-between py-2 px-3 bg-dark text-warning">
			<b-img class="d-block" src="img/logo.png" width="30px"/>
			<h5 class="mb-0">
				Т С Ж&nbsp;&nbsp;"П и л о т"
			</h5>
			<div>
				&copy;&nbsp;2019<span v-if="startYear !== currentYear">-{{currentYear}}</span>
			</div>
		</footer>
	</b-container>
</template>

<script>
	import {mapGetters} from 'vuex'
	import YmAdminMenu from './components/AdminMenu'

	export default {
		name: 'App',
		components: {
			YmAdminMenu
		},
		data() {
			return {
				startYear: 2019,
				currentYear: new Date().getFullYear(),
				menu: [
					{path: '/requisite', icon: 'file-contract', title: 'Реквизиты'},
					{path: '/staff', icon: 'users', title: 'Штат'},
					{path: '/post', icon: 'briefcase', title: 'Должности'},
					{path: '/certificate', icon: 'passport', title: 'Свидетельства и паспорта'},
					{path: '/finance', icon: 'money-bill-alt', title: 'Финансы'},
					{path: '/contract', icon: 'file-contract', title: 'Договоры'},
					{path: '/act', icon: 'file-contract', title: 'Акты'},
					{path: '/protocol', icon: 'file-contract', title: 'Протоколы'},
					{path: '/overhaul', icon: 'tools', title: 'Капитальный ремонт'},
					{path: '/notice', icon: 'ad', title: 'Объявления'},
					{path: '/photo', icon: 'camera-retro', title: 'Фотографии'}
				]
			}
		},
		created() {
			this.menu.sort(this.sortMenu);
			this.menu.push({path: '/logout', icon: 'sign-out-alt', title: 'Выход'},
			)
		},
		computed: {
			...mapGetters('login', [
				'isAdmin'
			]),
			admin() {
				return this.isAdmin
			},
		},
		watch: {
		},
		methods: {
			sortMenu(a, b) {
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
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap {
		min-height: 95vh;
		/*box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);*/
		box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.5);
		background-color: #eee;
		color: #333;
	}

	@media (max-width: 575px) {
		.wrap {
			height: 100%;
		}
	}

	.menu {
		border-right: 3px solid #000;
	}
</style>
