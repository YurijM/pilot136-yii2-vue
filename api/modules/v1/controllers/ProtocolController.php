<?php

namespace api\modules\v1\controllers;

use common\models\Protocol;
use Yii;
use yii\helpers\BaseFileHelper;

class ProtocolController extends ApiController
{
	const PATH_TO_PROTOCOLS = '@frontend/web/downloads/protocols';
	public $modelClass = 'common\models\Protocol';

	public function actionList()
	{
		return Protocol::find()->all();
	}

	public function actionAdd()
	{
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$loadResult = $this->loadFile($_FILES['file'], $params['date']);

		if ($loadResult['result'] === '') {
			$protocol = new Protocol();
			$protocol->title = $params['title'];
			$protocol->date = $params['date'];
			$protocol->file = $loadResult['fileName'];

			if (!$protocol->save()) {
				$result = 'Ошибка при сохранении в БД протокола "' . $protocol->title . '"';
			}
		} else {
			$result = $loadResult['result'];
		}

		return compact(['protocol', 'result']);
	}

	public function actionEdit()
	{
		$result = '';
		$deleteResult = '';
		$loadResult = null;

		$params = Yii::$app->getRequest()->getBodyParams();

		$protocol = Protocol::findOne($params['id']);

		if ($_FILES) {
			$deleteResult = $this->deleteFile($params['fileName']);

			if ($deleteResult === '') {
				$loadResult = $this->loadFile($_FILES['file'], $params['date']);

				if ($loadResult['result'] === '') {
					$protocol->file = $loadResult['fileName'];
				}
			}
		}

		if ((is_null($loadResult) and $deleteResult === '') or $loadResult['result'] === '') {
			$protocol->title = $params['title'];
			$protocol->date = $params['date'];

			if (!$protocol->save()) {
				$result = 'Ошибка при обновлении документа "' . $protocol->title . '"';
			}
		} elseif (!is_null($loadResult)) {
			$result = $loadResult['result'];
		} else {
			$result = $deleteResult;
		}

		return compact(['protocol', 'result']);
	}

	public function actionRemove() {
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$protocol = Protocol::findOne($params['id']);
		$result = $this->deleteFile($protocol->file);

		if ($result === '') {
			if (!$protocol->delete()) {
				$result = 'Ошибка при удалении записи из таблицы protocol (' . $protocol->id . ')';
			}
		}

		return $result;
	}

	protected function loadFile($file, $date)
	{
		$result = '';

		$path = Yii::getAlias(self::PATH_TO_PROTOCOLS);
		BaseFileHelper::createDirectory($path);

		$ext = substr($file['name'], strrpos($file['name'], '.'));
		//$now = Yii::$app->formatter->asTimestamp(date('Y-m-d h:i:s'));
		$now = date('Ymd', $date);
		$fileName = 'protocol-' . $date . '-' . $now . $ext;
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
		$path = Yii::getAlias(self::PATH_TO_PROTOCOLS);
		$file = $path . DIRECTORY_SEPARATOR . $fileName;

		if (!unlink($file)) {
			$result = 'Ошибка при удалении файла ' . $file;
		}

		return $result;
	}
}