<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%post}}`.
 */
class m191025_081438_create_post_table extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%post}}', [
			'id' => $this->primaryKey(),
			'post' => $this->string(64)->unique()->notNull(),
			'order_no' => $this->smallInteger()->notNull()
		]);

		$this->createIndex('idx-post-order_no', '{{%post}}', 'order_no');
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		$this->dropIndex('idx-post-order_no', '{{$post}}');
		$this->dropTable('{{%post}}');
	}
}
