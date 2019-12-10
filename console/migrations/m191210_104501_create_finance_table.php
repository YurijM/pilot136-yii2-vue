<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%finance}}`.
 */
class m191210_104501_create_finance_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%finance}}', [
			'id' => $this->primaryKey(),
			'year' => $this->integer()->notNull(),
			'period' => $this->float(1)->notNull(),
			'title' => $this->string(256)->notNull(),
			'file' => $this->string(64)->notNull(),
		]);
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->dropTable('{{%finance}}');
	}
}
