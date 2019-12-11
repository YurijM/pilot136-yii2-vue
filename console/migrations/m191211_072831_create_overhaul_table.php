<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%overhaul}}`.
 */
class m191211_072831_create_overhaul_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%overhaul}}', [
			'id' => $this->primaryKey(),
			'month' => $this->integer()->notNull(),
			'year' => $this->integer()->notNull(),
			'title' => $this->string(256)->notNull(),
			'file' => $this->string(64)->notNull(),
		]);
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->dropTable('{{%overhaul}}');
	}
}
