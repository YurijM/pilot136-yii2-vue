<template>
  <div>
    <div v-if="isEdit">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <div class="d-flex align-items-baseline">
          <div class="col-form-label-sm font-weight-bold mr-4">
            {{typeDoc}}
          </div>

          <div>{{doc.fileName}}</div>
        </div>

        <div class="justify-content-right">
          <b-button size="sm" pill variant="danger" @click="$emit('onDeleteFile')">
            <font-awesome-icon class="text-light" icon="minus-circle"/>
            Заменить файл
          </b-button>
        </div>
      </div>

      <!--<div class="font-italic text-primary border-top border-primary small pt-1">
        Чтобы заменить существующий файл, сначала надо его удалить, а потом загрузить новый
      </div>-->
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
			stateFile: Boolean,
      accept: String
		}
	}
</script>

<style lang="scss" scoped>

</style>
