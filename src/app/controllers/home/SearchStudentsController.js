(function() {

    angular
        .module('app')
        .controller('SearchStudentsController', [
            '$scope', '$timeout', '$q', 'tokenService','$stateParams',
            SearchController
        ]);

    function SearchController($scope, $timeout, $q, tokenService,$stateParams) {
        var vm = this;
        $scope.tests = 'test';
        $scope.events ={};
                $scope.query = $stateParams.query;

        $scope.followers = [{
            'name': 'Rohan Goel',
            'image': 'https://avatars2.githubusercontent.com/u/14099191?v=3&u=e03e9a657eb1e4de7da062cc5a5611092f0f2d7e&s=400',
            'about': 'Hello there i do this',
            'college': 'Thapar University',
            'skills':['angularjs', 'nodejs', 'anal', 'raddish', 'fisting']
        }, {
            'name': 'Rohan Goel',
            'image': 'https://avatars3.githubusercontent.com/u/6951276?v=3&s=400',
            'about': 'Hello there i do this',
            'college': 'Thapar University',
            'skills': ['cabbage', 'anal', 'missionary']
        }];
      tokenService.get("search/students/" + $scope.query)
            .then(function(tableData) {

                $scope.loading = false;
                $scope.followers = $scope.events.concat(tableData.data);
                console.log($scope.events);
            });
    }
})();