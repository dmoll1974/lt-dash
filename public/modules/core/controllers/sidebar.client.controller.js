'use strict';

angular.module('core').controller('SidebarController', ['$scope', '$stateParams', '$location', 'Products',
    function($scope, $stateParams, $location, Products) {

        $scope.productId = $stateParams.productId;

        $scope.products = Products.query();

        
        $scope.productIsActive = function(productName) {
            return $location.path().indexOf(productName)!== -1;
        };

//        $scope.dashboardIsActive = function(dashboardName) {
//            if ($location.path().indexOf(dashboardName)!== -1) return 'dashboard-selected';
//        };



    }
]);