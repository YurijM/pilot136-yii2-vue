<?php

namespace api\modules\v1\controllers;

use Yii;
use common\models\User;

class UserController extends ApiController
{
	public $modelClass = 'common\models\User';

	const USER_ABSENT = -1;
	const PASSWORD_WRONG = -2;
	const USER_NOT_ADMIN = -3;

	public function actionCheck()
	{
		$user = Yii::$app->getRequest()->getQueryParams();

		$model = User::findOne(['username' => $user['name']]);

		if ($model == null)
			return self::USER_ABSENT;

		if (! $model->validatePassword($user['password']))
			return self::PASSWORD_WRONG;

		if ($model->role != User::ROLE_ADMIN)
			return self::USER_NOT_ADMIN;

		return $model;
	}
}


