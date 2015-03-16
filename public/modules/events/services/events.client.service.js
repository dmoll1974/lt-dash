'use strict';

//Events service used to communicate Events REST endpoints
angular.module('events').factory('Events', ['$http', 'Products', 'Dashboards',
	function($http, Products, Dashboards) {

        var Events = {
//            'get' : getFn,
            selected: {},
            listEventsForDashboard: listEventsForDashboard,
//            updateTags : updateTags,
            update : update,
            create: create

        };

        return Events;

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
