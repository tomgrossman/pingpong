    (function() {
    var MainApp = angular.module('MainApp', ['ngDialog', 'StaticServices']);

    var mainController = MainApp.controller('MainController',
        function ($scope, $timeout, ngDialog, HttpRequest) {
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
            $scope.Greeting = null;
            $scope.ShowGreeting = false;

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
                        $scope.Greeting = greetingByTime();
                        $scope.ShowGreeting = true;
                        $timeout(
                            function() {
                                $scope.ShowGreeting = false;
                            },
                            8000
                        );
                    }
                );
            }

            var LunchByPerson = {//TODO
                Samuel: 'Sal Salat',
                Maxim: 'Hummus Hagargir',
                Bar: 'Gute',
                Tom: 'your Tapugezer? Ta\'im Lecha',
                Lihi: 'Holmes Place',
                Ido: 'Liv'
            }

            function greetingByTime () {
                var currentHour = (new Date()).getHours();
                var greetingPreffix = 'Hello';
                var greetingSuffix = 'How is your day so far? Go out there and play some Pong!';
                if (5 <= currentHour && 13 > currentHour) {
                    greetingPreffix = 'Good morning';
                    var rand = Math.random();
                    if (0.5 < rand) {
                        greetingSuffix = 'Was the traffic ok? Nothing like a morning excercise in the Ping Pong room!';
                    } else {
                        greetingSuffix = 'Did you get to work easily? Get yourself some coffee or get your ass to the Ping Pong table!';
                    }
                } else if (15 <= currentHour && 18 > currentHour) {
                    greetingPreffix = 'Hi';
                    var lunchPlace = LunchByPerson[$scope.UserDetails.full_name.split(' ')[0]] || 'Sebastian';
                    //greetingSuffix = 'How was Sebastian? Wouldn\'t you like to play some Ping Pong for dessert?';
                    greetingSuffix = 'How was ' +  lunchPlace + '? I bet it was delicous. Wouldn\'t you like to play some Ping Pong for dessert?';
                } else if (15 <= currentHour && 18 > currentHour) {
                    greetingPreffix = 'Good afternoon';
                    greetingSuffix ='How have the alerts been treating you today? Alert a friend for a quick match by clicking "Invite a player"!';
                } else if (18 <= currentHour && 21 > currentHour) {
                    greetingPreffix = 'Good evening';
                    greetingSuffix = 'Starting to feel a little weary? Nothing like a small Pong break';
                } else if (21 <= currentHour || 5 > currentHour) {
                    greetingPreffix = 'Good night';
                    greetingSuffix = 'Is there still someone left at the office with you? It would be rude not to invite them for a match.';
                }

                return {
                    Preffix: greetingPreffix,
                    Suffix: greetingSuffix
                };
            }


            getUserDetails();
            getTournament();
            getTable();


            setInterval(function () {
                getTable();
                getTournament();
            }, 5000);


            $scope.ShowTournament = function (Tournament) {
                    ngDialog.open(
                        {
                            template: '/html/table/popups/tournament.html',
                            className: 'ngdialog-theme-default tournament-popup',
                            scope  : $scope
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

                                    $scope.AddScore = function (MatchId, Winner, IsWinner) {
                                        HttpRequest(
                                            {
                                                method: 'POST',
                                                url: '/matches/add-score/' + MatchId,
                                                data: {winner: Winner}
                                            }
                                        ).then(
                                            function () {
                                                ngDialog.close();
                                                $scope.Greeting.Preffix = (true === IsWinner) ? 'Keep on rocking' : 'Don\'t lose hope';
                                                $scope.Greeting.Suffix = (true === IsWinner) ? 'Challlenge yourself by playing against a better opponent' : 'Your\'e the winner material';
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