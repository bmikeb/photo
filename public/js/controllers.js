function mainCtrl($rootScope, $scope, mylocalStorage){
    pages = $rootScope.pages = [];
    carousel = $rootScope.carousel=[];

    $rootScope.statShow='Show';
    $rootScope.photos = 0;
    $rootScope.stats = [];
    $rootScope.pagesNum = 0;
}

function pageCtrl($scope, $rootScope, mylocalStorage, $routeParams, $timeout, $log){

    var currPage = Number($routeParams.currPageNum);

    function getStat(){
        $rootScope.pagesNum = mylocalStorage.get('*');
        var photos = 0;
        angular.forEach($rootScope.stats, function(stat){
            photos += stat.length
        })
        $rootScope.photos = photos;
    }
    function getCachedData(pageIx){
        var data = mylocalStorage.get(pageIx)
        if(JSON.stringify(data).length < 3) data = {frames:[]};

        return init(null, data, pageIx);
    };

    $scope.safeApply = function(fn) {
        if(!$scope.$$phase) $scope.$apply(fn)
    }

    $scope.gotoPage = function ( inc){
        $scope.inc = inc || 0;//if number enterd directly in text field
        //to digit because currPageNum is input's data
        $rootScope.prevPageNum = parseInt($scope.currPageNum);

        var gotoPg = Math.abs(inc)==1 ? $rootScope.prevPageNum + inc : inc;

        pagesLen = $rootScope.pagesNum;
        if( pagesLen < gotoPg || gotoPg < 1){
            alert("Such page does not exist");
            return;
        }
        gotoPg = (gotoPg > pagesLen) ? 1 : (gotoPg < 1 ? pagesLen : gotoPg);
        $rootScope.gotoPageNum = "#/pages/" + gotoPg;
    }

    $scope.prevPage = function (){
        this.gotoPage( -1 )
    };

    $scope.nextPage = function (){
        this.gotoPage( 1 );
    };

    $scope.addPage = function (){
        $scope.gotoPageNum = "#/pages/"+ Number(1+parseInt($rootScope.currPageNum));
        $rootScope.pagesNum++;
    };

    $scope.$on('assetAdded', function (event, assetChosen){
        var newPage = $rootScope.carousel[0] = init(event, {frames: data[assetChosen]}, $rootScope.currPageNum-1)
        newPage.style= {left: 1000+'px'}
    });

    $scope.$on('pageChanged', function (event){
        $scope.changed = true;
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
                page.stat[key] = frame.rasterData;
                page.stat[key]['a_pageNum'] = page.ix+1;
            }
            statsToUpdate = {ix: page.ix, stat: page.stat }
        });

        mylocalStorage.save(page);
        $rootScope.$broadcast('updateStat', statsToUpdate);

        //only data to display in stats fileds below arrows
        $scope.pages[page.ix] = statsToUpdate;
        $scope.changed = false;
    };

    function init(event, data, pageIx){
//        if($scope.page.stat.length > 0 ){
//            var conf = confirm('All frames on this page will be deleted. OK to proceed?')
//            if( !conf ) return;
//        }
        var frames = data.frames, style;
        var page = $scope.page = {/*changed: false, */frames: frames, ix: pageIx, stat:data.stat || []};
            angular.forEach(page.frames, function(frame, key){
                style = {left: frame.x+'px', top: frame.y+"px", width: frame.w+"px", height:frame.h+"px"}
                angular.extend(frame, {
                    style: style,

                    imgdata: frames[key].imgdata || '',
                    rasterData: frames[key].rasterData || '',
                    imgstyle: frames[key].imgstyle || {left:0, top:0},
                    imgframe: JSON.parse(JSON.stringify(style)), imgcontrols: {}, framecontrols: {},

                    color: "#AAA", editing: false, imgEditing: false
                })
            })
        pages[pageIx] =  {ix: pageIx, stat:data.stat || []};
        return page;
    }

    $rootScope.toggleStat = function(){
        this.savePage(true);
        $rootScope.statShow= $rootScope.statShow=='Hide'? 'Show' : 'Hide';
    }

    //at the moment $routeParams already configured 'cos ctrl is loaded after hash resolving and holds new page Number
    //first is for normal flow (when prevPage exists, second -- for when page refresh)
    var prevIX = $rootScope.prevPageNum - 1 || Number($routeParams.currPageNum) - 2
    var prevP = getCachedData(prevIX);
    $rootScope.carousel[0] = prevP;
    $rootScope.carousel[0].style= {left: 0}

    var curIX = Number($routeParams.currPageNum) - 1;
    var newP = getCachedData(curIX);
    $rootScope.currPageNum = curIX+1;

    if(typeof inc=='undefined'){
        getStat();
        inc = 0
    }
    $scope.changed = false;
}


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
