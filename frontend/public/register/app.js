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
                team: 'frontend'
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
                    label: 'QA',
                    value: 'qa'
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
                $scope.ErrorMessage = '';
                if (!$scope.RegisterForm.$valid) {
                    return;
                }

                if ($scope.RegisterData.password !== $scope.RegisterData.reTypePassword) {
                    $scope.ErrorMessage = 'Passwords does not match';
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
                        window.location.replace('/login');
                    },
                    function (data) {
                        $scope.FormSend = false;
                        var errMsg = data.Data;
                        switch (errMsg) {
                            case 'Invalidpassword':
                                $scope.ErrorMessage = 'Password too weak.';
                                break;

                            case 'MailAlreadyExists':
                                $scope.ErrorMessage = 'Email address already exists';
                                break;

                            default:
                                $scope.ErrorMessage = errMsg;
                        }
                    }
                );
            };
        }
    )
}());