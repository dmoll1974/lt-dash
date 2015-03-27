'use strict';

angular.module('graphs').controller('HighchartsController', ['$scope','Graphite','$stateParams', 'TestRuns', '$q','$http', '$log',
	function($scope, Graphite, $stateParams, TestRuns, $q, $http, $log) {


        /* Open accordion by default, except for the "All" tab */


        $scope.$watch('value', function (newVal, oldVal) {

            if (newVal !== 'All'){

                _.each($scope.metrics, function (metric, i){

                    $scope.metrics[i].isOpen = true;

                })

            }

        });

        /* If zoom lock is checked, update all graphs when zoom is applied in one */
        $scope.$watch(function(scope) { return TestRuns.zoomFrom},
            function(newVal, oldVal) {

                if(newVal !== oldVal) {
                    $scope.config.loading = true;
                    Graphite.getData(TestRuns.zoomFrom, TestRuns.zoomUntil, $scope.metric.targets, 900).then(function (series) {

                        $scope.config.series = series;
                        $scope.config.loading = false;
                    });
                }
            }
        );



        $scope.chart = {
            options: {
                chart: {
                    type: 'line',
                    zoomType: 'x',
                    height: 500
                },
                rangeSelector: {
                    enabled: false
                },
                legend: {
                    enabled: true,
                    align: 'center',
                    verticalAlign: 'bottom',
                    maxHeight: 100
                    //layout: 'vertical'
                },
                tooltip:{
                    enabled:true,
                    shared: false,
                    decimals: 0

                }

            },
            series: [
            ],
            title: {
                text: 'Hello'
            },
            xAxis: {
                minRange: 10000,
                events: {
                    setExtremes: function(e) {

                        var from = (typeof e.min == 'undefined' && typeof e.max == 'undefined')? TestRuns.selected.start : Math.round(e.min);
                        var until = (typeof e.min == 'undefined' && typeof e.max == 'undefined')? TestRuns.selected.end : Math.round(e.max);

                        /* If zoom lock is checked, set zoom timestamps in TestRuns service */
                        if ($scope.zoomLock){

                            TestRuns.zoomFrom = from;
                            TestRuns.zoomUntil = until;
                            $scope.$apply();

                        }else {

                            $scope.config.loading = true;

                            Graphite.getData(from, until, $scope.metric.targets, 900).then(function (series) {

                                $scope.config.series = series;
                                $scope.config.loading = false;
                            });
                        }
                    }
                }
            },
            loading: true,
            useHighStocks: true
        }



        $scope.initConfig = function (config, metric) {
            //debugger;

            $scope.config = angular.copy(config);
            $scope.config.title.text = metric.alias;

            /* Set the TestRuns.selected based on $stateParams*/

            TestRuns.getTestRunById($stateParams.productName, $stateParams.dashboardName, $stateParams.testRunId).success(function(testRun){

                TestRuns.selected = testRun[0];

                Graphite.getData(TestRuns.selected.start, TestRuns.selected.end, metric.targets, 900).then(function (series) {

                    _.each(series, function(serie, i){

                        $scope.config.series.push({name: serie.name, data: serie.data});
                        $scope.config.loading = false;

                    })
                });
            })

        }

    }

]);
