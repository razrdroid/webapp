(function() {

    angular
        .module('app')
        .controller('DashboardController', [
            '$mdDialog',
            '$scope',
            'tokenService',
            'Upload',
            '$location',
            '$sce',
            '$filter',
            '$state',
            '$rootScope',
            DashboardController
        ]);

    function DashboardController($mdDialog, $scope, tokenService, Upload, $location, $sce, $filter, $state, $rootScope) {
        $scope.events = {};
        $rootScope.title = "Dashboard";
        $scope.updatesLoading = true;
        $scope.eventLoading = true;
        $scope.eventTopLoading = true;
        $scope.creativityLoading = false;
        $scope.contentTopLoading = true;
        $scope.offset = 0;
        $scope.nonFinalContents = [];
        $scope.finalContents = [];
        $scope.types = [
            { 'title': 'Articles', 'id': 1 },
            { 'title': 'Poetry', 'id': 2 },
            { 'title': 'Drama', 'id': 3 },
            { 'title': 'Paint and Colour', 'id': 4 },
            { 'title': 'Drawing ', 'id': 5 },
            { 'title': 'Sewing and Fabric', 'id': 6 },
            { 'title': 'Craft', 'id': 7 },
            // { 'title': 'Dancing', 'id': 8 },
            { 'title': 'Dancing', 'id': 8 },
            { 'title': 'Singing', 'id': 9 },
            { 'title': 'Instrumental', 'id': 10 },
            { 'title': 'Digital Music', 'id': 11 },
            { 'title': 'Decor', 'id': 12 },
            { 'title': 'Film and Video', 'id': 13 },
            { 'title': 'Animation', 'id': 14 },
            { 'title': 'Graphics', 'id': 15 },
            { 'title': 'UI and UX', 'id': 16 },
            { 'title': 'Websites', 'id': 17 },
            { 'title': 'Programming', 'id': 18 },
            { 'title': 'Apps', 'id': 19 },
            { 'title': 'Electronics', 'id': 20 },
            { 'title': 'DIY', 'id': 21 }
        ];

        $scope.tags = ['AngularJs', 'Web Developement', 'Elon Musk', 'Poetry', 'Artificial Intelligence', 'Product Design', 'Feminism', 'Technology', 'Self Driving Cars'];
        var cardObject = {};
        $scope.finalContents = [];
        $scope.mediaTypes = [4, 5, 6, 7, 12, 15, 16];
        // $scope.selectedState = "going"
        $scope.change = function(event, index, state) {
            switch (state) {
                case 0:
                    console.log('post 0');
                    $scope.events[index].participation_state = 0;
                    tokenService.delete('rsvpEvent/' + event.id, '').then(function(result) {
                        getParticipationState(event, index);
                    });
                    break;
                case 1:
                    console.log('post 1');
                    $scope.events[index].participation_state = 1;
                    tokenService.post('rsvpEvent/' + event.id + '/' + 1).then(function(result) {
                        getParticipationState(event, index);
                    });
                    break;
                case 2:
                    console.log('post 2');
                    $scope.events[index].participation_state = 2;
                    tokenService.post('rsvpEvent/' + event.id + '/' + 2).then(function(result) {
                        getParticipationState(event, index);
                    });
                    break;
            }
        }
        $scope.getParticipationState = function(event, index) {
                if ($scope.events[index].participation_state == 1) {
                    return "Going";
                } else if ($scope.events[index].participation_state == 2) {
                    return "Intrested";
                } else {
                    return "Not going";
                }
            }
            // tokenService.get("eventsDashboard")
            // changing temporarily till api is fixed
        tokenService.get("minievents?limit=3")
            .then(function(events) {
                $scope.events = events.data;
                console.log($scope.events);
                $scope.eventLoading = false;
                // $scope.myPagingFunction();
                // tokenService.get("contentsRandom")
                tokenService.get("contentsRandom")
                    .then(function(contentsDashboard) {
                        $scope.contents = contentsDashboard.data;
                        $scope.contentsTop = contentsDashboard.data;
                        $scope.contentLoading = false;
                        $scope.contentTopLoading = false;
                        $scope.contents.forEach(function(content) {
                            cardObject = {}
                            $scope.loading == false;
                            cardObject.Actions = content.Actions;
                            cardObject.Tags = content.Tags;
                            cardObject.created = content.created;
                            cardObject.created.at = Date.parse(cardObject.created.at.replace('-', '/', 'g')); //replace mysql date to js date format
                            cardObject.id = content.id;
                            cardObject.title = $sce.trustAsHtml(content.title);
                            cardObject.links = content.links;
                            cardObject.total = content.links;
                            content.Items.data.forEach(function(item) {
                                if (item.type == 'text') {
                                    cardObject.description = item.description;
                                    // cardObject.description = $filter('limitTo')(item.description, 110, 0);
                                    cardObject.description = $sce.trustAsHtml(cardObject.description);
                                } else if (item.type == 'cover' && !cardObject.type) {
                                    cardObject.type = item.type;
                                    cardObject.url = item.image;
                                } else if ((item.type == 'youtube' || item.type == 'soundcloud' || item.type == 'vimeo') && !cardObject.type) {
                                    cardObject.type = item.type;
                                    cardObject.url = $sce.trustAsResourceUrl(item.embed.url);
                                } else if (((item.type == 'cover') || (item.type == 'image')) && !cardObject.type) {
                                    cardObject.type = item.type;
                                    cardObject.url = item.image;
                                }
                            });
                            if (cardObject.type != 'cover' || cardObject.type != 'soundcloud' || cardObject.type != 'youtube') {
                                cardObject.description = $filter('limitTo')(cardObject.description, 90, 0)
                            } else {
                                cardObject.description = $filter('limitTo')(cardObject.description, 150, 0)

                            }
                            $scope.contentsTop.push(cardObject);
                            content = {};
                            $scope.loading = false;
                        });
                    });
                $scope.myPagingFunction();
            });
        $scope.showLikes = function(id, title) {
            $mdDialog.show({
                controller: 'ShowLikesController',
                templateUrl: 'app/views/partials/showLikes.html',
                parent: angular.element(document.body),
                scope: $scope,
                locals: {
                    title: title,
                    id: id
                },
                preserveScope: true,
                escapeToClose: true,
                fullscreen: true,
                clickOutsideToClose: true,
                controllerAs: 'dc'
            })
        }
        $scope.stop = function($event) {
            $event.stopPropagation();
        }
        $scope.myPagingFunction = function() {
            if ($scope.creativityLoading == false && $scope.offset < 5) {
                $scope.creativityLoading = true;
                $scope.meraTitle = "abcd";
                tokenService.get("contents?limit=3&offset=" + $scope.offset)
                    .then(function(tableData) {
                        $scope.creativityLoading = false;
                        if (tableData.data.length < 3) {
                            $scope.moreItems = false;
                        }
                        $scope.nonFinalContents = [];
                        $scope.contents = tableData.data;

                        $scope.contents.forEach(function(content) {
                            cardObject = {};
                            cardObject.Actions = content.Actions;
                            cardObject.Tags = content.Tags;
                            cardObject.created = content.created;
                            cardObject.created.at = Date.parse(cardObject.created.at.replace('-', '/', 'g')); //replace mysql date to js date format
                            cardObject.id = content.id;
                            cardObject.title = $sce.trustAsHtml(content.title);
                            cardObject.content = content.content;
                            $scope.types.some(function(obj) {
                                if (obj.id == cardObject.content.type) {
                                    cardObject.content.category = obj.title;
                                } else {
                                    return;
                                }
                            });
                            cardObject.links = content.links;
                            cardObject.total = content.links;
                            content.Items.data.forEach(function(item) {
                                if (item.type == 'text') {
                                    cardObject.description = item.description;
                                    cardObject.description = $sce.trustAsHtml(cardObject.description);
                                } else if ((item.type == 'cover' && !cardObject.type)) {
                                    cardObject.type = item.type;
                                    cardObject.url = item.image;
                                } else if (item.type == 'soundcloud') {
                                    cardObject.type = item.type;
                                    item.embed.url = "//w.soundcloud.com/player/?url=" + item.embed.url;
                                    cardObject.url = $sce.trustAsResourceUrl(item.embed.url);
                                } else if ((item.type == 'youtube' || item.type == 'vimeo') && !cardObject.type) {
                                    cardObject.type = item.type;
                                    cardObject.url = $sce.trustAsResourceUrl(item.embed.url);
                                } else if (((item.type == 'cover') || (item.type == 'image')) && !cardObject.type) {
                                    cardObject.type = item.type;
                                    cardObject.url = item.image;
                                }
                            });
                            if (cardObject.type != 'cover' || cardObject.type != 'soundcloud' || cardObject.type != 'youtube') {
                                cardObject.description = $filter('limitTo')(cardObject.description, 90, 0)
                            } else {
                                cardObject.description = $filter('limitTo')(cardObject.description, 150, 0)

                            }
                            $scope.nonFinalContents.push(cardObject);
                            content = {};
                            $scope.creativityLoading = false;

                        });
                        $scope.creativityLoading = false;
                        $scope.finalContents = $scope.finalContents.concat($scope.nonFinalContents);
                        $scope.offset += 3;
                        $scope.myPagingFunction();
                    });
            }
        };

        // $scope.myPagingFunction();


        $scope.heart = function(content, $index) {
            if ($rootScope.authenticated) {
                $scope.finalContents[$index].Actions.Appreciate.status = !$scope.finalContents[$index].Actions.Appreciate.status;
                if ($scope.finalContents[$index].Actions.Appreciate.status) {
                    $scope.finalContents[$index].Actions.Appreciate.total += 1;
                    tokenService.post('appreciateContent/' + content.id).then(function(result) {


                    });
                } else {
                    $scope.finalContents[$index].Actions.Appreciate.total -= 1;

                    tokenService.delete('appreciateContent/' + content.id, '').then(function(result) {

                    });
                }
            } else {
                $rootScope.openLoginDialog(function() {
                    $scope.heart(content, $index);
                });
            }
        }
        $scope.bookmark = function(content, index) {
            if ($rootScope.authenticated) {

                $scope.finalContents[index].Actions.Bookmarked.status = !$scope.finalContents[index].Actions.Bookmarked.status;
                if ($scope.finalContents[index].Actions.Bookmarked.status) {
                    $scope.finalContents[index].Actions.Bookmarked.total += 1;
                    tokenService.post('bookmarkContent/' + content.id).then(function(result) {

                    });
                } else {
                    $scope.finalContents[index].Actions.Bookmarked.total -= 1;
                    tokenService.delete('bookmarkContent/' + content.id, '').then(function(result) {

                    });
                }
            } else {
                $rootScope.openLoginDialog(function() {
                    $scope.bookmark(content, index);
                });
            }
        }
        $scope.openProfile = function($event, username) {
            $event.stopPropagation();
            $state.go('home.profile', { username: username });
        };
        $scope.heartEvent = function(event, $index) {
            if ($rootScope.authenticated) {
                $scope.events[$index].Actions.Bookmarked.status = !$scope.events[$index].Actions.Bookmarked.status;
                if ($scope.events[$index].Actions.Bookmarked.status) {
                    $scope.events[$index].Actions.Bookmarked.total += 1;
                    tokenService.post('bookmarkEvent/' + event.id).then(function(result) {


                    });
                } else {
                    $scope.events[$index].Actions.Bookmarked.total -= 1;

                    tokenService.delete('bookmarkEvent/' + event.id, '').then(function(result) {

                    });
                }
            } else {
                $rootScope.openLoginDialog(function() {
                    $scope.heartEvent(event, $index);
                });
            }
        }
        $scope.rsvpEvent = function(event, index, state, $event) {
            $event.stopPropagation();
            if ($rootScope.authenticated) {
                // $scope.events[$index].participation_state = state;
                switch (state) {
                    case 2:
                        $scope.events[index].participation_state = 2;
                        tokenService.post('rsvpEvent/' + event.id + '/' + 2).then(function(result) {
                            getParticipationState(event, index);
                        });
                        break;
                    case 1:
                        $scope.events[index].participation_state = 1;
                        tokenService.post('rsvpEvent/' + event.id + '/' + 1).then(function(result) {
                            getParticipationState(event, index);
                        });
                        break;
                }
            } else {
                $rootScope.openLoginDialog(function() {
                    $scope.rsvpEvent(event, $index);
                });
            }
        }
    }


})();
