'use strict';

module.exports = {
	app: {
		title: 'lt-dash',
		description: 'Performance test dashboard',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
    graphiteHost : 'http://graphite.klm.com',
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
                'public/css/bootstrap.css',
                'public/css/style.css',
                'public/lib/font-awesome/css/font-awesome.css',

				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/angular-material/angular-material.min.css',
                'public/lib/ng-table/dist/ng-table.css',
                'public/lib/ng-tags-input/ng-tags-input.css'
			],
			js: [
				'public/lib/angular/angular.js',
                'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-animate/angular-animate.js',
                'public/lib/angular-aria/angular-aria.js',
                'public/lib/angular-material/angular-material.js',
                'public/lib/ng-table/dist/ng-table.js',
                'public/lib/ng-tags-input/ng-tags-input.js',
                'public/lib/underscore/underscore.js',
                'public/lib/angular-modal-service/dst/angular-modal-service.min.js',
                //'public/lib/jquery/dist/jquery.js',
                'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js',
                'public/lib/highstock-release/highstock.js',
                //'http://code.highcharts.com/stock/highstock.js',
                'public/lib/highcharts-ng/dist/highcharts-ng.js',
                //'https://rawgit.com/pablojim/highcharts-ng/master/src/highcharts-ng.js'

			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
