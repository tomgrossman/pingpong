(function () {
    var RegisterControllers = angular.module('RegisterControllers', []);
    RegisterControllers.controller('RegisterController', ['$scope', 'HttpRequest', 'PopupManager', 'PasswordService', function ($scope, HttpRequest, PopupManager, PasswordService) {

        $scope.FormSend = false;
        $scope.ErrorMessage = '';

        $scope.NewUser = {
            email: '',
            password: '',
            reTypePassword: '',
            full_name: '',
            team: ''
        };

        $scope.Register = function () {
            $scope.ErrorMessage = '';

            if (!$scope.RegisterForm.$valid) {
                return;
            }

            if (!PasswordService.IsValidPassword($scope.NewUser.Password)) {
                $scope.ErrorMessage = 'Password requirements (must contain each of the following):<br/>Uppercase letter<br/>Lowercase letter<br/>Digit<br/>Special character<br/>8-20 characters long';

                return;
            }

            if ($scope.NewUser.Password !== $scope.NewUser.ReTypePassword) {
                $scope.ErrorMessage = 'Passwords don\'t match';

                return;
            }


            $scope.FormSend = true;
            HttpRequest(
                {
                    url: '/register',
                    method: 'POST',
                    data: $scope.NewUser
                },
                true
            ).then(
                function () {
                    window.location.replace('/');
                }, function (errordata) {
                    $scope.FormSend = false;
                    if (errordata && errordata.Data) {
                        $scope.ErrorMessage = errordata.Data;
                    } else {
                        PopupManager.ShowGeneralError();
                    }
                }
            );
        };
    }]);
}());