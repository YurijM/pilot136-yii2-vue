<?php

namespace api\modules\v1\controllers;

use common\models\Act;
use Yii;
use yii\helpers\BaseFileHelper;

class ActController extends ApiController
{
	public $modelClass = 'common\models\Act';

	public function actionList() {
		$acts = Act::find()->all();
		$message = 'qwerty';
		return compact('acts', 'message');
	}

	public function actionAdd() {
		$result = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$path = Yii::getAlias('@api/web/downloads/acts');
		BaseFileHelper::createDirectory($path);

		$ext = substr($_FILES['file']['name'], strrpos($_FILES['file']['name'], '.'));
		$now = Yii::$app->formatter->asTimestamp(date('Y-d-m h:i:s'));
		$fileName = 'act-' . $params['year'] . '-' . $now . $ext;
		$file = $path . DIRECTORY_SEPARATOR . $fileName;

		$act = new Act();
		$act->title = $params['title'];
		$act->year = $params['year'];
		$act->file = $fileName;

		// Проверяем загружен ли файл
		if(is_uploaded_file($_FILES['file']['tmp_name'])) {
			// Если файл загружен успешно, перемещаем его
			// из временной директории в конечную
			if (move_uploaded_file($_FILES['file']['tmp_name'], $file)) {
				if (!$act->save()) {
					$result = 'Ошибка при сохранении в БД акта "' . $act->title . '"';
				}
			} else {
				$result = 'Ошибка при сохранении файла "' . $file . '"';
			}
		} else {
			$result = 'Ошибка при загрузке файла "' . $_FILES['file']['name'] . '"';
		}

		return compact(['act', 'result']);
	}
}