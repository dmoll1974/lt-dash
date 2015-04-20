'use strict';

angular.module('testruns').controller('TestrunsController', ['$scope', '$stateParams', '$state', 'TestRuns', 'Dashboards', 'Events', '$modal', '$q', 'ConfirmModal',
	function($scope, $stateParams, $state, TestRuns, Dashboards, Events, $modal, $q, ConfirmModal) {


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
            $state.go('viewGraphs',{"productName":$stateParams.productName, "dashboardName":$stateParams.dashboardName, "testRunId" : $scope.testRuns[index].testRunId, tag: Dashboards.getDefaultTag(Dashboards.selected.tags) });
        }

        $scope.testRunRequirements = function(index){

            TestRuns.selected = $scope.testRuns[index];
            $state.go('requirementsTestRun',{"productName":$stateParams.productName, "dashboardName":$stateParams.dashboardName, "testRunId" : $scope.testRuns[index].testRunId });
        }



        $scope.openDeleteTestRunModal = function (size, index) {


            ConfirmModal.itemType = 'Delete test run ';
            ConfirmModal.selectedItemId = index;
            ConfirmModal.selectedItemDescription = $scope.testRuns[index].testRunId;

            var modalInstance = $modal.open({
                templateUrl: 'ConfirmDelete.html',
                controller: 'ModalInstanceController',
                size: size//,
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
]);
