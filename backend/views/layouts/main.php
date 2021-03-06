<?php

/* @var $this \yii\web\View */
/* @var $content string */

use yii\helpers\Html;
use backend\assets\AppAsset;

AppAsset::register($this);
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<html lang="<?= Yii::$app->language ?>">
<head>
    <meta charset="<?= Yii::$app->charset ?>">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php $this->registerCsrfMetaTags() ?>
    <title><?= Html::encode($this->title) ?></title>
    <?php $this->head() ?>
</head>
<body>
<?php $this->beginBody() ?>

<div id="app"></div>

<!--Для хостинга:-->
<?php $this->registerJsFile('admin/js/app-backend.js'); ?>
<!--или-->
<?php /*$this->registerJsFile('backend/web/js/app-backend.js'); */?>

<?php /*$this->registerJsFile('/js/app-backend.js'); */?>

<?php $this->endBody() ?>
</body>
</html>
<?php $this->endPage() ?>
