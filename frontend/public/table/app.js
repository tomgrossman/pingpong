(function() {
    var MainApp = angular.module('MainApp', ['ngDialog']);

    var mainController = MainApp.controller('MainController',
        [
            '$scope',
            'ngDialog',
            '$http',
            function ($scope, ngDialog, $http) {
                $scope.ShouldShowTournament = false;
                $http({
                    method: 'GET',
                    url: '/table/get-table'
                }).then(
                    function () {
                        debugger;
                    }
                ).catch(
                    function () {
                        debugger;
                    }
                )

                $scope.PlayGame = function () {
                    ngDialog.open(
                        {
                            template: '/html/table/popups/play-game.html',
                            className: 'ngdialog-theme-default',
                            scope          : $scope,
                            controller     : ['$scope', function ($scope) {

                            }]
                        }
                    );
                }

            }
        ]
    )
}());