<template>
	<b-nav vertical>
    <b-nav-item
      v-for="(item, i) in items" :key="i"
      exact-active-class="active"
      :to="item.path"
    >

      <font-awesome-icon :icon="item.icon" />&nbsp;{{item.title}}
    </b-nav-item>
	</b-nav>
</template>

<script>
	export default {
		name: 'admin-menu',
    props: {
			items: Array
    }
	}
</script>

<style lang="scss" scoped>
	.nav-link {
		color: #eee;
		outline: none;

		&:hover {
			color: #00ffff !important;
		}

		&.active {
			color: #ff0 !important;
		}
	}
</style>
