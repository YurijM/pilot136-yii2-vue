<?php

namespace api\modules\v1\controllers;

use Yii;
use yii\rest\ActiveController;
use yii\web\Response;

class ApiController extends ActiveController
{
	public function beforeAction($action)
	{
		if (!parent::beforeAction($action))
			return false;

		header("Access-Control-Allow-Origin: *");
		Yii::$app->response->format = Response::FORMAT_JSON;

		return true;
	}
}

