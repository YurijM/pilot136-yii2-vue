<?php

namespace api\modules\v1\controllers;

use Yii;
use common\models\Post;

class PostController extends ApiController
{
	public $modelClass = 'common\models\Post';

	public function actionList()
	{
		$posts = Post::find()->orderBy('post');

		return $posts;
	}
}


