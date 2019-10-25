<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%post_staff}}`.
 * Has foreign keys to the tables:
 *
 * - `{{%post}}`
 * - `{{%staff}}`
 */
class m191025_085149_create_junction_table_for_post_and_staff_tables extends Migration
{
	/**
	 * {@inheritdoc}
	 */
	public function safeUp()
	{
		$this->createTable('{{%post_staff}}', [
			'post_id' => $this->integer(),
			'staff_id' => $this->integer(),
			'PRIMARY KEY(post_id, staff_id)',
		]);

		// creates index for column `post_id`
		$this->createIndex(
			'{{%idx-post_staff-post_id}}',
			'{{%post_staff}}',
			'post_id'
		);

		// add foreign key for table `{{%post}}`
		$this->addForeignKey(
			'{{%fk-post_staff-post_id}}',
			'{{%post_staff}}',
			'post_id',
			'{{%post}}',
			'id',
			'CASCADE'
		);

		// creates index for column `staff_id`
		$this->createIndex(
			'{{%idx-post_staff-staff_id}}',
			'{{%post_staff}}',
			'staff_id'
		);

		// add foreign key for table `{{%staff}}`
		$this->addForeignKey(
			'{{%fk-post_staff-staff_id}}',
			'{{%post_staff}}',
			'staff_id',
			'{{%staff}}',
			'id',
			'CASCADE'
		);
	}

	/**
	 * {@inheritdoc}
	 */
	public function safeDown()
	{
		// drops foreign key for table `{{%post}}`
		$this->dropForeignKey(
			'{{%fk-post_staff-post_id}}',
			'{{%post_staff}}'
		);

		// drops index for column `post_id`
		$this->dropIndex(
			'{{%idx-post_staff-post_id}}',
			'{{%post_staff}}'
		);

		// drops foreign key for table `{{%staff}}`
		$this->dropForeignKey(
			'{{%fk-post_staff-staff_id}}',
			'{{%post_staff}}'
		);

		// drops index for column `staff_id`
		$this->dropIndex(
			'{{%idx-post_staff-staff_id}}',
			'{{%post_staff}}'
		);

		$this->dropTable('{{%post_staff}}');
	}
}
