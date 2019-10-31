<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%staff}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%post}}`
 */
class m191025_084657_create_staff_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%staff}}', [
			'id' => $this->primaryKey(),
			'family' => $this->string(32)->notNull(),
			'name' => $this->string(32)->notNull(),
			'patronymic' => $this->string(32)->notNull(),
		]);
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->dropTable('{{%staff}}');
	}
}
