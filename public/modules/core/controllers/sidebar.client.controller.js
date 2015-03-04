'use strict';

angular.module('core').controller('SidebarController', ['$scope', '$stateParams', '$location', 'Products',
    function($scope, $stateParams, $location, Products) {

        $scope.productId = $stateParams.productId;


        Products.fetch().success(function(products){
            $scope.products = Products.items;
            
        });


        $scope.$watch(function(scope) { return Products.items },
            function() {

                $scope.products = Products.items;
            }
        );

        $scope.productIsActive = function(productName) {
            return $location.path().indexOf(productName)!== -1;
        };

        $scope.dashboardIsActive = function(dashboardName) {
            if ($location.path().indexOf(dashboardName)!== -1) return 'dashboard-selected';
        };



    }
]);