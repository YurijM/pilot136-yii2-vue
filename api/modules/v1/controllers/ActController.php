<?php

namespace api\modules\v1\controllers;

use common\models\Act;
use Yii;
use yii\helpers\BaseFileHelper;

class ActController extends ApiController
{
	const PATH_TO_ACTS = '@frontend/web/downloads/acts';
	public $modelClass = 'common\models\Act';

	public function actionList()
	{
		return Act::find()->all();
	}

	public function actionAdd()
	{
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$loadResult = $this->loadFile($_FILES['file'], $params['year']);

		if ($loadResult['result'] === '') {
			$act = new Act();
			$act->title = $params['title'];
			$act->year = $params['year'];
			$act->file = $loadResult['fileName'];

			if (!$act->save()) {
				$result = 'Ошибка при сохранении в БД акта "' . $act->title . '"';
			}
		} else {
			$result = $loadResult['result'];
		}

		return compact(['act', 'result']);
	}

	public function actionEdit()
	{
		$result = '';
		$deleteResult = '';
		$loadResult = null;

		$params = Yii::$app->getRequest()->getBodyParams();

		$act = Act::findOne($params['id']);

		if ($_FILES) {
			$deleteResult = $this->deleteFile($params['fileName']);

			if ($deleteResult === '') {
				$loadResult = $this->loadFile($_FILES['file'], $params['year']);

				if ($loadResult['result'] === '') {
					$act->file = $loadResult['fileName'];
				}
			}
		}

		if ((is_null($loadResult) and $deleteResult === '') or $loadResult['result'] === '') {
			$act->title = $params['title'];
			$act->year = $params['year'];

			if (!$act->save()) {
				$result = 'Ошибка при обновлении документа "' . $act->title . '"';
			}
		} elseif (!is_null($loadResult)) {
			$result = $loadResult['result'];
		} else {
			$result = $deleteResult;
		}

		return compact(['act', 'result']);
	}

	public function actionRemove() {
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$act = Act::findOne($params['id']);
		$result = $this->deleteFile($act->file);

		if ($result === '') {
			if (!$act->delete()) {
				$result = 'Ошибка при удалении записи из таблицы act (' . $act->id . ')';
			}
		}

		return $result;
	}

	protected function loadFile($file, $year)
	{
		$result = '';

		$path = Yii::getAlias(self::PATH_TO_ACTS);
		BaseFileHelper::createDirectory($path);

		$ext = substr($file['name'], strrpos($file['name'], '.'));
		//$now = Yii::$app->formatter->asTimestamp(date('Y-m-d h:i:s'));
		$now = date('Ymdhis');
		$fileName = 'act-' . $year . '-' . $now . $ext;
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
		$path = Yii::getAlias(self::PATH_TO_ACTS);
		$file = $path . DIRECTORY_SEPARATOR . $fileName;

		if (!unlink($file)) {
			$result = 'Ошибка при удалении файла ' . $file;
		}

		return $result;
	}
}