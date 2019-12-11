<?php

namespace api\modules\v1\controllers;

use common\models\Overhaul;
use Yii;
use yii\helpers\BaseFileHelper;

class OverhaulController extends ApiController
{
	const PATH_TO_OVERHAULS = '@frontend/web/downloads/overhauls';
	public $modelClass = 'common\models\Overhaul';

	public function actionList()
	{
		return Overhaul::find()->all();
	}

	public function actionAdd()
	{
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$loadResult = $this->loadFile($_FILES['file'], $params['year'], $params['month']);

		if ($loadResult['result'] === '') {
			$overhaul = new Overhaul();
			$overhaul->title = $params['title'];
			$overhaul->year = $params['year'];
			$overhaul->month = $params['month'];
			$overhaul->file = $loadResult['fileName'];

			if (!$overhaul->save()) {
				$result = 'Ошибка при сохранении в БД документа "' . $overhaul->title . '"';
			}
		} else {
			$result = $loadResult['result'];
		}

		return compact(['overhaul', 'result']);
	}

	public function actionEdit()
	{
		$result = '';
		$deleteResult = '';
		$loadResult = null;

		$params = Yii::$app->getRequest()->getBodyParams();

		$overhaul = Overhaul::findOne($params['id']);

		if ($_FILES) {
			$deleteResult = $this->deleteFile($params['fileName']);

			if ($deleteResult === '') {
				$loadResult = $this->loadFile($_FILES['file'], $params['year'], $params['month']);

				if ($loadResult['result'] === '') {
					$overhaul->file = $loadResult['fileName'];
				}
			}
		}

		if ((is_null($loadResult) and $deleteResult === '') or $loadResult['result'] === '') {
			$overhaul->title = $params['title'];
			$overhaul->year = $params['year'];
			$overhaul->month = $params['month'];

			if (!$overhaul->save()) {
				$result = 'Ошибка при обновлении документа "' . $overhaul->title . '"';
			}
		} elseif (!is_null($loadResult)) {
			$result = $loadResult['result'];
		} else {
			$result = $deleteResult;
		}

		return compact(['overhaul', 'result']);
	}

	public function actionRemove() {
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$overhaul = Overhaul::findOne($params['id']);
		$result = $this->deleteFile($overhaul->file);

		if ($result === '') {
			if (!$overhaul->delete()) {
				$result = 'Ошибка при удалении записи из таблицы overhaul (' . $overhaul->id . ')';
			}
		}

		return $result;
	}

	protected function loadFile($file, $year, $month)
	{
		$result = '';

		$path = Yii::getAlias(self::PATH_TO_OVERHAULS);
		BaseFileHelper::createDirectory($path);

		$ext = substr($file['name'], strrpos($file['name'], '.'));
		//$now = Yii::$app->formatter->asTimestamp(date('Y-m-d h:i:s'));
		$now = date('Ymdhis');
		$fileName = ($year > Yii::$app->params['noneYear'] ? '-' . $year : '');
		$fileName = $fileName . ($month > Yii::$app->params['noneMonth'] ? '-' . $month : '');
		$fileName = 'overhaul' . $fileName . '-' . $now . $ext;
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
		$path = Yii::getAlias(self::PATH_TO_OVERHAULS);
		$file = $path . DIRECTORY_SEPARATOR . $fileName;

		if (!unlink($file)) {
			$result = 'Ошибка при удалении файла ' . $file;
		}

		return $result;
	}
}