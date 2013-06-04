angular.module('testApp.sharedServices', [])
    .factory('mylocalStorage', function($rootScope){
        return {
            get: function(pageNum){
                if(/\d+/.test(pageNum))
                    return JSON.parse(localStorage.getItem("ALBUM."+pageNum)) || [];
                else{
                    var i = 0,
                        stats = $rootScope.stats;
                    for(var key in localStorage){
                        var item = localStorage[key];
                        if(/ALBUM\./.test(key)){
                            var ix = parseInt(key.substr(6)),
                                page = JSON.parse(item);

                            stats[ix] = page.stat || [];
                            i++;
                        }
                    }
                    //if the very firt page
                    if(stats.length==0) {
                        page = {ix:0, stat:[]}
                        stats[0] = page.stat;
                    }

                    $rootScope.statsLoaded = true;
                    return i;
                }
            },

            saveImgNum: function(){
                var currNum = parseInt(localStorage.getItem('ALBUM')) || 0;
                localStorage.setItem('ALBUM', String(currNum + 1))
            },
            getImgNum: function(){
                return parseInt(localStorage.getItem('ALBUM'));
            },
            saveImg: function(ix, data){
                localStorage.setItem(ix, data);
            },
            getImg: function(ix){
                return localStorage.getItem(ix);
            },
            save: function(page){
                localStorage.setItem("ALBUM."+page.ix, JSON.stringify(page));
            },
            getAllInfo: function(){
                var pagesInfo = [];
                try{
                    for(var i=0; i<100; i++){
                        pagesInfo.push( JSON.parse(localStorage.getItem("ALBUM."+i)) )
                    }
                    return pagesInfo
                }catch(e){ return pagesInfo }
            }
        }
    })
    .factory('handleDrop', function($rootScope){
        return{
            bindDrop: function(){
                alert('!')
            }
        }
    })