'use strict';

//Events service used to communicate Events REST endpoints
angular.module('events').factory('Events', ['$http', 'Products', 'Dashboards',
	function($http, Products, Dashboards) {

        var Events = {
            selected: {},
            listEventsForDashboard: listEventsForDashboard,
            update : update,
            create: create,
            delete: deleteFn

        };

        return Events;

        function deleteFn(metricId){
            return $http.delete('/events/' + metricId);
        }

        function listEventsForDashboard(productName, dashboardName){

            return $http.get('/events-dashboard/' + productName + '/' + dashboardName);
        
        };

        function create(event){
            return $http.post('/events', event);
        }

        function update(event){
            return $http.put('/events/' + event._id, event);
        }

    }
]);
