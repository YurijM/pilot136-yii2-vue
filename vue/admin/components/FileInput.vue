<template>
  <div>
    <div v-if="isEdit">
        <div class="d-flex align-items-baseline">
          <div class="col-form-label-sm font-weight-bold mr-4">
            Текущий файл
          </div>

          <div>{{doc.fileName}}</div>
        </div>
    </div>

    <b-form-group
      :state="stateFile"
      :label="(isEdit ? 'Заменить на новый файл' : 'Файл')"
      label-for="inputFile"
      label-size="sm"
      label-class="font-weight-bold"
      invalid-feedback="Файл обязательно должен быть выбран"
    >
      <b-form-file
        id="inputFile"
        v-model="doc.file"
        :accept="accept"
        browse-text="Выбор файла"
        :state="stateFile"
        placeholder="Выберите файл или перетащите его сюда..."
        drop-placeholder="Перетащите файл сюда..."
      />
    </b-form-group>
  </div>
</template>

<script>
	export default {
		name: 'file-input',
		props: {
			isEdit: Boolean,
			doc: Object,
			stateFile: Boolean,
      accept: String
		}
	}
</script>

<style lang="scss" scoped>

</style>
