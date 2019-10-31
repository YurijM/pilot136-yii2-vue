<?php

namespace api\modules\v1\controllers;

use common\models\PostStaff;
use common\models\Staff;
use Yii;
use yii\db\Query;

class StaffController extends ApiController
{
	public function actionList()
	{
		$params = Yii::$app->getRequest()->getQueryParams();

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
			->offset($params['start'])
			->limit($params['limit'])
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
			$result = addPosts($params['posts'], $staff->id);
		} else {
			$result = 'Ошибка записи в таблицу staff (' +
				$params['family'] + ' ' + $params['name'] + $params['patronymic'] + ')';
		}
		return $result;
	}

	public function actionRemove()
	{
		$result = '';
		$params = Yii::$app->getRequest()->getQueryParams();

		if (PostStaff::deleteAll('staff_id = ' + $params['staff_id']) > 0) {
			if (Staff::deleteAll($params['staff_id']) == 0) {
				$result = 'Ошибка удаления из таблицы staff (staff_id = ' + $params['staff_id'] + ')';
			}
		} else {
			$result = 'Ошибка удаления из таблицы post_staff (staff_id = ' + $params['staff_id'] + ')';
		}

		return $result;
	}

	public function actionEdit()
	{
		$result = '';
		$params = Yii::$app->getRequest()->getBodyParams();

		$staff = Staff::findOne($params['staff_id']);
		$staff->family = $params['family'];
		$staff->name = $params['name'];
		$staff->patronymic = $params['patronymic'];

		if ($staff->save()) {
			PostStaff::deleteAll('staff_id = ' + $params['staff_id']);

			$result = addPosts($params['posts'], $staff->id);

			if (Staff::deleteAll($params['staff_id']) == 0) {
				$result = 'Ошибка удаления из таблицы staff (staff_id = ' + $params['staff_id'] + ')';
			} else {
				$result = 'Ошибка удаления из таблицы post_staff (staff_id = ' + $params['staff_id'] + ')';
			}
		}
	}

	public function addPosts($posts, $staff_id) {
		$result = '';

		foreach ($posts as $post_id) {
			$post = new PostStaff();
			$post->staff_id = $staff_id;
			$post->post_id = $post_id;

			if (!$post->save()) {
				$result = 'Ошибка записи в таблицу post_staff (' +
					'staff_id = ' + $staff_id +
					', post_id = ' + $post + ')';
				break;
			}
		}

		return $result;
	}
}
