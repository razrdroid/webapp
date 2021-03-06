(function() {
    'use strict';

    angular.module('app')
        .service('loginData', [
            '$http',
            '$q',
            function($http, $q, $location) {

                var serviceBase = 'http://thaparexpress.com/api/v4/';

                var obj = {};

                obj.get = function(q) {
                    return $http.get(serviceBase + q).then(function(results) {
                        return results.data;
                    });
                };
                obj.post = function(q, object) {
                    return $http.post(serviceBase + q, object).then(function(results) {
                        return results.data;
                    });
                };
                obj.put = function(q, object) {
                    return $http.put(serviceBase + q, object).then(function(results) {
                        return results.data;
                    });
                };
                obj.delete = function(q) {
                    return $http.delete(serviceBase + q).then(function(results) {
                        return results.data;
                    });
                };
                return obj;
            }
        ]);
})();
