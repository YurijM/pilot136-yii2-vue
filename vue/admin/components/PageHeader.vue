<template>
  <div class="title d-flex text-center justify-content-between align-items-center py-2 px-5">
    <h3 class="mb-0 text-danger">
      {{title}}
      <span v-if="count > perPage" class="small">
        (всего {{count}})
      </span>
    </h3>
    <b-button @click="$emit('onAddNewDoc')" variant="link">{{link}}</b-button>
  </div>
</template>

<script>
	export default {
		name: 'page-header',
    props: {
			title: String,
      count: {
				type: Number,
        default: 0
      },
      perPage: {
        type: Number,
        default: this.appConfig.perPage
      },
      link: String,
      functionName: String
    },
	}
</script>

<style lang="scss" scoped>
  .title {
    background-color: #f3ee52;
    border-bottom: 2px solid #000;
  }
</style>
