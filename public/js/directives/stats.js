testApp.directive('infoPanel', function($rootScope, mylocalStorage){
    return{

        templateUrl: 'details.html',

        controller: function($rootScope, $scope, $log){
            var $stats = $scope.stats || [],
                pages = $rootScope.pages;
            $scope.preview = '';
            var createStats = false;

            $scope.$on('updateStat', function(event, pageStat){
                $scope.stats = [];
                $rootScope.stats.push(pageStat);

                processUpdate(pageStat);

                $rootScope.photos = $scope.stats.length;
            });

            $scope.head = {
                "a_pageNum": "Page",
                "b_fname": "Filename",
                "c_scale": "Scale",
                "d_current": "Original Dimensions (px)",
                "e_size": "File size (KB)",
                "f_preview": "Preview"
            };
            $scope.sort = {
                column: 'a_pageNum',
                descending: false
            };

            function processUpdate(pageStat){
                if(pageStat.length==0)
                    return;

                angular.forEach($rootScope.stats, function(page, key){
                    if(key != pageStat.ix){
                        for(var i=0; i<page.length; i++){
                            $scope.stats.push( page[i] );
                        }
                    }else{
                        $rootScope.stats[key] = [];

                        angular.forEach(pageStat.stat, function(obj){
                            var scale = obj['c_scale'];
                            var ppi = obj['d_origSize'].split('x');
                            var hor = ppi[0]/scale, vert = ppi[1]/scale;
                            obj['d_current'] = obj['d_origSize'] + " ("+ parseInt(hor) +"x"+parseInt(vert)+")";

                            $scope.stats.push(obj);
                            $rootScope.stats[key].push(obj);
                        });
                        $rootScope.stats.pop();
                    }

                })
            }
            var sort = $scope.sort;
            $scope.selectedCls = function(column) {
                if(column=='f_preview') return;
                return column == sort.column && 'sort-' + sort.descending;
            };

            $scope.changeSorting = function(column/*index*/) {
                if (sort.column == column) {
                    sort.descending = !sort.descending;
                } else {
                    sort.column = column;
                    sort.descending = false;
                }
            };

            $scope.displayPreview = function(){
                var img = this.row['b_fname'];

                $scope.preview = mylocalStorage.getImg(img);
                var imgSz = this.row['d_origSize'].split('x'),
                    imgW = imgSz[0],
                    imgH = imgSz[1],
                    ratio = imgH/imgW;

                if(imgW>500) {
                    koef = imgW/400;
                    imgW /= koef;
                    imgH = imgW*ratio;
                }

                $('#preview > img').css({'width': imgW+"px", 'height': + imgH+'px',
                    left: (700-imgW)/2 + "px", position: "absolute"});
                $('#preview').css({'height': imgH+'px'})

                $scope.display = 'true';
            }
        },

        link: function (scope, el, attr, ctrl){
            $rootScope.$watch('statShow',function(newVal){
                var c = newVal=='Show' ? 'up' : 'down';
                el.attr({'class': c, id:'infoPanel'});
            });
        }
    }
})
