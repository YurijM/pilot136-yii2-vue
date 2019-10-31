<?php

namespace common\models;

use Yii;

/**
 * This is the model class for table "staff".
 *
 * @property int $id
 * @property string $family
 * @property string $name
 * @property string $patronymic
 *
 * @property PostStaff[] $postStaff
 * @property Post[] $posts
 */
class Staff extends \yii\db\ActiveRecord
{
    /**
     * {@inheritdoc}
     */
    public static function tableName()
    {
        return 'staff';
    }

    /**
     * {@inheritdoc}
     */
    public function rules()
    {
        return [
            [['family', 'name', 'patronymic'], 'required'],
            [['family', 'name', 'patronymic'], 'string', 'max' => 32],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'family' => 'Family',
            'name' => 'Name',
            'patronymic' => 'Patronymic',
        ];
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPostStaff()
    {
        return $this->hasMany(PostStaff::className(), ['staff_id' => 'id']);
    }

    /**
     * @return \yii\db\ActiveQuery
     */
    public function getPosts()
    {
        return $this->hasMany(Post::className(), ['id' => 'post_id'])->viaTable('post_staff', ['staff_id' => 'id']);
    }
}
