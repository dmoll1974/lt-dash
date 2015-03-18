'use strict';

angular.module('testruns').controller('TestrunsController', ['$scope', '$stateParams', '$state', 'TestRuns',
	function($scope, $stateParams, $state, TestRuns) {


        $scope.productName = $stateParams.productName;

        $scope.dashboardName = $stateParams.dashboardName;


		/* List test runs for dashboard */


        $scope.listTestRunsForDashboard = function() {

            TestRuns.listTestRunsForDashboard($scope.productName, $scope.dashboardName).success(function (testRuns){

                $scope.testRuns = testRuns;

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        $scope.testRunDetails = function(index){

            TestRuns.selected = $scope.testRuns[index];
            $state.go('viewGraphs',{"productName":$stateParams.productName, "dashboardName":$stateParams.dashboardName, "testRunId" : $scope.testRuns[index].testRunId })
        }
	}
]);
