testApp.controller('thumbsCtrl', function($scope, $rootScope, $http){
    $scope.layouts = [];
    $rootScope.currPageNum = 1;
    $rootScope.assetsPath = 'assets/layouts/1/';

    var promise = $http.get('/js/assets/test.json')
        .success(function(data){
            assetLib = data.assetLib;
            data = data.data;

            angular.forEach(assetLib, function(value, key){
                $scope.layouts.push({src: $rootScope.assetsPath + value, numUsed: 0});
            });
        });

    $scope.addAsset = function(){
        var assetChosen = this.$index;
        $rootScope.$broadcast('assetAdded', assetChosen);//events attached to rootScope
        this.layout.numUsed++;
    };

    $scope.makeFavorite= function(){
        event.stopPropagation();
        if( !this.layout.fav)
            this.layout.fav = {opacity: 1.0};
        else
        if(this.layout.fav.opacity == 1.0)
            this.layout.fav = {opacity: 0.6}
    };
})