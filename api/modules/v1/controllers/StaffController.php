<?php

namespace api\modules\v1\controllers;

use common\models\Post;
use common\models\PostStaff;
use common\models\Staff;
use Yii;
use yii\db\Query;

class StaffController extends ApiController
{
	public $modelClass = 'common\models\Staff';

	public function actionList()
	{
		//$params = Yii::$app->getRequest()->getQueryParams();

		$model = (new Query())->from('staff s')
			->select([
				'id' => 's.id',
				'person' => "CONCAT(family, ' ', name, ' ', patronymic)",
				'post_id' => 'p.id',
				'post' => 'p.post'
			])
			->leftJoin('post_staff ps', 'ps.staff_id = s.id')
			->leftJoin('post p', 'p.id = ps.post_id')
			->orderBy([
				'person' => SORT_ASC,
				'p.order_no' => SORT_ASC
			])
			/*->offset($params['start'])
			->limit($params['limit'])*/
			->all();

		return $model;
	}

	public function actionAdd()
	{
		$result = '';
		$params = Yii::$app->getRequest()->getBodyParams();

		$staff = new Staff();
		$staff->family = $params['family'];
		$staff->name = $params['name'];
		$staff->patronymic = $params['patronymic'];

		if ($staff->save()) {
			$postIds = explode(',', $params['postIds']);
			$result = $this->addPosts($postIds, $staff->id);
		} else {
			$result = "Ошибка записи в таблицу staff ({$params['family']} {$params['name']} {$params['patronymic']})";
		}

		return compact(['result', 'staff']);
	}

	public function actionEdit()
	{
		$result = '';
		$posts = '';

		$params = Yii::$app->getRequest()->getBodyParams();

		$staff = Staff::findOne($params['id']);
		$staff->family = $params['family'];
		$staff->name = $params['name'];
		$staff->patronymic = $params['patronymic'];

		if ($staff->save()) {
			PostStaff::deleteAll("staff_id = {$params['id']}");

			$postIds = explode(',', $params['postIds']);
			//$posts = Post::findOne($postIds[0])->post;
			$result = $this->addPosts($postIds, $staff->id);
			if ($result == '') {
				foreach ($postIds as $item) {
					$post = Post::findOne($item);
					if ($posts != '') {
						$posts .= ", {$post->post}";
					} else {
						$posts = $post->post;
					}
				}
			}
		} else {
			$result = "Ошибка записи в таблицу staff ({$params['family']} {$params['name']} {$params['patronymic']})";
		}

		return compact(['result', 'staff', 'posts']);
	}

	public function actionRemove()
	{
		$result = '';
		$params = Yii::$app->getRequest()->getBodyParams();

		if (PostStaff::deleteAll(['staff_id' => $params['id']]) > 0) {
			if (Staff::deleteAll(['id' => $params['id']]) == 0) {
				$result = "Ошибка удаления из таблицы staff (staff_id = {$params['id']})";
			}
		} else {
			$result = "Ошибка удаления из таблицы post_staff (staff_id = ' + {$params['id']})";
		}

		return $result;
	}

	protected function addPosts($posts, $staff_id) {
		$result = '';

		foreach ($posts as $item) {
			$post = new PostStaff();
			$post->staff_id = $staff_id;
			$post->post_id = $item;

			if (!$post->save()) {
				$result = "Ошибка записи в таблицу post_staff (staff_id = {$staff_id}, post_id = {$item})";
				break;
			}
		}

		return $result;
	}
}
