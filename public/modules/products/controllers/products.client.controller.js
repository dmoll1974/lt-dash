'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Products',
	function($scope, $rootScope, $stateParams, $location, Authentication, Products) {
		$scope.authentication = Authentication;

		// Create new Product
		$scope.create = function() {
			// Create new Product object
			var product = {};
            product.name = this.name;
            product.description = this.description;


            Products.create(product).success(function(product){


                $location.path('browse/' + product.name);

                Products.fetch().success(function(products){
                    $scope.products = Products.items;

                });

                // Clear form fields
                $scope.name = '';
                $scope.description = '';

            });


//			}, function(errorResponse) {
//				$scope.error = errorResponse.data.message;
//			});
		};

		// Remove existing Product
		$scope.remove = function(product) {
			if ( product ) { 
				product.$remove();

				for (var i in $scope.products) {
					if ($scope.products [i] === product) {
						$scope.products.splice(i, 1);
					}
				}
			} else {
				$scope.product.$remove(function() {
					$location.path('products');
				});
			}
		};

		// Update existing Product
		$scope.update = function() {
			var product = $scope.product;

			product.$update(function() {
				$location.path('products/' + product._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Products
		$scope.find = function() {
			$scope.products = Products.query();
		};

		// Find existing Product
		$scope.findOne = function() {

            Products.get($stateParams.productName).success(function(product){

                $scope.product = product;

            });

		};

        // Add dashboard to Product
        $scope.addDashboard = function(product) {

            $location.path('/dashboards/create/' + product._id);
        };


    }
]);