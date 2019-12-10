<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%certificate}}`.
 */
class m191210_075636_create_certificate_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%certificate}}', [
			'id' => $this->primaryKey(),
			'title' => $this->string(256)->notNull(),
			'file' => $this->string(64)->notNull(),
		]);
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->dropTable('{{%certificate}}');
	}
}
