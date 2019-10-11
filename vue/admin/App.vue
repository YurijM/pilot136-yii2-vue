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
			<b-img class="d-block" src="/logo.png" width="30px"/>
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
			this.menu.push({path: '/admin/logout', icon: 'sign-out-alt', title: 'Выход'},
			)
		},
		computed: {
			admin() {
				return true; // this.$store.getters['auth/getAdmin']
			},
			info() {
				return false; // this.$store.getters.getInfo.message
			}
		},
		watch: {
			info(message) {
				if (message) {
					const h = this.$createElement;
					// Create the message
					const vNodesMsg = h(
						'div',
						{class: ['d-flex', 'w-100', 'py-1']},
						[
							h('div', {class: ['fa-2x', 'pr-3']}, [
								h('fa', {props: {icon: 'exclamation-circle'}})
							]),
							h('div', message),
						]
					);
					// Pass the vNodes as an array for message and title
					this.$bvToast.toast([vNodesMsg], {
						headerClass: ['d-none'],
						solid: true,
						toaster: 'b-toaster-top-center',
						//variant: this.$store.getters.getInfo.type,
						toastClass: 'mx-auto'
					});
				}
			}
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

<style>
	/* Bootstrap 4 */
	.col, [class*=col-] {
		padding-right: 5px !important;
		padding-left: 5px !important;
	}

	.form-group label {
		font-size: 90% !important;
	}

	.form-control, .custom-select, .btn {
		font-size: 1em !important;
	}

	/* Сайт */
	html, body {
		min-height: 100vh;
	}

	html {
		font-size: 10px;
	}

	body {
		font-family: Roboto, 'Open Sans', sans-serif !important;
		background-color: #cbd9e0 !important;
		font-size: 62.5%;
	}

	@media (max-width: 575px) {
		body {
			font-size: 1.2rem !important;
		}
		h1 {
			font-size: 2.5rem
		}
		h2 {
			font-size: 2.25rem
		}
		h3 {
			font-size: 2rem
		}
		h4 {
			font-size: 1.75rem
		}
		h5 {
			font-size: 1.5rem
		}
		h6 {
			font-size: 1.25rem
		}
	}

	@media (min-width: 576px) {
		body {
			font-size: 1.3rem !important;
		}
		h1 {
			font-size: 2.6rem !important
		}
		h2 {
			font-size: 2.35rem !important
		}
		h3 {
			font-size: 2.1rem !important
		}
		h4 {
			font-size: 1.85rem !important
		}
		h5 {
			font-size: 1.6rem !important
		}
		h6 {
			font-size: 1.35rem !important
		}
	}

	@media (min-width: 768px) {
		body {
			font-size: 1.4rem !important;
		}
		h1 {
			font-size: 2.7rem !important
		}
		h2 {
			font-size: 2.45rem !important
		}
		h3 {
			font-size: 2.2rem !important
		}
		h4 {
			font-size: 1.95rem !important
		}
		h5 {
			font-size: 1.7rem !important
		}
		h6 {
			font-size: 1.45rem !important
		}
	}

	@media (min-width: 992px) {
		body {
			font-size: 1.5rem !important;
		}
		h1 {
			font-size: 2.8rem !important
		}
		h2 {
			font-size: 2.55rem !important
		}
		h3 {
			font-size: 2.3rem !important
		}
		h4 {
			font-size: 2.05rem !important
		}
		h5 {
			font-size: 1.8rem !important
		}
		h6 {
			font-size: 1.55rem !important
		}
	}

	@media (min-width: 1200px) {
		body {
			font-size: 1.6rem !important;
		}
		h1 {
			font-size: 2.9rem !important
		}
		h2 {
			font-size: 2.65rem !important
		}
		h3 {
			font-size: 2.4rem !important
		}
		h4 {
			font-size: 2.15rem !important
		}
		h5 {
			font-size: 1.9rem !important
		}
		h6 {
			font-size: 1.65rem !important
		}
	}

	.wrap {
		min-height: 100vh;
		background-color: #ddd;
		box-shadow: 0 0 15px rgba(0, 0, 0, .75);
	}

	header {
		border-bottom: 2px solid #0066d0;
	}

	.menu {
		border-right: 2px solid #0066d0;
	}
</style>

<style scoped>
	/* Страница */
	.list-group-item {
		/*background-color: transparent;*/
		padding: .5rem .75rem;
		transition: background 0.3s, color 0.3s;
	}

	.list-group-item:last-child {
		margin-bottom: .5rem;
	}

	/*.list-group-item a {
		display: block;
		background-color: transparent;
		color: inherit;
	}*/

	/*.list-group-item.active a {
		color: yellow;
	}*/

	/*.list-group-item.active:hover {
		background-color: #007bff;
	}*/

	a {
		text-decoration: none !important;
		outline: none !important;
	}

	.slide-enter{

	}

	.slide-enter-active{
		animation: slideIn 0.5s;
	}

	.slide-enter-to{

	}

	.slide-leave{

	}

	.slide-leave-active{
		animation: slideOut 0.5s;
	}

	.slide-leave-to{

	}

	@keyframes slideIn{
		from{transform: rotateY(90deg);}
		to{transform: rotateY(0deg);}
	}

	@keyframes slideOut{
		from{transform: rotateY(0deg);}
		to{transform: rotateY(90deg);}
	}

	footer {
		background-color: #777;
		border-top: 2px solid #0066d0;
	}

	footer a {
		color: #ddd;
	}

	footer a:hover {
		color: #ff0;
		text-decoration: none;
	}
</style>