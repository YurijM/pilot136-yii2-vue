<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "contract".
 *
 * @property int $id
 * @property int $year
 * @property string $title
 * @property string $file
 */
class Contract extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'contract';
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
