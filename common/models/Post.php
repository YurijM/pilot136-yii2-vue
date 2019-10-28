<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "post".
 *
 * @property int $id
 * @property string $post
 * @property int $order_no
 *
 * @property PostStaff[] $postStaff
 * @property Staff[] $staff
 */
class Post extends \yii\db\ActiveRecord
{
	/**
	 * {@inheritdoc}
	 */
	public static function tableName()
	{
		return 'post';
	}

	/**
	 * {@inheritdoc}
	 */
	public function rules()
	{
		return [
			[['post', 'order_no'], 'required'],
			[['order_no'], 'integer'],
			[['post'], 'string', 'max' => 64],
			[['post'], 'unique'],
		];
	}

	/**
	 * {@inheritdoc}
	 */
	public function attributeLabels()
	{
		return [
			'id' => 'ID',
			'post' => 'Post',
			'order_no' => 'Order No',
		];
	}

	/**
	 * @return \yii\db\ActiveQuery
	 */
	public function getPostStaff()
	{
		return $this->hasMany(PostStaff::class, ['post_id' => 'id']);
	}

	/**
	 * @return \yii\db\ActiveQuery
	 */
	public function getStaff()
	{
		return $this->hasMany(Staff::class, ['id' => 'staff_id'])->viaTable('post_staff', ['post_id' => 'id']);
	}
}
