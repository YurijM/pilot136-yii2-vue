<?php

namespace api\modules\v1\controllers;

use yii\db\Query;

class RequisiteController extends ApiController
{
	public function actionList()
	{
		$model = (new Query())->from('requisite')
			->select([
				'id' => 'id',
				'requisite' => 'requisite',
				'value' => 'value'
			])
			->orderBy(['requisite' => SORT_ASC])
			->all();

		return ['requisites' => $model];
	}
}
