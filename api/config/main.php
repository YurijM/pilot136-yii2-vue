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
					'controller' => 'v1/requisite',
					'extraPatterns' => [
						'GET list' => 'list'
					],
					'pluralize' => false, //отключение множественного числа
				],
				[
					'class' => UrlRule::class,
					'controller' => 'v1/post',
					'extraPatterns' => [
						'GET list' => 'list',
						'GET staff-by-post' => 'staff-by-post',
					],
					'pluralize' => false, //отключение множественного числа
				],
				[
					'class' => UrlRule::class,
					'controller' => 'v1/staff',
					'extraPatterns' => [
						'GET list' => 'list',
						'POST add' => 'add',
						'PUT edit' => 'edit',
						'DELETE remove' => 'remove',
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
					'controller' => [
						'v1/act',
						'v1/contract',
						'v1/certificate',
						'v1/finance',
						'v1/overhaul',
						'v1/protocol',
						'v1/report'
					],
					'extraPatterns' => [
						'GET list' => 'list',
						'POST add' => 'add',
						'PUT edit' => 'edit',
						'DELETE remove' => 'remove',
					],
					'pluralize' => false, //отключение множественного числа
				],
				[
					'class' => UrlRule::class,
					'controller' => 'v1/photo',
					'extraPatterns' => [
						'GET list' => 'list',
						'POST add' => 'add',
						'DELETE remove' => 'remove',
					],
					'pluralize' => false, //отключение множественного числа
				],
				[
					'class' => UrlRule::class,
					'controller' => 'v1/notice',
					'extraPatterns' => [
						'GET list' => 'list'
					],
					'pluralize' => false, //отключение множественного числа
				]
			],
		]
	],
	'params' => $params,
];
