<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%report}}`.
 */
class m210121_184313_create_report_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%report}}', [
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
		$this->dropTable('{{%report}}');
	}
}
