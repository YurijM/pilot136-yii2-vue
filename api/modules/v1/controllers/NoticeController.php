<?php
namespace api\modules\v1\controllers;

use common\models\Notice;
use yii\db\Query;

class NoticeController extends ApiController
{
	public $modelClass = 'common\models\Notice';

	public function actionList()
	{
		$model = (new Query())->from('notice')
			->select([
				'id' => 'id',
				'notice' => 'notice',
				'sign' => 'sign',
				'date' => 'date'
			])
			->orderBy(['date' => SORT_DESC])
			->all();

		return ['notices' => $model];
	}
}