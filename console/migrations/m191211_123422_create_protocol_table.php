<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%protocol}}`.
 */
class m191211_123422_create_protocol_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%protocol}}', [
			'id' => $this->primaryKey(),
			'date' => $this->date()->notNull(),
			'title' => $this->string(256)->notNull(),
			'file' => $this->string(64)->notNull(),
		]);
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->dropTable('{{%protocol}}');
	}
}
