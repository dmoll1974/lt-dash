'use strict';

// Products controller
angular.module('products').controller('ProductsController', ['$scope', '$rootScope', '$stateParams', '$state', '$location', '$modal', 'Products',
	function($scope, $rootScope, $stateParams, $state, $location, $modal, Products) {


        $scope.initCreateForm = function(){

            /* reset form */
            $scope.product = {};
        }
        $scope.product = Products.selected;

        // Create new Product
		$scope.create = function() {
			// Create new Product object
			var product = {};
            product.name = $scope.product.name;
            product.description = $scope.product.description;


            Products.create(product).then(function(product){


                $location.path('browse/' + product.name);

                Products.fetch().success(function(products){
                    $scope.products = Products.items;

                });

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};


		// Edit Product
		$scope.edit = function(productName) {

            $state.go('editProduct', {productName: productName})
        };

        $scope.update = function() {

            Products.update($scope.product).then(function (product) {

                /* Refresh sidebar */
                Products.fetch().success(function(product){
                    $scope.products = Products.items;

                });

                $state.go('viewProduct',{"productName":$scope.product.name});

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

                Products.selected = product;
                $scope.product = Products.selected;

            });

		};

        // Add dashboard to Product
        $scope.addDashboard = function(product) {

            $location.path('/dashboards/create/' + product._id);
        };

        $scope.cancel = function () {

            Products.selected = {};

            /* reset form*/
            $scope.productForm.$setPristine();


            if ($rootScope.previousStateParams)
                $state.go($rootScope.previousState, $rootScope.previousStateParams);
            else
                $state.go($rootScope.previousState);


        }


        $scope.openDeleteProductModal = function (size) {



        var modalInstance = $modal.open({
            templateUrl: 'deleteProduct.html',
            controller: 'DeleteProductModalInstanceCtrl',
            size: size//,
        });

        modalInstance.result.then(function (productName) {

            Products.delete(productName).success(function(product){

                /* reset slected Product*/

                Products.selected = {};

                /* Refresh sidebar */
                Products.fetch().success(function(products){
                    $scope.products = Products.items;

                });

                $state.go('home');

            });

        }, function () {
            //$log.info('Modal dismissed at: ' + new Date());
        });
    };

}
]).controller('DeleteProductModalInstanceCtrl',['$scope','$modalInstance', 'Products', function($scope, $modalInstance, Products) {

    $scope.selectedProduct = Products.selected;

    $scope.ok = function () {
        $modalInstance.close($scope.selectedProduct._id);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}
]);
