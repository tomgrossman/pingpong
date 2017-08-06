(function() {
    var MainApp = angular.module('MainApp', ['ngDialog', 'StaticServices']);

    var mainController = MainApp.controller('MainController',
        [
            '$scope',
            'ngDialog',
            'HttpRequest',
            function ($scope, ngDialog, HttpRequest) {
                $scope.ShouldShowTournament = false;
                $scope.Table = [];
                $scope.IdToName = {};

                var getTable = function () {
                    return HttpRequest({
                        method: 'GET',
                        url: '/table/get-table'
                    }, true).then(
                        function (data) {
                            $scope.Table = data.Data;
                            $scope.Table.forEach(function (TableRow) {
                                $scope.IdToName[TableRow._id] = TableRow.full_name;
                            })
                        }
                    )
                };
                getTable().catch(
                    function () {
                        //Popup mannger something went wrong
                    }
                )



                setInterval(function () {
                    getTable();
                }, 5000);


                $scope.InvitePlayer = function () {
                    ngDialog.open(
                        {
                            template: '/html/table/popups/play-game.html',
                            className: 'ngdialog-theme-default',
                            scope          : $scope,
                            controller     : ['$scope', function ($scope) {
                                $scope.ChoosePlayer = function (PlayerToInvite) {
                                    HttpRequest(
                                        {
                                            method: 'POST',
                                            url: '/matches/add-friendly-match/' + PlayerToInvite
                                        }
                                    ).then(
                                        function () {
                                            ngDialog.close();
                                        }
                                    )

                                }
                            }]
                        }
                    );
                }

                $scope.AddScore = function () {
                    HttpRequest({
                            method: 'GET',
                            url   : '/matches/get-user-open-matches'
                        }, true
                    ).then(
                        function (data) {
                            debugger;
                            $scope.Matches = [];
                            data.Data.forEach(function (Match) {
                                var match = {winner: '', _id: Match._id};
                                if ($scope.IdToName[Match.inviter]) {
                                    match.opponent = $scope.IdToName[Match.inviter];
                                } else if ($scope.IdToName[Match.invitee]) {
                                    match.opponent = $scope.IdToName[Match.invitee];
                                }
                                $scope.Matches.push(match);
                            });
                            ngDialog.open(
                                {
                                    template: '/html/table/popups/add-score.html',
                                    className: 'ngdialog-theme-default',
                                    scope          : $scope,
                                    controller     : ['$scope', function ($scope) {
                                        $scope.ChoosePlayer = function (PlayerToInvite) {
                                            HttpRequest(
                                                {
                                                    method: 'POST',
                                                    url: '/matches/add-friendly-match/' + PlayerToInvite
                                                }
                                            ).then(
                                                function () {
                                                    ngDialog.close();
                                                }
                                            )

                                        }
                                    }]
                                }
                            );
                        }
                    )
                }

            }
        ]
    )
}());