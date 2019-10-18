<template>
	<b-nav vertical>
    <b-nav-item
      v-for="(item, i) in items" :key="i"
      exact-active-class="active"
      :to="item.path"
      link-classes="d-flex align-items-center"
    >
      <font-awesome-icon :icon="item.icon" size="lg" class="mr-3 text-warning" />
	    <div>{{item.title}}</div>
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
			background-color: inherit;
		}

		&.active {
			color: #ff0 !important;
			background-color: inherit;
		}
	}
</style>
