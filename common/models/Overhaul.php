<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "overhaul".
 *
 * @property int $id
 * @property int $month
 * @property int $year
 * @property string $title
 * @property string $file
 */
class Overhaul extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'overhaul';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['month', 'year', 'title', 'file'], 'required'],
            [['month', 'year'], 'integer'],
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
            'month' => 'Month',
            'year' => 'Year',
            'title' => 'Title',
            'file' => 'File',
        ];
    }
}
