'use strict';

angular.module('core').controller('SidebarController', ['$scope', '$stateParams', '$location', 'Products','$rootScope',
    function($scope, $stateParams, $location, Products, $rootScope) {

        $scope.productId = $stateParams.productId;


        $scope.productIsActive = function(productName) {
            return $location.path().indexOf(productName)!== -1;
        };

        $scope.dashboardIsActive = function(dashboardName) {
            if ($location.path().indexOf(dashboardName)!== -1) return 'dashboard-selected';
        };

        $rootScope.$on('$routeChangeSuccess', function(event, current){

            // Find a list of Products
            $scope.find = function() {
                $scope.products = Products.query();
            };
        });

    }
]);