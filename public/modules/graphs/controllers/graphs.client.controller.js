'use strict';

angular.module('graphs').controller('GraphsController', ['$scope', '$rootScope', '$state', '$stateParams', 'Dashboards','Graphite','TestRuns', 'Metrics','$log', 'Tags',
	function($scope, $rootScope, $state, $stateParams, Dashboards, Graphite, TestRuns, Metrics, $log, Tags) {

         $scope.gatlingDetails = ($stateParams.tag === 'Gatling') ? true : false;
            /* Get deeplink zoom params from query string */

         if($state.params.zoomFrom) TestRuns.zoomFrom = $state.params.zoomFrom;

         if($state.params.zoomUntil) TestRuns.zoomUntil = $state.params.zoomUntil;


         //$scope.value = $stateParams.tag;

        /* reset zoom*/
        $scope.resetZoom = function(){

                /*reset zoom*/
                TestRuns.zoomFrom = "";
                TestRuns.zoomUntil = "";

                $state.go($state.current, {}, {reload: true});

        }

        /* Zoom lock enabled by default */
        $scope.zoomLock = true;

        $scope.init = function(){

                Dashboards.get($stateParams.productName, $stateParams.dashboardName).then(function (dashboard){

                        $scope.dashboard = Dashboards.selected;

                        $scope.metrics = addAccordionState(Dashboards.selected.metrics);

                        /* Get tags used in metrics */
                        $scope.tags = Tags.setTags($scope.metrics, $stateParams.productName, $stateParams.dashboardName, $stateParams.testRunId);

                        /* if reloading a non-existing tag is in $statParams */
                        $scope.value = (checkIfTagExists ($stateParams.tag)) ? $stateParams.tag : 'All';

                        TestRuns.getTestRunById($stateParams.productName, $stateParams.dashboardName, $stateParams.testRunId).success(function (testRun) {

                                TestRuns.selected = testRun[0];
                        });




                })

        };

        function checkIfTagExists (tag) {

                var exists = false;

                _.each($scope.tags, function(existingTag){

                        if(tag === existingTag.text){
                                exists = true;
                                return;
                        }

                })

                return exists;

        }
        function addAccordionState(metrics){

                _.each(metrics, function(metric){

                        metric.isOpen = false;
                })

                return metrics;
        }
        /* default zoom range for live graphs is -10m */
        $scope.zoomRange = (TestRuns.zoomRange !== '')? TestRuns.zoomRange : '-10min';

        /* Set active tab */
        $scope.isActive = function (tag){

           return  $scope.value === tag;
        };


        $scope.editMetric = function(metricId){

                $state.go('editMetric', {productName: $stateParams.productName, dashboardName: $stateParams.dashboardName, metricId: metricId});
        }


        $scope.loadTags = function(query){

            var matchedTags = [];

            _.each(Dashboards.selected.tags, function(tag){

                    if(tag.text.toLowerCase().match(query.toLowerCase()))
                            matchedTags.push(tag);
            });

            return matchedTags;

       };

    }
]);
