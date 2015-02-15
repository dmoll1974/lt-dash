'use strict';

//Setting up route
angular.module('products').config(['$stateProvider',
	function($stateProvider) {
		// Products state routing
		$stateProvider.
		state('listProducts', {
			url: '/products',
			templateUrl: 'modules/products/views/list-products.client.view.html'
		}).
		state('createProduct', {
			url: '/products/create',
			templateUrl: 'modules/products/views/create-product.client.view.html'
		}).
		state('viewProduct', {
			url: '/browse/:productId',
			templateUrl: 'modules/products/views/view-product.client.view.html'
		}).
		state('editProduct', {
			url: '/configure/:productId',
			templateUrl: 'modules/products/views/edit-product.client.view.html'
		});
	}
]);