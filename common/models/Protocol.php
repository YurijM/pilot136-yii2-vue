<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "protocol".
 *
 * @property int $id
 * @property string $date
 * @property string $title
 * @property string $file
 */
class Protocol extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'protocol';
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
            'date' => 'Date',
            'title' => 'Title',
            'file' => 'File',
        ];
    }
}
