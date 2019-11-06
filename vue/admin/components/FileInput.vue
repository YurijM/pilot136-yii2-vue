<template>
  <div>
    <div v-if="isEdit">
      <div class="d-flex">
        <div>
          <div class="col-form-label-sm font-weight-bold">
            {{typeDoc}}
          </div>

          <div>{{doc.fileName}}</div>
        </div>

        <div class="d-flex flex-grow-1 justify-content-center align-items-center">
          <b-button size="sm" pill variant="danger" @click="$emit('onDeleteOldFile')">
            <fa class="text-light" icon="minus-circle"/>
            Удалить файл
          </b-button>
        </div>
      </div>

      <div class="font-italic text-primary border-top border-primary small mt-1 pt-1">
        Чтобы заменить существующий файл, сначала надо его удалить, а потом загрузить новый
      </div>
    </div>

    <b-form-group
      v-else
      :state="stateFile"
      :label="typeDoc"
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
			typeDoc: String,
			doc: Object,
			stateFile: String,
      accept: String
		}
	}
</script>

<style lang="scss" scoped>

</style>
