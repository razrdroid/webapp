(function() {

    angular
        .module('app')
        .controller('SearchAllController', [
            '$scope',
             '$timeout',
             '$q',
             'tokenService',
             '$stateParams',
             '$state',
             '$rootScope',
             '$sce', 
             '$filter', 
            SearchAllController
        ]);

    function SearchAllController($scope, $timeout, $q, tokenService, $stateParams, $state, $rootScope, $sce, $filter) {
        var vm = this;

        $scope.events = [];
        $scope.students = [];
        $scope.creativity = [];
        $scope.searchTypes = [];
        $scope.nonFinalContents = [];
        $scope.finalContents = [];

        $scope.listLoading = true;
        $scope.query = $stateParams.query;

        $scope.searchText = $stateParams.query;
        vm.currentNavItem = "students";

        $scope.types = [
            { 'title': 'Articles', 'id': 1 },
            { 'title': 'Poetry', 'id': 2 },
            { 'title': 'Drama', 'id': 3 },
            { 'title': 'Paint and Colour', 'id': 4 },
            { 'title': 'Drawing ', 'id': 5 },
            { 'title': 'Sewing and Fabric', 'id': 6 },
            { 'title': 'Craft', 'id': 7 },
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
        $scope.mediaTypes = [4, 5, 6, 7, 12, 15, 16];
        
        $scope.searched = function(item, text) {
            if (item == 'events') {
                $state.go('home.searchEvents', { query: text });
            } else if (item == 'creativity') {
                $state.go('home.searchCreativity', { query: text });
            } else if (item == 'students') {
                $state.go('home.searchStudents', { query: text });
            } else if (item == 'searchAll') {
                $state.go('home.searchAll', { query: text });

            }
        };
        $scope.searchedFast = function(text) {
            $state.go('home.searchAll', { query: text });
        };
        
        var flexOrder = function(length) {
            if (length > 10) {
                return (10 + (length % 10));
            } else {
                return length;
            }
        };
        if ($stateParams.query == "") {
            $scope.listLoading = false;
        } else {
            tokenService.get("search/" + $scope.query)
                .then(function(tableData) {
                    console.log(tableData);
                    $scope.listLoading = false;
                    if (tableData.students.data != 'undefined') {
                        $scope.students = tableData.students.data;
                        $scope.fos = flexOrder($scope.students.length);
                    }
                    if (tableData.content.data != 'undefined') {
                        $scope.contents = tableData.content.data;
                        $scope.foc = flexOrder($scope.contents.length);
                        //
                        $scope.nonFinalContents = [];
                        $scope.contents.forEach(function(content) {
                            cardObject = {};
                            cardObject.Actions = content.actions;
                            cardObject.Tags = content.Tags;
                            cardObject.created_at = content.created_at;
                            cardObject.created_at = Date.parse(cardObject.created_at.replace('-', '/', 'g')); //replace mysql date to js date format
                            cardObject.id = content.id;
                            cardObject.owner= content.owner;
                            cardObject.content_type= content.content_type;
                            $scope.types.some(function(obj) {
                                if (obj.id == cardObject.content_type) {
                                    console.log(cardObject.category);
                                    cardObject.category = obj.title;
                                    cardObject.categoryId = obj.id;
                                } else {
                                    return;
                                }
                            });
                            cardObject.title = $sce.trustAsHtml(content.title);
                            content.items.data.forEach(function(item) {
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
                                cardObject.description = $filter('limitTo')(cardObject.description, 110, 0)

                            }
                            content = {};
                            $scope.nonFinalContents.push(cardObject);
                            $scope.loading = false;

                        });
                        $scope.finalContents = $scope.finalContents.concat($scope.nonFinalContents);
                        console.log($scope.finalContents);
                        //
                    }
                    if (tableData.event.data != 'undefined') {
                        $scope.events = tableData.event.data;
                        $scope.foe = flexOrder($scope.events.length);
                    }
                });
        }
    }
})();
