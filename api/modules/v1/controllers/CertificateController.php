<?php

namespace api\modules\v1\controllers;

use common\models\Certificate;
use Yii;
use yii\helpers\BaseFileHelper;

class CertificateController extends ApiController
{
	const PATH_TO_CERTIFICATES = '@frontend/web/downloads/certificates';
	public $modelClass = 'common\models\Certificate';

	public function actionList()
	{
		return Certificate::find()->all();
	}

	public function actionAdd()
	{
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$loadResult = $this->loadFile($_FILES['file']);

		if ($loadResult['result'] === '') {
			$certificate = new Certificate();
			$certificate->title = $params['title'];
			$certificate->file = $loadResult['fileName'];

			if (!$certificate->save()) {
				$result = 'Ошибка при сохранении в БД документа "' . $certificate->title . '"';
			}
		} else {
			$result = $loadResult['result'];
		}

		return compact(['certificate', 'result']);
	}

	public function actionEdit()
	{
		$result = '';
		$deleteResult = '';
		$loadResult = null;

		$params = Yii::$app->getRequest()->getBodyParams();

		$certificate = Certificate::findOne($params['id']);

		if ($_FILES) {
			$deleteResult = $this->deleteFile($params['fileName']);

			if ($deleteResult === '') {
				$loadResult = $this->loadFile($_FILES['file']);

				if ($loadResult['result'] === '') {
					$certificate->file = $loadResult['fileName'];
				}
			}
		}

		if ((is_null($loadResult) and $deleteResult === '') or $loadResult['result'] === '') {
			$certificate->title = $params['title'];

			if (!$certificate->save()) {
				$result = 'Ошибка при обновлении документа "' . $certificate->title . '"';
			}
		} elseif (!is_null($loadResult)) {
			$result = $loadResult['result'];
		} else {
			$result = $deleteResult;
		}

		return compact(['certificate', 'result']);
	}

	public function actionRemove() {
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$certificate = Certificate::findOne($params['id']);
		$result = $this->deleteFile($certificate->file);

		if ($result === '') {
			if (!$certificate->delete()) {
				$result = 'Ошибка при удалении записи из таблицы certificate (' . $certificate->id . ')';
			}
		}

		return $result;
	}

	protected function loadFile($file)
	{
		$result = '';

		$path = Yii::getAlias(self::PATH_TO_CERTIFICATES);
		BaseFileHelper::createDirectory($path);

		$ext = substr($file['name'], strrpos($file['name'], '.'));
		//$now = Yii::$app->formatter->asTimestamp(date('Y-m-d h:i:s'));
		$now = date('Ymdhis');
		$fileName = 'certificate-' . $now . $ext;
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
		$path = Yii::getAlias(self::PATH_TO_CERTIFICATES);
		$file = $path . DIRECTORY_SEPARATOR . $fileName;

		if (!unlink($file)) {
			$result = 'Ошибка при удалении файла ' . $file;
		}

		return $result;
	}
}