'use strict';

angular.module('graphs').controller('GraphsController', ['$scope',
	function($scope) {


        $scope.toggleLoading = function () {
            this.chartConfig.loading = !this.chartConfig.loading
        }

        $scope.chartConfig = {
            options: {
                chart: {
                    type: 'line',
                    zoomType: 'x'
                }
            },
            series: [{
                data: [10, 15, 12, 8, 7, 1, 1, 19, 15, 10]
            }],
            title: {
                text: 'Hello'
            },
            xAxis: {currentMin: 0, currentMax: 10, minRange: 1},
            loading: false,
            useHighStocks: false
        }
	}
]);
