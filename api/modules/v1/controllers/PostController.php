<?php

namespace api\modules\v1\controllers;

use common\models\Post;
use common\models\PostStaff;
use Yii;
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

	public function actionStaffByPost()
	{
		$staff = [];
		$posts = Post::find()->orderBy('order_no ASC')->all();

		foreach ($posts as $post) {
			$staffByPost = Post::findOne(['id' => $post->id])
				->getStaff()
				->orderBy('family ASC, name ASC, patronymic ASC')
				->all();
			$staff[] = ['post' => $post->post, 'staff' =>  $staffByPost];
			//$staff[$post->post] = $staffByPost;
		}

		return $staff;

		/*$post = Post::findOne(['id' => Yii::$app->request->get('id')]);
		$staff = $post->getStaff()
			->orderBy('family ASC, name ASC, patronymic ASC')
			->all();

		return compact(['staff', 'post' => $post->post]);*/
	}
}