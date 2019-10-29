<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "requisite".
 *
 * @property int $id
 * @property string $requisite
 * @property string $value
 */
class Requisite extends \yii\db\ActiveRecord
{
	/**
	 * {@inheritdoc}
	 */
	public static function tableName()
	{
		return 'requisite';
	}

	/**
	 * {@inheritdoc}
	 */
	public function rules()
	{
		return [
			[['requisite', 'value'], 'required'],
			[['requisite', 'value'], 'string', 'max' => 32],
			[['requisite'], 'unique'],
		];
	}

	/**
	 * {@inheritdoc}
	 */
	public function attributeLabels()
	{
		return [
			'id' => 'ID',
			'requisite' => 'Requisite',
			'value' => 'Value',
		];
	}
}
