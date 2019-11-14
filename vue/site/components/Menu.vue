<template>
	<b-navbar class="mb-0 px-0 py-3" toggleable="sm" :style="{backgroundColor: background, fontSize: fontSize}">
		<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

		<b-collapse id="nav-collapse" is-nav>
			<b-navbar-nav>
				<b-nav-item exact-active-class="active" to="/">Главная</b-nav-item>
				<b-nav-item exact-active-class="active" to="/docs">Документы</b-nav-item>
				<b-nav-item exact-active-class="active" to="/notice">Объявления</b-nav-item>
				<b-nav-item exact-active-class="active" to="/photo">Фотографии</b-nav-item>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
	export default {
		name: 'Menu',
		props: {
			background: {
				type: String,
			},
			fontSize: {
				type: String
			}
		},
	}
</script>

<style lang="scss" scoped>
	.navbar {
		min-height: 0;
	}

	.navbar-nav > li > a {
		padding-top: 0;
		padding-bottom: 0;
	}

	/*.nav-link {
		padding: 0 !important;
	}*/

	.nav-link, .nav-subitem {
		color: #0066d0 !important;
		padding-left: .5em !important;
		outline: none;

		&:hover {
			color: #333 !important;
		}

		&.active {
			color: #000080 !important;
		}
	}

	.nav-link {
		padding-right: .5em !important;
	}

	.dropdown-menu .nav-link {
		font-size: initial !important;
	}
</style>
