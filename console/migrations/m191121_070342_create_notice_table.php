<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%notice}}`.
 */
class m191121_070342_create_notice_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%notice}}', [
			'id' => $this->primaryKey(),
			'sign' => $this->string(128),
			'notice' => $this->text(),
			'date' => $this->date()->notNull(),
		]);

		$this->createIndex(
			'idx-notice-date',
			'notice',
			'date'
		);
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->dropIndex('idx-notice-date', '{{%notice}}');
		$this->dropTable('{{%notice}}');
	}
}
