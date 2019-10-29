<?php

namespace api\modules\v1\controllers;

use yii\db\Query;

class PostController extends ApiController
{
	public $modelClass = 'common\models\Post';

	public function actionList()
	{
		$model = (new Query())->from('post')
			->select([
				'id' => 'id',
				'post' => 'post',
				'order_no' => 'order_no'
			])
			->orderBy(['post' => SORT_ASC])
			->all();

		return ['posts' => $model];
	}
}