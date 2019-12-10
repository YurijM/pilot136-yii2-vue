<?php

namespace api\modules\v1\controllers;

use common\models\Finance;
use Yii;
use yii\helpers\BaseFileHelper;

class FinanceController extends ApiController
{
	const PATH_TO_FINANCES = '@frontend/web/downloads/finances';
	public $modelClass = 'common\models\Finance';

	public function actionList()
	{
		return Finance::find()->all();
	}

	public function actionAdd()
	{
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$loadResult = $this->loadFile($_FILES['file'], $params['year'], $params['quarter']);

		if ($loadResult['result'] === '') {
			$finance = new Finance();
			$finance->title = $params['title'];
			$finance->year = $params['year'];
			$finance->quarter = $params['quarter'];
			$finance->file = $loadResult['fileName'];

			if (!$finance->save()) {
				$result = 'Ошибка при сохранении в БД документа "' . $finance->title . '"';
			}
		} else {
			$result = $loadResult['result'];
		}

		return compact(['finance', 'result']);
	}

	public function actionEdit()
	{
		$result = '';
		$deleteResult = '';
		$loadResult = null;

		$params = Yii::$app->getRequest()->getBodyParams();

		$finance = Finance::findOne($params['id']);

		if ($_FILES) {
			$deleteResult = $this->deleteFile($params['fileName']);

			if ($deleteResult === '') {
				$loadResult = $this->loadFile($_FILES['file'], $params['year'], $params['quarter']);

				if ($loadResult['result'] === '') {
					$finance->file = $loadResult['fileName'];
				}
			}
		}

		if ((is_null($loadResult) and $deleteResult === '') or $loadResult['result'] === '') {
			$finance->title = $params['title'];
			$finance->year = $params['year'];
			$finance->quarter = $params['quarter'];

			if (!$finance->save()) {
				$result = 'Ошибка при обновлении документа "' . $finance->title . '"';
			}
		} elseif (!is_null($loadResult)) {
			$result = $loadResult['result'];
		} else {
			$result = $deleteResult;
		}

		return compact(['finance', 'result']);
	}

	public function actionRemove() {
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$finance = Finance::findOne($params['id']);
		$result = $this->deleteFile($finance->file);

		if ($result === '') {
			if (!$finance->delete()) {
				$result = 'Ошибка при удалении записи из таблицы finance (' . $finance->id . ')';
			}
		}

		return $result;
	}

	protected function loadFile($file, $year, $quarter)
	{
		$result = '';

		$path = Yii::getAlias(self::PATH_TO_FINANCES);
		BaseFileHelper::createDirectory($path);

		$ext = substr($file['name'], strrpos($file['name'], '.'));
		//$now = Yii::$app->formatter->asTimestamp(date('Y-m-d h:i:s'));
		$now = date('Ymdhis');
		$fileName = ($year > Yii::$app->params['noneYear'] ? '-' . $year : '');
		$fileName = ($quarter > Yii::$app->params['noneQuarter'] ? '-' . $quarter : '') . $fileName;
		$fileName = 'finance-' . $fileName . '-' . $now . $ext;
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
		$path = Yii::getAlias(self::PATH_TO_FINANCES);
		$file = $path . DIRECTORY_SEPARATOR . $fileName;

		if (!unlink($file)) {
			$result = 'Ошибка при удалении файла ' . $file;
		}

		return $result;
	}
}