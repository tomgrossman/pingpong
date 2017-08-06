(function () {
    angular.module('StaticServices', [])
    /*
     This service is an extension for $http service, it shows the error popups automatically,
     in order to disabled the automatic popups you can pass 'true' for the 'blockPopups' parameter
     */
    .factory('HttpRequest', ['$http', '$q', function ($http, $q) {
        return function (RequestOption, blockPopups) {
            var defer = $q.defer();
            $http(RequestOption).then(
                function (response) {
                    if (true === response.data.Success) {
                        defer.resolve(response.data);
                    } else {
                        defer.reject(response.data);
                    }
                },
                function(error) {
                    defer.reject(error);
                }
            );

            return defer.promise;
        };
    }]);
}());