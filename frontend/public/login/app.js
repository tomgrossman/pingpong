(function() {
    var LoginApp = angular.module('LoginApp', []);

    var loginController = LoginApp.controller('LoginController',
        [
            '$scope',
            function ($scope) {
                $scope.IsLoginForm = false;
                $scope.IsRegisterForm = false;

                $scope.LoginEmail = '';

                $scope.RegisterEmail = '';
                $scope.RegisterPassword1 = '';
                $scope.RegisterPassword2 = '';

                $scope.LoginClicked = function () {
                    $scope.IsLoginForm = true;
                    $scope.IsRegisterForm = false;
                };
                $scope.RegisterClicked = function () {
                    $scope.IsRegisterForm = true;
                    $scope.IsLoginForm = false;
                };
                $scope.ResetForms = function () {
                    $scope.IsLoginForm = false;
                    $scope.IsRegisterForm = false;
                };

                $scope.Login = function () {
                    if (!$scope.LoginEmail || !$scope.LoginPassword) {
                        return;
                    }
                };
                $scope.Register = function () {
                    if (!$scope.RegisterEmail || !$scope.RegisterPassword1 || !$scope.RegisterPassword2) {
                        return;
                    }  if ($scope.RegisterPassword1 !== $scope.RegisterPassword2) {
                        $scope.PasswordDontMatchError = true;
                    }
                };
            }
        ]
    )
}());