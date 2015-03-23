'use strict';

angular.module('graphs').controller('HighchartsLiveController', ['$scope', 'Interval', 'Graphite', 'TestRuns', '$q','$http', '$log',
    function($scope, Interval, Graphite, TestRuns, $q, $http, $log) {

        $scope.group = {isOpen : false};

        $scope.$watch('value', function (newVal, oldVal) {

            if (newVal !== 'All') $scope.isOpen = true;

        });

        /* stop data polling when accordion is closed */

        $scope.$watch('group.isOpen', function (newVal, oldVal) {

            if (newVal !== oldVal && newVal === false) Interval.clearIntervalForMetric($scope.metric._id);

        });

        /* stop data polling when element is destroyed by ng-if */

        $scope.$on("$destroy", function() {

            Interval.clearIntervalForMetric($scope.metric._id);

        });


        /* reinitialise graph when zoomRange is changed */

        $scope.$watch('zoomRange', function (newVal, oldVal) {

            if (newVal !== oldVal) {

                Interval.clearIntervalForMetric($scope.metric._id);

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
                    events: {
                        load: function () {

                            /* Clear interval that might be already running for this metric */
                            Interval.clearIntervalForMetric($scope.metric._id);

                            var intervalId = setInterval(function () {

                                Graphite.getData($scope.zoomRange, 'now', $scope.metric.targets, 900).then(function (series) {

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


                                console.log('intervalIds:' + Interval.active)
                            }, 10000);

                            Interval.active.push({intervalId: intervalId, metricId: $scope.metric._id});

                        }
                    }
                },
                rangeSelector: {
                    enabled: false
                }

            },
            series: [],

            title: {
                text: 'Hello'
            },
            xAxis: {minRange: 10000, type: 'datetime' },
            loading: false,
            useHighStocks: true

    }


        $scope.initConfig = function (config, metric) {
            //debugger;

            $scope.metric = metric;
            $scope.config = angular.copy(config);
            $scope.config.title.text = metric.alias;
            Graphite.getData($scope.zoomRange, 'now', metric.targets, 900).then(function (series) {

                _.each(series, function(serie, i){

                    $scope.config.series.push({name: serie.name, data: serie.data});

                })
            });


        }
    }
]);
