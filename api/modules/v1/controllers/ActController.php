<?php

namespace api\modules\v1\controllers;

use common\models\Act;

class ActController extends ApiController
{
	public $modelClass = 'common\models\Act';

	public function actionList() {
		$acts = Act::find()->all();
		$message = 'qwerty';
		return compact('acts', 'message');
	}
}