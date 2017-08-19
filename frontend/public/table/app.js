    (function() {
    var MainApp = angular.module('MainApp', ['ngDialog', 'StaticServices']);

    var mainController = MainApp.controller('MainController',
        function ($scope, $timeout, $sce, ngDialog, HttpRequest) {
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

            function getTournament() {
                HttpRequest(
                    {
                        method: 'GET',
                        url: '/tournament'
                    },
                    true
                ).then(
                    function (data) {
                        // data.Data = {
                        //     stages:
                        //         [
                        //             [
                        //                 {
                        //                     score: {
                        //                         winner: '5996db143bb73f035087af50',
                        //                     },
                        //                     invitee: '5996db143bb73f035087af50',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5996fc3ddad666079747faba',
                        //                     },
                        //                     invitee: '5996fc3ddad666079747faba',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997305e1897173a5d971f49',
                        //                     },
                        //                     invitee: '5997305e1897173a5d971f49',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599730761897173a5d971f4a',
                        //                     },
                        //                     invitee: '599730761897173a5d971f4a',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599730b51897173a5d971f4b',
                        //                     },
                        //                     invitee: '599730b51897173a5d971f4b',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599730c51897173a5d971f4c',
                        //                     },
                        //                     invitee: '599730c51897173a5d971f4c',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599731131897173a5d971f4e',
                        //                     },
                        //                     invitee: '599731131897173a5d971f4e',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997312b1897173a5d971f4f',
                        //                     },
                        //                     invitee: '5997312b1897173a5d971f4f',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997324834e82d0f5c235c63',
                        //                     },
                        //                     invitee: '5997324834e82d0f5c235c63',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997326d34e82d0f5c235c64',
                        //                     },
                        //                     invitee: '5997326d34e82d0f5c235c64',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997328634e82d0f5c235c65',
                        //                     },
                        //                     invitee: '5997328634e82d0f5c235c65',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599732a334e82d0f5c235c66',
                        //                     },
                        //                     invitee: null,
                        //                     inviter: '599732a334e82d0f5c235c66'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599732bd34e82d0f5c235c67',
                        //                     },
                        //                     invitee: null,
                        //                     inviter: '599732bd34e82d0f5c235c67'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599732dc34e82d0f5c235c68',
                        //                     },
                        //                     invitee: null,
                        //                     inviter: '599732dc34e82d0f5c235c68'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997330034e82d0f5c235c69',
                        //                     },
                        //                     invitee: '5997330034e82d0f5c235c69',
                        //                     inviter: null
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997331b34e82d0f5c235c6a',
                        //                     },
                        //                     invitee: '5997331b34e82d0f5c235c6a',
                        //                     inviter: '5997333b34e82d0f5c235c6b'
                        //                 }
                        //             ],
                        //             [
                        //                 {
                        //                     score: {
                        //                         winner: '5996db143bb73f035087af50',
                        //                     },
                        //                     invitee: '5996db143bb73f035087af50',
                        //                         inviter: '5996fc3ddad666079747faba'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997305e1897173a5d971f49',
                        //                     },
                        //                     invitee: '599730761897173a5d971f4a',
                        //                         inviter: '5997305e1897173a5d971f49'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599730b51897173a5d971f4b',
                        //                     },
                        //                     invitee: '599730b51897173a5d971f4b',
                        //                         inviter: '599730c51897173a5d971f4c'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599731131897173a5d971f4e',
                        //                     },
                        //                     invitee: '599731131897173a5d971f4e',
                        //                         inviter: '5997312b1897173a5d971f4f'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997324834e82d0f5c235c63',
                        //                     },
                        //                     invitee: '5997324834e82d0f5c235c63',
                        //                         inviter: '5997326d34e82d0f5c235c64'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997328634e82d0f5c235c65',
                        //                     },
                        //                     invitee: '5997328634e82d0f5c235c65',
                        //                         inviter: '599732a334e82d0f5c235c66'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599732bd34e82d0f5c235c67',
                        //                     },
                        //                     invitee: '599732bd34e82d0f5c235c67',
                        //                         inviter: '599732dc34e82d0f5c235c68'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997330034e82d0f5c235c69',
                        //                     },
                        //                     invitee: '5997330034e82d0f5c235c69',
                        //                         inviter: '5997331b34e82d0f5c235c6a'
                        //                 }
                        //             ],
                        //             [
                        //                 {
                        //                     score: {
                        //                         winner: '5997305e1897173a5d971f49',
                        //                     },
                        //                     invitee: '5996db143bb73f035087af50',
                        //                     inviter: '5997305e1897173a5d971f49'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599730b51897173a5d971f4b',
                        //                     },
                        //                     invitee: '599730b51897173a5d971f4b',
                        //                     inviter: '599731131897173a5d971f4e'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997328634e82d0f5c235c65',
                        //                     },
                        //                     invitee: '5997324834e82d0f5c235c63',
                        //                     inviter: '5997328634e82d0f5c235c65'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '599732bd34e82d0f5c235c67',
                        //                     },
                        //                     invitee: '599732bd34e82d0f5c235c67',
                        //                     inviter: '599732dc34e82d0f5c235c68'
                        //                 }
                        //             ],
                        //             [
                        //                 {
                        //                     score: {
                        //                         winner: '599730b51897173a5d971f4b',
                        //                     },
                        //                     invitee: '5997305e1897173a5d971f49',
                        //                     inviter: '599730b51897173a5d971f4b'
                        //                 },
                        //                 {
                        //                     score: {
                        //                         winner: '5997328634e82d0f5c235c65',
                        //                     },
                        //                     invitee: '5997328634e82d0f5c235c65',
                        //                     inviter: '599732bd34e82d0f5c235c67'
                        //                 }
                        //             ],
                        //             [
                        //                 {
                        //                     score: {
                        //                         winner: '5997328634e82d0f5c235c65',
                        //                     },
                        //                     invitee: '599730b51897173a5d971f4b',
                        //                     inviter: '5997328634e82d0f5c235c65'
                        //                 }
                        //             ]
                        //         ]
                        // };

                        $scope.Tournament = data.Data;
                        var lastStage = $scope.Tournament.stages[$scope.Tournament.stages.length-1];
                        $scope.TournamentFinished = (1 === lastStage.length && lastStage[0].score.winner) ? true : false;
                        if (true === $scope.TournamentFinished) {
                            $scope.TournamentWinner = $scope.IdToName[lastStage[0].score.winner];
                        }
                        $timeout(function () {
                            var maxGamesPerRound = $scope.Tournament.stages[0].length;
                            $('.tournament_container').height(maxGamesPerRound * 100 + 100);
                            $('.round').width((100 / (Math.log2(maxGamesPerRound) + 2   ) + '%'));
                            if(-1 === $('.round-winner').attr('style').indexOf('padding-left')) {
                                $('.round-winner').attr('style', $('.round-winner').attr('style') + 'padding-left: 20px;');
                            }
                        }, 100);
                    }
                );
            }

            getUserDetails();
            getTable().then(
                function () {
                    getTournament();
                }
            )



            setInterval(function () {
                getTable();
                //getTournament();
            }, 5000);


            $scope.ShowTournament = function (Tournament) {
                var container = $('body');
                var tournamentContainer = (true === $scope.TournamentFinished) ? $('.tournament_winner_announcement') : $('.tournament_container');
                container.animate({
                    scrollTop: tournamentContainer .offset().top
                });
                $scope.ClickedShowTournament = true;

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
                                );
                            };
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
                );
            };

            var embedYoutubePreffix = 'https://www.youtube.com/embed/';
            var autoPlaySuffix = '?autoplay=1';
            var songsToChoose = [
                embedYoutubePreffix + 'skVg5FlVKS0' + autoPlaySuffix + '&start=1',
                embedYoutubePreffix + 'HLSvJWSJ9cA' + autoPlaySuffix + '&start=2',
                embedYoutubePreffix + 'mNU3aIJs88g' + autoPlaySuffix + '&start=260',
                embedYoutubePreffix + '92cwKCU8Z5c' + autoPlaySuffix + '&start=235',
                embedYoutubePreffix + 'pRQX6Xp2B48' + autoPlaySuffix + '&start=130',
                embedYoutubePreffix + 'WjQgsyPkuCk' + autoPlaySuffix + '&start=107',
                embedYoutubePreffix + 'ncQsBzI-JHc' + autoPlaySuffix + '&start=154',
                embedYoutubePreffix + '5tepYJno7rU' + autoPlaySuffix + '&start=112',
                embedYoutubePreffix + 'pmFpjBUhPA4' + autoPlaySuffix + '&start=158',
                embedYoutubePreffix + '3wxyN3z9PL4' + autoPlaySuffix + '&start=195',
                embedYoutubePreffix + 'Wmc8bQoL-J0' + autoPlaySuffix + '&start=217',
            ];
            var randomIndex = parseInt(Math.random() * songsToChoose.length);
            $scope.RandomVictorySong = $sce.trustAsResourceUrl(songsToChoose[randomIndex]);
        }
    );
}());