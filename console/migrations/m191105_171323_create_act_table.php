<?php

use yii\db\Migration;

/**
 * Handles the creation of table `{{%act}}`.
 */
class m191105_171323_create_act_table extends Migration
{
    /**
     * {@inheritdoc}
     */
    public function safeUp()
    {
        $this->createTable('{{%act}}', [
            'id' => $this->primaryKey(),
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
        $this->dropTable('{{%act}}');
    }
}
