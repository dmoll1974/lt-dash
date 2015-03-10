'use strict';

// Dashboards tab controller
angular.module('dashboards').controller('DashboardsTabController', ['$stateParams',
    function($stateParams){

        $scope.productName = $stateParams.productName;

        $scope.dashboardName = $stateParams.dashboardName;


        this.tab = 1;

        this.setTab = function(newValue){
            this.tab = newValue;
        };

        this.isSet = function(tabName){
            return this.tab === tabName;
        };
    }
]);
