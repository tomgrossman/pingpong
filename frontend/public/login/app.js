(function() {
    var LoginApp = angular.module('LoginApp', [
        'StaticServices'
    ]);

    var loginController = LoginApp.controller('LoginController',
        function ($scope, HttpRequest) {
            $scope.email = '';
            $scope.password = '';
            $scope.ErrorMessage = ''

            $scope.Login = function () {
                if (!$scope.email || !$scope.password) {
                    return;
                }

                HttpRequest(
                    {
                        url: '/login/',
                        method: 'POST',
                        data: {
                            email: $scope.email,
                            password: $scope.password
                        }
                    }
                ).then(
                    function () {
                        $scope.FormSend = false;
                        window.location.replace('/');
                    },
                    function (data) {
                        $scope.FormSend = false;
                        $scope.ErrorMessage = data.Data;
                    }
                );
            };
        }
    )
}());