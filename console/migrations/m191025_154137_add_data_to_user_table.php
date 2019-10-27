<?php

use yii\db\Migration;
use common\models\User;

/**
 * Class m191025_154137_add_data_to_user_table
 */
class m191025_154137_add_data_to_user_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$user = new User();

		$user->username = 'admin';
		$user->email = 'admin@mail.ru';
		$user->status = User::STATUS_ACTIVE;
		$user->generateAuthKey();
		$user->setPassword('admin');

		$user->save();
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->delete('user', ['user' => 'admin']);
	}

	/*
	// Use up()/down() to run migration code without a transaction.
	public function up()
	{

	}

	public function down()
	{
			echo "m191025_154137_add_data_to_user_table cannot be reverted.\n";

			return false;
	}
	*/
}
