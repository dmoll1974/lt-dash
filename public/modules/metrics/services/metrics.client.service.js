'use strict';

//Metrics service used to communicate Metrics REST endpoints
angular.module('metrics').factory('Metrics', ['$http',
	function($http) {


        var Metrics = {
//            items : [],
            'get' : getFn,
            update : update,
            delete : deleteFn,
            create: create,
            selected: {},
            clone: {}

        };

        return Metrics;

        function getFn(metricId){
            return $http.get('/metrics/' + metricId);
        }

        function deleteFn(metricId){
            return $http.delete('/metrics/' + metricId);
        }
        
        function create(metric){
            return $http.post('/metrics', metric).success(function(metric){

            });
        }

        function update(metric){
            return $http.put('/metrics/' + metric._id, metric).success(function(metric){

            });
        }
	}
]);