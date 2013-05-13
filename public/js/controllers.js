
function mainCtrl($rootScope){
    pages = $rootScope.pages = [];

    $rootScope.statShow='Show';
    $rootScope.photos = 0;
    $rootScope.stats = [];
    $rootScope.pages = [];
    $rootScope.statsLoaded = false;
    $rootScope.pageAdded = false;
    prevPage = 1;

}
function pageCtrl($scope, $rootScope, mylocalStorage, $routeParams){

    displayedNum = $rootScope.currPageNum = parseInt($routeParams.currPageNum);
    pageIx = displayedNum-1;
    var currP;

    $scope.gotoPage = function (currPageNum, inc){
        inc = inc || 0;
        prevPage = window.location.hash.match(/\d+$/)[0];
        var gotoPg = parseInt(currPageNum) + inc;

        if( !$rootScope.statsLoaded )
            pagesLen = mylocalStorage.get('*');

        if( !$rootScope.pageAdded && ($rootScope.pagesNum < gotoPg || gotoPg < 1)){
            alert("Such page does not exist");
            currP = $rootScope.currPageNum = prevPage
        }else
            currP = $rootScope.currPageNum = gotoPg

        if(inc > 0)
            $scope.nextPageNum = "#/pages/" + currP;
        if(inc < 0)
            $scope.prevPageNum = "#/pages/" + currP;
        else{
            $scope.gotoPageNum = "#/pages/" + currP;
        }
    };


    if(displayedNum==1 && JSON.stringify(mylocalStorage.get('0')).length < 3
        || $rootScope.pageAdded){
        $scope.page = { frames:[], ix: 0, stat:[], changed: false };
        $rootScope.pageAdded = false;
    }else
        getCachedData();

    function getCachedData(){

        if( !$rootScope.statsLoaded ){
            $rootScope.pagesNum = pagesLen = mylocalStorage.get('*');
            var photos = 0;
            angular.forEach($rootScope.stats, function(stat){
                photos += stat.length
            })
            $rootScope.photos = photos;
        }
        var data = mylocalStorage.get(pageIx)
        if(JSON.stringify(data).length < 3) data = {};

        init(null, data);
    };

    $scope.safeApply = function(fn) {
        if(!$scope.$$phase) $scope.$apply(fn)
    }

    $scope.delete = function(frame){
        $scope.frames.splice(frames.indexOf(frame), 1)
    }

    $scope.prevPage = function (){
        this.gotoPage( $scope.currPageNum, -1 )
    };

    $scope.nextPage = function (){
        this.gotoPage( $scope.currPageNum, 1 );
    };

    $scope.addPage = function (){
        var newURL = 1+ parseInt($scope.currPageNum);
        $scope.nextPageNum = "#/pages/" + newURL;

        $rootScope.pagesNum++;
        $rootScope.pageAdded = true;
    };

    $scope.$on('assetAdded', function (event, assetChosen){
        //no routing appied so direct passing to func
        init(event, {frames: data[assetChosen]})
    });

    $scope.savePage = function (){
        if($scope.statShow=='Hide')
            return;

        var page = $scope.page,
            statsToUpdate = [];

        var prevInfo = mylocalStorage.get(page.ix).frames;

        angular.forEach(page.frames, function(frame, key){
            var rData = JSON.stringify(frame.rasterData);
            if(rData && rData.length > 3){
                if(JSON.stringify(page.stat[key]) != rData){
                    page.changed = true;
                }
                page.stat[key] = frame.rasterData;
                page.stat[key]['a_pageNum'] = page.ix+1;

            }
            statsToUpdate = {ix: page.ix, stat: page.stat }
        });

        mylocalStorage.save(page);
        $rootScope.$broadcast('updateStat', statsToUpdate)

        pages[page.ix] = page;

        page.changed = false;
    };


    $rootScope.toggleStat = function(){
//        if($scope.page.changed)
            this.savePage(true);

        //this is due to controlling button belongs to mainCtrl scope
        $rootScope.statShow= $rootScope.statShow=='Hide'? 'Show' : 'Hide';
    }

    function init(event, data){
//        if($scope.page.images > 0 || $scope.page.images){
//            var conf = confirm('All frames on this page will be deleted. OK to proceed?')
//            if( !conf ) return;
//        }

        var frames = data.frames,
            stat = data.stat || [];

        var page = $scope.page = {images: 0, changed: false, frames: frames, ix: pageIx, stat:stat};

            angular.forEach(page.frames, function(frame, key){
                frame.style = {left: frame.x+'px', top: frame.y+"px", width: frame.w+"px", height:frame.h+"px"}

                frame.imgdata = frames[key].imgdata || '';
                frame.rasterData = frames[key].rasterData || '';
                frame.imgstyle = frames[key].imgstyle || {left:0, top:0};

                frame.color = "#AAA";
                frame.editing = false;
                frame.imgEditing = false;

                //should not be changed
                frame.imgframe = JSON.parse(JSON.stringify(frame.style));
                frame.imgcontrols = {};
                frame.framecontrols = {};
            })
        pages[pageIx] =  $scope.page;
    }
};




function thumbsCtrl($scope, $rootScope){
    $scope.layouts = [];
    $rootScope.currPageNum = 1;
    $rootScope.assetsPath = 'assets/layouts/1/';

    angular.forEach(assetLib, function(value, key){
        $scope.layouts.push({src: $rootScope.assetsPath + value, numUsed: 0});
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
}

mainCtrl.$inject = ['$rootScope'];
pageCtrl.$inject = ['$scope', '$rootScope', 'mylocalStorage', '$routeParams', '$http'];
thumbsCtrl.$inject = ['$scope', '$rootScope', '$http'];
