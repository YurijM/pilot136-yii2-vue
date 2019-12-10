<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "finance".
 *
 * @property int $id
 * @property int $year
 * @property float $period
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
            [['year', 'period', 'title', 'file'], 'required'],
            [['year'], 'integer'],
            [['period'], 'number'],
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
            'period' => 'Period',
            'title' => 'Title',
            'file' => 'File',
        ];
    }
}
