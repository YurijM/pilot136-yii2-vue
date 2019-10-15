<?php

namespace api\modules\v1\controllers;

use Yii;
use yii\filters\auth\HttpBearerAuth;
use yii\rest\ActiveController;
use yii\web\Response;

class ApiController extends ActiveController
{
	public function init()
	{
		parent::init();
		// отключаем механизм сессий в api
		\Yii::$app->user->enableSession = false;
	}

	public function behaviors()
	{
		$behaviors = parent::behaviors();

		$behaviors['authenticator'] = [
			'class' => HttpBearerAuth::className(), //включаем аутентификацию по токену
			'except' => ['options','login'],
		];

		return $behaviors;

	}

	public function beforeAction($action)
	{
		if (!parent::beforeAction($action))
			return false;

		header("Access-Control-Allow-Origin: *");
		Yii::$app->response->format = Response::FORMAT_JSON;

		return true;
	}
}


