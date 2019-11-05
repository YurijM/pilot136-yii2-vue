<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "act".
 *
 * @property int $id
 * @property int $year
 * @property string $title
 * @property string $file
 */
class Act extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'act';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['year', 'title', 'file'], 'required'],
            [['year'], 'integer'],
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
            'title' => 'Title',
            'file' => 'File',
        ];
    }
}
