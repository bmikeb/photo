testApp.directive('myCarousel', function($document, $log, mylocalStorage, $timeout){

    testApp.controller('myCarousel', function(){
        
    })
    return {
        scope: true,
        controller: function($rootScope, $scope, $log){
            $scope.$on('$routeChangeSuccess', function(event, routeData){

                var curr = routeData.params.currPageNum || 1,
                    prev = $rootScope.prevPageNum || 0;

                delta = (curr>prev) ? 1000 : -1000;
                $scope.carousel = event.targetScope.carousel;
                if(typeof carousel.style=='undefined')
                    carousel.style = {left: 0}

                pageStyle = $scope.page.style = {left: delta+"px"}
                $scope.carousel[1] = $scope.page;

                $scope.carousel.style = {left: - delta+"px"};

                $log.log($scope.carousel.style.left +'; '+ pageStyle.left)

                $timeout(function(){
                    $scope.carousel.splice(0, 1)
                }, 1000)
            })
        },
        link: function (scope, el, attr){
            el.attr({id: 'carousel'});
        }
    }
})
