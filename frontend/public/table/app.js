(function() {
    var MainApp = angular.module('MainApp', ['ngDialog', 'StaticServices']);

    var mainController = MainApp.controller('MainController',
        function ($scope, ngDialog, HttpRequest) {
            $scope.ShouldShowTournament = false;
            $scope.FullTable = [];
            $scope.FilteredTable = [];
            $scope.IdToName = {};
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
            $scope.TeamFilter = 'all';

            function getTable() {
                return HttpRequest({
                    method: 'GET',
                    url: '/table/get-table'
                }, true).then(
                    function (data) {
                        $scope.FullTable = data.Data;
                        $scope.FullTable.forEach(function (TableRow) {
                            $scope.IdToName[TableRow._id] = TableRow.full_name;
                        });
                        FilterTableByTeam();
                    }
                )
            }

            $scope.$watch('TeamFilter', function () {
                FilterTableByTeam();
            });

            function FilterTableByTeam () {
                $scope.Table = $scope.FullTable.filter(function (currRow) {
                    return ('all' === $scope.TeamFilter || $scope.TeamFilter === currRow.team);
                });
            }

            function getTournament() {
                HttpRequest(
                    {
                        method: 'GET',
                        url: '/tournament'
                    },
                    true
                ).then(
                    function (data) {
                        $scope.Tournament = data.Data;
                    }
                );
            }

            function getUserDetails () {
                HttpRequest(
                    {
                        method: 'GET',
                        url: '/user/get-user-details'
                    },
                    true
                ).then(
                    function (data) {
                        $scope.UserDetails = data.Data;
                    }
                );
            }

            getUserDetails();
            getTournament();
            getTable();


            setInterval(function () {
                getTable();
               // getTournament();
            }, 5000);


            $scope.ShowTournament = function (Tournament) {
                    ngDialog.open(
                        {
                            template: '/html/table/popups/tournament.html',
                            className: 'tournament-popup',
                            scope          : $scope

                        }
                    )
                };
                $scope.InvitePlayer = function () {
                    ngDialog.open(
                        {
                            template: '/html/table/popups/invite-player.html',
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
            };

            $scope.AddScore = function () {
                HttpRequest({
                        method: 'GET',
                        url   : '/matches/get-user-open-matches'
                    }, true
                ).then(
                    function (data) {
                        $scope.Matches = data.Data.map(function (currMatch) {
                            currMatch.oponnentId = ($scope.UserDetails._id === currMatch.invitee) ? currMatch.inviter : currMatch.invitee;
                            return currMatch;
                        });
                        ngDialog.open(
                            {
                                template: '/html/table/popups/add-score.html',
                                className: 'ngdialog-theme-default',
                                scope          : $scope,
                                controller     : ['$scope', function ($scope) {
                                    $scope.MatchIndex = -1;
                                    $scope.SelectedMatch = {};

                                    $scope.ChangeMatchIndex = function (newIndex) {
                                        $scope.SelectedMatch = $scope.Matches[newIndex];
                                    };

                                    $scope.AddScore = function (MatchId, Winner) {
                                        HttpRequest(
                                            {
                                                method: 'POST',
                                                url: '/matches/add-score/' + MatchId,
                                                data: {winner: Winner}
                                            }
                                        ).then(
                                            function () {
                                                ngDialog.close();
                                            }
                                        );
                                    }
                                }]
                            }
                        );
                    }
                )
            }
        }
    )
}());