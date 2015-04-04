'use strict';

angular.module('testruns').controller('TestrunsController', ['$scope', '$stateParams', '$state', 'TestRuns', 'Dashboards', 'Events', '$modal', '$q',
	function($scope, $stateParams, $state, TestRuns, Dashboards, Events, $modal, $q) {


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
            $state.go('viewGraphs',{"productName":$stateParams.productName, "dashboardName":$stateParams.dashboardName, "testRunId" : $scope.testRuns[index].testRunId, tag: Dashboards.getDefaultTag(Dashboards.selected.tags) })
        }

        $scope.openDeleteTestRunModal = function (size, index) {

            var modalInstance = $modal.open({
                templateUrl: 'deleteTestRun.html',
                controller: 'DeleteTestRunModalInstanceCtrl',
                size: size,
                resolve: {
                    selectedIndex: function(){
                        return index;
                    },
                    selectedTestRunId: function(){
                        return $scope.testRuns[index].testRunId;
                    }
                }
            });

            modalInstance.result.then(function (selectedIndex) {

                $q.all([Events.delete($scope.testRuns[selectedIndex].eventIds[0]), Events.delete($scope.testRuns[selectedIndex].eventIds[1])])
                .then(function(results){

                        /* refresh test runs*/
                        TestRuns.listTestRunsForDashboard($scope.productName, $scope.dashboardName).success(function (testRuns){

                            $scope.testRuns = testRuns;

                        }, function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                        });

                        /* refresh view*/

                        $state.go($state.current, {}, {reload: true});


                    })

            }, function () {
                //$log.info('Modal dismissed at: ' + new Date());
            });



        };

    }
]).controller('DeleteTestRunModalInstanceCtrl',['$scope','$modalInstance', 'selectedIndex', 'selectedTestRunId', function($scope, $modalInstance, selectedIndex, selectedTestRunId) {

    $scope.selectedTestRunId = selectedTestRunId;

    $scope.ok = function () {
        $modalInstance.close(selectedIndex);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}

]);
