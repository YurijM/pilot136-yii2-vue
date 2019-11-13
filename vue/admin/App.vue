<template>
	<b-container class="wrap d-flex flex-column">
		<header class="d-flex align-items-center justify-content-between p-3 bg-dark text-warning">
			<h5 class="text-center">Панель администрирования</h5>
			<div v-if="isLog" class="d-flex align-items-center">
				<font-awesome-icon :icon="['fas', 'user-circle']" class="fa-2x"/>
				<span class="pl-3 font-weight-bold">{{admin}}</span>
			</div>
		</header>

		<main class="d-flex flex-grow-1">
			<aside v-if="isLog" class="menu bg-secondary w-auto pr-3">
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
	import {mapGetters, mapActions} from 'vuex'
	import YmAdminMenu from './components/AdminMenu'

	export default {
		name: 'app',
		components: {
			YmAdminMenu
		},
		data() {
			return {
				startYear: 2019,
				currentYear: new Date().getFullYear(),
				admin: '',
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
		provide: function () {
			return {
				deleteDoc: this.deleteDoc,
			}
		},
		created() {
			document.title = 'ТСЖ "Пилот" - Админка';
			// Конфигурация плагина может быть изменена в любой момент.
			// Просто вызовите метод setOptions и передайте в него объект с настройками.
			/*this.$storage.setOptions({
				prefix: 'ym_',
				driver: 'local',
				//ttl: 60 * 60 * 24 * 1000 // 24 часа
				ttl: 60 * 60 * 1 * 1000 // 1 час
			});*/

			this.menu.sort(this.sortMenu);
			this.menu.push({path: '/logout', icon: 'sign-out-alt', title: 'Выход'});
		},
		computed: {
			...mapGetters('login', [
				'isAdmin',
				'getAdmin'
			]),
			...mapGetters('common', [
				'getInfo'
			]),
			isLog() {
				return this.isAdmin
			},
			info() {
				return this.getInfo.message
			}
		},
		watch: {
			isLog(state) {
				if (state) this.admin = this.getAdmin.name;
			},
			info(message) {
				if (message) {
					const h = this.$createElement;
					// Create the message
					const vNodesMsg = h(
						'div',
						{class: ['d-flex', 'w-100', 'py-1']},
						[
							h('div', {class: ['fa-2x', 'pr-3']}, [
								h('font-awesome-icon', {props: {icon: 'exclamation-circle'}})
							]),
							h('div', message),
						]
					);
					// Pass the vNodes as an array for message and title
					this.$bvToast.toast([vNodesMsg], {
						headerClass: ['d-none'],
						modalClass: ['in'],
						//title: null,
						//noFade: true,
						//noAutoHide: true,
						//autoHideDelay: 10000,
						solid: true,
						//noCloseButton: true,
						toaster: 'b-toaster-top-center',
						variant: this.getInfo.type,
						toastClass: 'mx-auto'
					});
				}
			}
		},
		methods: {
			...mapActions('common', [
				'setInfo'
			]),
			deleteDoc: (page, item, doc) => {
				const h = page.$createElement;
				// Create the message
				const vNodesMsg = h(
					'div',
					{
						class: ['d-flex', 'w-100', 'pb-3'],
						style: {borderBottom: '1px solid #000'}
					},
					[
						h('div', {class: ['fa-2x', 'pr-3']}, [
							h('font-awesome-icon', {props: {icon: 'question-circle'}})
						]),
						h('div',
							`Вы действительно хотите удалить ${doc.name} "${doc.title}"?`),
					]
				);
				page.$bvModal.msgBoxConfirm([vNodesMsg], {
					title: null,
					size: 'sm',
					buttonSize: 'sm',
					okTitle: 'Да',
					cancelTitle: 'Нет',
					bodyClass: ['alert-primary', 'pb-0'],
					modalClass: 'in',
					footerClass: ['alert-primary', 'py-3', 'px-4', 'border-top-0'],
					centered: true
				})
				.then(async (value) => {
					if (Boolean(value)) {
						try {
							await page.removeDoc(item.id)
						} catch (err) {
							console.log(`Remove ${doc.type} Error: `, err);
							await page.$store.dispatch('common/setInfo', {
								type: 'danger',
								message: 'Ошибка при удалении документа (см. в консоли "Remove ' + doc.type + ' Error")'
							}, {root: true});
						}
					}
				})
				.catch(async (err) => {
					console.log(`${doc.type} Modal Error: `, err);
					await page.$store.dispatch('common/setInfo', {
						type: 'danger',
						message: 'Ошибка при создании модального окна (см. в консоли "' + doc.type + ' Modal Error")'
					}, {root: true});
				});
			},
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
