<?php

namespace api\modules\v1\controllers;

use common\models\Contract;
use Yii;
use yii\helpers\BaseFileHelper;

class ContractController extends ApiController
{
	const PATH_TO_CONTRCTS = '@frontend/web/downloads/contracts';
	public $modelClass = 'common\models\Contract';

	public function actionList()
	{
		$contracts = Contract::find()->all();
		return $contracts;
	}

	public function actionAdd()
	{
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$loadResult = $this->loadFile($_FILES['file'], $params['year']);

		if ($loadResult['result'] === '') {
			$contract = new Contract();
			$contract->title = $params['title'];
			$contract->year = $params['year'];
			$contract->file = $loadResult['fileName'];

			if (!$contract->save()) {
				$result = 'Ошибка при сохранении в БД договора "' . $contract->title . '"';
			}
		} else {
			$result = $loadResult['result'];
		}

		return compact(['contract', 'result']);
	}

	public function actionEdit()
	{
		$result = '';
		$deleteResult = '';
		$loadResult = null;

		$params = Yii::$app->getRequest()->getBodyParams();

		$contract = Contract::findOne($params['id']);

		if ($_FILES) {
			$deleteResult = $this->deleteFile($params['fileName']);

			if ($deleteResult === '') {
				$loadResult = $this->loadFile($_FILES['file'], $params['year']);

				if ($loadResult['result'] === '') {
					$contract->file = $loadResult['fileName'];
				}
			}
		}

		if ((is_null($loadResult) and $deleteResult === '') or $loadResult['result'] === '') {
			$contract->title = $params['title'];
			$contract->year = $params['year'];

			if (!$contract->save()) {
				$result = 'Ошибка при обновлении документа "' . $contract->title . '"';
			}
		} elseif (!is_null($loadResult)) {
			$result = $loadResult['result'];
		} else {
			$result = $deleteResult;
		}

		return compact(['contract', 'result']);
	}

	public function actionRemove() {
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$contract = Contract::findOne($params['id']);
		$result = $this->deleteFile($contract->file);

		if ($result === '') {
			if (!$contract->delete()) {
				$result = 'Ошибка при удалении записи из таблицы contract (' . $contract->id . ')';
			}
		}

		return $result;
	}

	protected function loadFile($file, $year)
	{
		$result = '';

		$path = Yii::getAlias(self::PATH_TO_CONTRCTS);
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
		$path = Yii::getAlias(self::PATH_TO_CONTRCTS);
		$file = $path . DIRECTORY_SEPARATOR . $fileName;

		if (!unlink($file)) {
			$result = 'Ошибка при удалении файла ' . $file;
		}

		return $result;
	}
}