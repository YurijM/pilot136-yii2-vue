<?php
use yii\rest\UrlRule;

$params = array_merge(
	require(__DIR__ . '/../../common/config/params.php'),
	require(__DIR__ . '/../../common/config/params-local.php'),
	require(__DIR__ . '/params.php'),
	require(__DIR__ . '/params-local.php')
);

return [
	'id' => 'app-api',
	'basePath' => dirname(__DIR__),
	'language' => 'ru',
	'bootstrap' => ['log'],
	'modules' => [
		'v1' => [
			'basePath' => '@api/modules/v1',
			'class' => 'api\modules\v1\Module'
		]
	],
	'components' => [
		'user' => [
			'identityClass' => 'common\models\User',
			'enableAutoLogin' => false,
		],
		'log' => [
			'traceLevel' => YII_DEBUG ? 3 : 0,
			'targets' => [
				[
					'class' => 'yii\log\FileTarget',
					'levels' => ['error', 'warning'],
				],
			],
		],
		'urlManager' => [
			'enablePrettyUrl' => true,
			'enableStrictParsing' => true,
			'showScriptName' => false,
			//http://yii-api.loc/api/v1/countries
			'rules' => [
				[
					'class' => UrlRule::class,
					'controller' => 'v1/post',
					'extraPatterns' => [
						'GET list' => 'list',
						'POST create' => 'create',
						'DELETE delete' => 'delete'
					],
					'pluralize' => false, //отключение множественного числа
				],
				[
					'class' => UrlRule::class,
					'controller' => 'v1/user',
					'extraPatterns' => [
						'GET check' => 'check',
					],
					'pluralize' => false, //отключение множественного числа
				],
				[
					'class' => UrlRule::class,
					'controller' => 'v1/staff',
					'extraPatterns' => [
						'GET list' => 'list',
					],
					'pluralize' => false, //отключение множественного числа
				]
			],
		]
	],
	'params' => $params,
];



