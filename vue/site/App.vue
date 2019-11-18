<template>
	<b-container class="wrap d-flex flex-column">
		<header>
			<b-img src="img/header.png" fluid-grow alt="ТСЖ 'Пилот'"></b-img>

			<ym-menu background="#dbdbc7" fontSize="1.25em" :items="menu"/>
		</header>

		<main class="content d-flex flex-grow-1">
			<router-view></router-view>
		</main>

		<footer class="d-flex align-items-start justify-content-between pb-2 px-3 bg-secondary text-white">
			<b-img src="img/logo.png" fluid class="align-self-center"/>
			<div class="footer-menu w-75 ml-3">
				<h5 class="footer-title text-center text-white pb-2 my-2 border-bottom">
					Товарищество собственников жилья "Пилот"
				</h5>
				<b-nav justified class="menu-bottom">
					<b-nav-item
						v-for="(item, i) in menuBottom"
						:key="i"
						:to="item.path"
						small
						exact-active-class="active"
						link-classes="px-0 py-2"
					>
						<font-awesome-icon :icon="item.icon" :style="{fontSize: '2rem', marginBottom: '5px'}"/>
						<br>
						{{item.title}}
					</b-nav-item>
				</b-nav>
			</div>
			<div class="align-self-end">
				&copy;&nbsp;{{startYear}}<span v-if="startYear !== currentYear">-{{currentYear}}</span>
			</div>
		</footer>
	</b-container>
</template>

<script>
	import YmMenu from './components/Menu'

	export default {
		name: 'App',
		components: {
			YmMenu
		},
		data() {
			return {
				startYear: 2019,
				currentYear: new Date().getFullYear(),
				menu: [
					{path: '/', title: 'Главная'},
					{path: '/docs', title: 'Документы'},
					{path: '/notice', title: 'Объявления'},
					{path: '/photo', title: 'Фотографии'}
				],
				menuBottom: [
					{path: '/docs', icon: 'file-contract', title: 'Документы'},
					{path: '/notice', icon: 'ad', title: 'Объявления'},
					{path: '/photo', icon: 'camera-retro', title: 'Фотографии'}
				]
			}
		}
	}
</script>

<style lang="scss" scoped>
	header {
		border-bottom: 3px solid #0066d0
	}

	.wrap {
		min-height: 96vh;
		box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.5);
		background-color: #ccdcdc;
		color: #333;
	}

	.content {
		padding: .5em 1em;
	}

	footer {
		border-top: 3px solid #0066d0;

		a {
			outline: none;
			line-height: 1em;
			color: #99e5ff;
			font-size: 1.25rem;

			&:hover {
				background-color: transparent;
				color: #fff; /*#7cc;*/
			}

			&.active {
				background-color: transparent;
				color: #ff7;
			}
		}

		img {
			min-width: 4em;
			max-width: 4em;
		}
	}
</style>