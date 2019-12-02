//let config;

/*if (process.env.NODE_ENV === 'production') {
	config = {
		$api_url: 'http://cl07722.tmweb.ru/api/v1/',
		/!*timeoutDuration: 30000,
		someOtherProps: 'xyz'*!/
	};
} else {
	config = {
		$api_url: 'http://pilot136-yii2-vue-api/v1/',
		/!*timeoutDuration: 1000,
		someOtherProps: 'abc'*!/
	};
}*/

const config = {
	//apiUrl: 'http://cl07722.tmweb.ru/api/v1/',
	apiUrl: 'http://pilot136-yii2-vue-api/v1/',
	monthNone: 20,
	quarterNone: 10,
	yearNone: 3000,
	perPage: 10,
	startYear: 2013,
	endYear: 2025,
	mimetypePdf: ['application/pdf'],
	extPdf: ['.pdf'],
	mimetypeImg: ['image/jpeg', 'image/png'],
	extImg: ['.jpg', '.png', '.jpeg']
};

export {config};