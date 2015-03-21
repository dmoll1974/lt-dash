'use strict';

// Dashboards controller
angular.module('dashboards').controller('DashboardsController', ['$scope', '$rootScope', '$modal', '$log', '$stateParams', '$state', '$location', 'Authentication', 'Dashboards', 'Products', 'Metrics', 'DashboardTabs',
	function($scope, $rootScope, $modal, $log, $stateParams, $state, $location, Authentication, Dashboards, Products, Metrics, DashboardTabs) {

        
        
        /* Tab controller */

        $scope.$watch(function(scope) { return DashboardTabs.tabNumber },
            function() {

                this.tab = DashboardTabs.tabNumber;
            }
        );
//        this.tab = DashboardTabs.tabNumber;

        this.setTab = function(newValue){
            DashboardTabs.setTab(newValue);
        }

        this.isSet = function(tabNumber){
            return DashboardTabs.isSet(tabNumber);
        };
        
        /* Watch on dashboard */

        $scope.$watch(function(scope) { return Dashboards.selected },
            function() {

                $scope.dashboard = Dashboards.selected;
            }
        );
        
        
        $scope.productName = $stateParams.productName;

        $scope.dashboardName = $stateParams.dashboardName;

		$scope.authentication = Authentication;

        $scope.addMetric = function() {

//            console.log('add/metric/' + $stateParams.productName + '/' + $stateParams.dashboardName)

            $state.go('createMetric',{"productName":$stateParams.productName, "dashboardName":$stateParams.dashboardName});

        };


        // Create new Dashboard
		$scope.create = function() {
			// Create new Dashboard object
            var dashboard = {};
            dashboard.name = this.name;
            dashboard.description = this.description;

            Dashboards.create(dashboard, $stateParams.productName).success(function(dashboard){


                $location.path('browse/' + $stateParams.productName + '/' + dashboard.name);

                /* Refresh sidebar */
                Products.fetch().success(function(products){
                    $scope.products = Products.items;

                });

                // Clear form fields
                $scope.name = '';
                $scope.description = '';
                $scope.productName = '';

            });

        };

        $scope.edit = function(){


            $state.go('editDashboard',{"productName":$stateParams.productName, "dashboardName":$stateParams.dashboardName});


        };

        $scope.clone = function(){

            Dashboards.clone().success(function(dashboard){

                /* Refresh sidebar */
                Products.fetch().success(function(products){
                    $scope.products = Products.items;

                });

                $state.go('editDashboard',{"productName":$stateParams.productName, "dashboardName":dashboard.name});
                
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        $scope.viewLiveGraphs = function(){


            $state.go('viewLiveGraphs',{"productName":$stateParams.productName, "dashboardName":$stateParams.dashboardName});


        };

        // Remove existing Dashboard
		$scope.remove = function(dashboard) {
			if ( dashboard ) { 
				dashboard.$remove();

				for (var i in $scope.dashboards) {
					if ($scope.dashboards [i] === dashboard) {
						$scope.dashboards.splice(i, 1);
					}
				}
			} else {
				$scope.dashboard.$remove(function() {
					$location.path('dashboards');
				});
			}
		};

		// Update existing Dashboard

        $scope.update = function() {

            Dashboards.update($scope.dashboard).success(function (dashboard) {

                /* Refresh sidebar */
                Products.fetch().success(function(products){
                    $scope.products = Products.items;

                });

                $state.go('viewDashboard',{"productName":$stateParams.productName, "dashboardName":dashboard.name});

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };
        

		// Find a list of Dashboards
		$scope.find = function() {
			$scope.dashboards = Dashboards.query({
                dashboardName: $stateParams.dashboardName,
                productName: $stateParams.productName
            });
		};

        $scope.cancel = function() {

            if ($rootScope.previousStateParams)
                $state.go($rootScope.previousState,$rootScope.previousStateParams);
            else
                $state.go($rootScope.previousState);



        }
        // Find existing Product
        $scope.findOne = function() {


            Dashboards.get($stateParams.productName, $stateParams.dashboardName).success(function(dashboard){

                $scope.dashboard = Dashboards.selected;

            });

        };
		// Find existing Dashboard
//		$scope.findOne = function() {
//			$scope.dashboard = Dashboards.get({
//				dashboardName: $stateParams.dashboardName,
//                productName: $stateParams.productName
//			});
//		};


        $scope.open = function (size, index) {

            Metrics.selected = $scope.dashboard.metrics[index];
            
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size//,
            });

            modalInstance.result.then(function (metricId) {

                Metrics.delete(metricId).success(function(metric){

                    /* refresh dashboard*/
                    Dashboards.get($scope.productName, $scope.dashboardName).success(function(dashboard){

                        $scope.dashboard = Dashboards.selected;

                    });

                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }
]).controller('ModalInstanceCtrl',['$scope','$modalInstance', 'Metrics', function($scope, $modalInstance, Metrics) {

    $scope.selectedMetric = Metrics.selected;
    
    $scope.ok = function () {
        $modalInstance.close($scope.selectedMetric._id);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}
]);
