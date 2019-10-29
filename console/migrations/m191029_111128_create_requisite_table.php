<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%requisite}}`.
 */
class m191029_111128_create_requisite_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%requisite}}', [
			'id' => $this->primaryKey(),
			'requisite' => $this->string(32)->notNull()->unique(),
			'value' => $this->string(32)->notNull(),
		]);
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->dropTable('{{%requisite}}');
	}
}
