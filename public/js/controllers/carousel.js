testApp.controller('MyCarousel', function($rootScope, $scope){
    $scope.$on('$routeChangeSuccess', function(event, routeData){

        var curr = routeData.params.currPageNum || 1,
            prev = $rootScope.prevPageNum || 0,
            delta = (curr>prev) ? 1000 : -1000;

        $scope.carousel[0].style= {left: 0};

        $scope.page.style = {left: delta+"px"}
        $scope.carousel[1] = $scope.page;

        $scope.carousel.style = {left: - delta+"px"};
    })
})
