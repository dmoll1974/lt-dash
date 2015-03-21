'use strict';

angular.module('graphs').filter('tagsFilter', [
	function() {

            function parseString(input) {
                return input.split(".");
            }

            function getValue(element, propertyArray) {
                var value = element;

                _.forEach(propertyArray, function (property) {
                    value = value[property];
                });

                return value;
            }

            return function (array, propertyString, target) {
                var properties = parseString(propertyString);

                _.each(array, function(item){

                    //console.log('array item:' + item);


                });

                return _.filter(array, function (item) {

                    var matchResult = false;

                    _.each(getValue(item, properties), function(arrayItem){

                        if(target === arrayItem.text) matchResult = true;

                    })
                    return matchResult;
                });
            }
        }

]);
