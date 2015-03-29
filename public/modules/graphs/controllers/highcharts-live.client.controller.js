'use strict';

angular.module('graphs').controller('HighchartsLiveController', ['$scope', 'Interval', '$stateParams', 'Graphite', 'TestRuns', '$q','$http', '$log',
    function($scope, Interval,$stateParams, Graphite, TestRuns, $q, $http, $log) {

        /* generate deeplink to share metric graph */

        $scope.setMetricShareUrl = function(metricId){

            $scope.metricShareUrl = location.host + '/#!/graphs-live/' + $stateParams.productName + '/' + $stateParams.dashboardName + '/' + $stateParams.tag + '/' + metricId;

            if($scope.showUrl){

                switch($scope.showUrl){

                    case true:
                        $scope.showUrl = false;
                        break;
                    case false:
                        $scope.showUrl = true;
                        break;
                }

            }else{

                $scope.showUrl = true;
            }
        }

        /* Open accordion by default, except for the "All" tab */

        $scope.$watch('value', function (newVal, oldVal) {

            if($stateParams.metricId){

                _.each($scope.metrics, function (metric, i) {

                    if(metric._id === $stateParams.metricId )
                        $scope.metrics[i].isOpen = true;

                })

            }else {

                if (newVal !== 'All') {

                    _.each($scope.metrics, function (metric, i) {

                        $scope.metrics[i].isOpen = true;

                    })

                }
            }
        });

        /* stop data polling when accordion is closed */

        $scope.$watch('metric.isOpen', function (newVal, oldVal) {

            if (newVal !== oldVal && newVal === false) Interval.clearIntervalForMetric($scope.metric._id);

        });

        /* stop data polling when element is destroyed by ng-if */

        $scope.$on("$destroy", function() {

            Interval.clearIntervalForMetric($scope.metric._id);

        });


        /* reinitialise graph when zoomRange is changed */

        $scope.$watch('zoomRange', function (newVal, oldVal) {

            if (newVal !== oldVal) {


                TestRuns.zoomRange = $scope.zoomRange;

                var seriesArray = $scope.config.series;
                var seriesArraySize = seriesArray.length;

                for (var i = 0; i < seriesArraySize; i++) {

                    seriesArray.splice(0, 1);
                }

                $scope.initConfig($scope.chart, $scope.metric);
            }
        });


        $scope.chart = {
            options: {
                chart: {
                    type: 'line',
                    zoomType: 'x',
                    height: 500,
                    events: {
                        load: function () {

                            /* Clear interval that might be already running for this metric */
                            Interval.clearIntervalForMetric($scope.metric._id);

                            var intervalId = setInterval(function () {

                                Graphite.getData($scope.zoomRange, 'now', $scope.metric.targets, 900, $stateParams.productName, $stateParams.dashboardName).then(function (graphiteSeries) {

                                    Graphite.addEvents(graphiteSeries, $scope.zoomRange, 'now', $stateParams.productName, $stateParams.dashboardName).then(function (series) {

                                            /* update series */
                                        _.each(series, function (serie) {

                                            _.each($scope.config.series, function (existingSerie, i) {


                                                if (serie.name === existingSerie.name) {

                                                    var newDatapoints = _.filter(serie.data, function (newDataPoint) {

                                                        var isNew = true;
                                                        _.each(existingSerie.data, function (existingDataPoint) {

                                                            if (newDataPoint[0] === existingDataPoint[0]) isNew = false;

                                                        })

                                                        return isNew;

                                                    })

                                                    if (newDatapoints.length > 0) {

                                                        _.each(newDatapoints, function (datapoint) {

                                                            $scope.config.series[i].data.push([datapoint[0], datapoint[1]]);
                                                        })

                                                    }

                                                    return;
                                                }
                                            })


                                        })
                                    });
                                });


                                console.log('intervalIds:' + Interval.active)
                            }, 10000);

                            Interval.active.push({intervalId: intervalId, metricId: $scope.metric._id});

                        }
                    }
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
            series: [],

            title: {
                text: 'Hello'
            },
            xAxis: {minRange: 10000, type: 'datetime' },
            yAxis: {
                min: 0 // this sets minimum values of y to 0
            },
            loading: false,
            useHighStocks: true

    }


        $scope.initConfig = function (config, metric) {
            //debugger;

            $scope.metric = metric;
            $scope.config = angular.copy(config);
            $scope.config.title.text = metric.alias;
            Graphite.getData($scope.zoomRange, 'now', metric.targets, 900, $stateParams.productName, $stateParams.dashboardName).then(function (series) {

                Graphite.addEvents(series, $scope.zoomRange, 'now', $stateParams.productName, $stateParams.dashboardName).then(function (seriesEvents) {


                    $scope.config.series = seriesEvents;
                    $scope.config.loading = false;

                });
            });


        }
    }
]);
