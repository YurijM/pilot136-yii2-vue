<?php

namespace api\modules\v1\controllers;

use common\models\Report;
use Yii;
use yii\helpers\BaseFileHelper;

class ReportController extends ApiController
{
	const PATH_TO_REPORTS = '@frontend/web/downloads/reports';
	public $modelClass = 'common\models\Report';

	public function actionList()
	{
		return Report::find()->all();
	}

	public function actionAdd()
	{
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$loadResult = $this->loadFile($_FILES['file'], $params['date']);

		if ($loadResult['result'] === '') {
			$report = new Report();
			$report->title = $params['title'];
			$report->date = $params['date'];
			$report->file = $loadResult['fileName'];

			if (!$report->save()) {
				$result = 'Ошибка при сохранении в БД документа "' . $report->title . '"';
			}
		} else {
			$result = $loadResult['result'];
		}

		return compact(['report', 'result']);
	}

	public function actionEdit()
	{
		$result = '';
		$deleteResult = '';
		$loadResult = null;

		$params = Yii::$app->getRequest()->getBodyParams();

		$report = Report::findOne($params['id']);

		if ($_FILES) {
			$deleteResult = $this->deleteFile($params['fileName']);

			if ($deleteResult === '') {
				$loadResult = $this->loadFile($_FILES['file'], $params['date']);

				if ($loadResult['result'] === '') {
					$report->file = $loadResult['fileName'];
				}
			}
		}

		if ((is_null($loadResult) and $deleteResult === '') or $loadResult['result'] === '') {
			$report->title = $params['title'];
			$report->date = $params['date'];

			if (!$report->save()) {
				$result = 'Ошибка при обновлении документа "' . $report->title . '"';
			}
		} elseif (!is_null($loadResult)) {
			$result = $loadResult['result'];
		} else {
			$result = $deleteResult;
		}

		return compact(['report', 'result']);
	}

	public function actionRemove() {
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$report = Report::findOne($params['id']);
		$result = $this->deleteFile($report->file);

		if ($result === '') {
			if (!$report->delete()) {
				$result = 'Ошибка при удалении записи из таблицы report (' . $report->id . ')';
			}
		}

		return $result;
	}

	protected function loadFile($file, $date)
	{
		$result = '';

		$path = Yii::getAlias(self::PATH_TO_REPORTS);
		BaseFileHelper::createDirectory($path);

		$ext = substr($file['name'], strrpos($file['name'], '.'));
		//$now = Yii::$app->formatter->asTimestamp(date('Y-m-d h:i:s'));
		$date = date('Ymd', strtotime($date));
		$now = date('Ymdhis');
		$fileName = 'report-' . $date . '-' . $now . $ext;
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
		$path = Yii::getAlias(self::PATH_TO_REPORTS);
		$file = $path . DIRECTORY_SEPARATOR . $fileName;

		if (!unlink($file)) {
			$result = 'Ошибка при удалении файла ' . $file;
		}

		return $result;
	}
}