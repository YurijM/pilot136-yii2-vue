<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "report".
 *
 * @property int $id
 * @property string $date
 * @property string $title
 * @property string $file
 */
class Report extends \yii\db\ActiveRecord
{
	/**
	 * {@inheritdoc}
	 */
	public static function tableName()
	{
		return 'report';
	}

	/**
	 * {@inheritdoc}
	 */
	public function rules()
	{
		return [
			[['date', 'title', 'file'], 'required'],
			[['date'], 'safe'],
			[['title'], 'string', 'max' => 256],
			[['file'], 'string', 'max' => 64],
		];
	}

	/**
	 * {@inheritdoc}
	 */
	public function attributeLabels()
	{
		return [
			'id' => 'ID',
			'date' => 'Дата',
			'title' => 'Название документа',
			'file' => 'Файл',
		];
	}
}
