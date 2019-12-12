<?php

namespace api\modules\v1\controllers;

use common\models\Photo;
use Yii;
use yii\helpers\BaseFileHelper;

class PhotoController extends ApiController
{
	const PATH_TO_PHOTOS = '@frontend/web/downloads/photos';
	public $modelClass = 'common\models\Photo';

	public function actionList()
	{
		return Photo::find()->all();
	}

	public function actionAdd()
	{
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$loadResult = $this->loadFile($_FILES['file']);

		if ($loadResult['result'] === '') {
			$photo = new Photo();
			$photo->file = $loadResult['fileName'];

			if (!$photo->save()) {
				$result = 'Ошибка при сохранении в БД фотографии "' . $photo->file . '"';
			}
		} else {
			$result = $loadResult['result'];
		}

		return compact(['photo', 'result']);
	}

	public function actionRemove() {
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$photo = Photo::findOne($params['id']);
		$result = $this->deleteFile($photo->file);

		if ($result === '') {
			if (!$photo->delete()) {
				$result = 'Ошибка при удалении записи из таблицы photo (' . $photo->id . ')';
			}
		}

		return $result;
	}

	protected function loadFile($file)
	{
		$result = '';

		$path = Yii::getAlias(self::PATH_TO_PHOTOS);
		BaseFileHelper::createDirectory($path);

		$ext = substr($file['name'], strrpos($file['name'], '.'));
		$now = date('Ymdhis');
		$fileName = 'photo-' . $now . $ext;
		$fullName = $path . DIRECTORY_SEPARATOR . $fileName;

		// Проверяем загружен ли файл
		if (is_uploaded_file($_FILES['file']['tmp_name'])) {
			// Если файл загружен успешно, перемещаем его
			// из временной директории в конечную
			if (!move_uploaded_file($file['tmp_name'], $fullName)) {
				$result = 'Ошибка при сохранении файла "' . $fullName . '"';
			}
		} else {
			$result = 'Ошибка при загрузке файла "' . $file['name'] . '"';
		}

		return compact(['fileName', 'result']);
	}

	protected function deleteFile($fileName)
	{
		$result = '';
		$path = Yii::getAlias(self::PATH_TO_PHOTOS);
		$file = $path . DIRECTORY_SEPARATOR . $fileName;

		if (!unlink($file)) {
			$result = 'Ошибка при удалении файла ' . $file;
		}

		return $result;
	}
}