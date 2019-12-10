<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "finance".
 *
 * @property int $id
 * @property int $year
 * @property int $quarter
 * @property string $title
 * @property string $file
 */
class Finance extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'finance';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['year', 'quarter', 'title', 'file'], 'required'],
            [['year', 'quarter'], 'integer'],
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
            'year' => 'Year',
            'quarter' => 'Quarter',
            'title' => 'Title',
            'file' => 'File',
        ];
    }
}
