<?php

use yii\db\Migration;

/**
 * Handles adding role to table `{{%user}}`.
 */
class m190124_110300_add_role_column_to_user_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->addColumn('{{%user}}', 'role', $this->integer(4)->defaultValue(\common\models\User::ROLE_USER));
		$this->update('{{%user}}', ['role' => \common\models\User::ROLE_ADMIN], 'username="admin"');
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->dropColumn('{{%user}}', 'role');
	}
}
