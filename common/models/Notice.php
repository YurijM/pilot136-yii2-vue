<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "notice".
 *
 * @property int $id
 * @property string $sign
 * @property string $notice
 * @property string $date
 */
class Notice extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'notice';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['notice'], 'string'],
            [['date'], 'required'],
            [['date'], 'safe'],
            [['sign'], 'string', 'max' => 128],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'sign' => 'Sign',
            'notice' => 'Notice',
            'date' => 'Date',
        ];
    }
}
