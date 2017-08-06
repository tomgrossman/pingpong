(function() {
    var RegisterApp = angular.module('RegisterApp', [
        'StaticServices'
    ]);

    var RegisterController = RegisterApp.controller('RegisterController',
        function ($scope, HttpRequest) {
            $scope.ErrorMessage = '';
            $scope.RegisterData = {
                email: '',
                password: '',
                reTypePassword: '',
                full_name: '',
                team: ''
            };

            $scope.Teams = [
                {
                    label: 'Frontend',
                    value: 'frontend'
                },
                {
                    label: 'Backend',
                    value: 'backend'
                },
                {
                    label: 'Analysts',
                    value: 'analysts'
                },
                {
                    label: 'Product',
                    value: 'product'
                }
            ];

            $scope.Register = function () {
                if (!$scope.email || !$scope.password) {
                    return;
                }

                HttpRequest(
                    {
                        url: '/register/',
                        method: 'POST',
                        data: $scope.RegisterData
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