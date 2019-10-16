<?php

namespace api\modules\v1\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\filters\auth\HttpBearerAuth;
use yii\rest\ActiveController;
use yii\web\Response;

class ApiController extends ActiveController
{
	/*public function init()
	{
		parent::init();
		// отключаем механизм сессий в api
		\Yii::$app->user->enableSession = false;
	}*/

	public function actions()
	{
		return [
			'options' => [
				'class' => 'yii\rest\OptionsAction',
			],
		];
	}

	public function behaviors()
	{
		$behaviors = parent::behaviors();

		$behaviors['authenticator'] = [
			'class' => HttpBearerAuth::class(), //включаем аутентификацию по токену
			//'except' => ['options','login'],
		];

		return $behaviors;

		/*$behaviors = parent::behaviors();

		// add CORS filter
		$behaviors['corsFilter'] = [
			'class' => \yii\filters\Cors::class,
			'cors' => [
				'Origin' => ['*'],
				'Access-Control-Request-Method' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
				'Access-Control-Allow-Credentials' => true,
			],
		];

		unset($behaviors['authenticator']);
		$behaviors['authenticator'] = [
			'class' =>  HttpBearerAuth::class,
		];

		$behaviors['access'] = [
			'class' => AccessControl::class,
			'rules' => [
				[
					'allow' => true,
					'roles' => ['@'],
				],
			],
		];

		return $behaviors;*/
	}

	public function beforeAction($action)
	{
		if (!parent::beforeAction($action))
			return false;

		//header("Access-Control-Allow-Origin: *");
		//header("Access-Control-Allow-Headers: *");
		header('Access-Control-Allow-Origin: *');
		header('Access-Control-Allow-Headers: authorization');
		header('Access-Control-Allow-Credentials: true');

		Yii::$app->response->format = Response::FORMAT_JSON;

		return true;
	}
}


