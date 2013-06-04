testApp.directive('imgFrame', function($document, $log, mylocalStorage){
    function Controller($rootScope, $scope){
        var frame = $scope.frame;

        function revert (){
            $rootScope.$broadcast('imageReverted', frame.imgdata);
            $rootScope.$broadcast('pageChanged');
        }
        function changed(){
            var img = frame.imgstyle,
                imgcontrols = frame.imgcontrols;

            function i(str){return parseInt(str)}

            if(frame.imgEditing){
                $scope.$apply(function(){
                    imgcontrols.top = i(img.height) + i(img.top) +'px';
                    imgcontrols.left = i(img.width) + i(img.left) + 'px';
                })
            }
            $rootScope.$broadcast('pageChanged')
        }
        return{
            revert: revert,
            changed:changed
        }
    };

    function link (scope, el, attr, controller){
        el.addClass('imgframe');

        function i(str){return parseInt(str)}

        var frame = scope.frame;

        $document.bind('click', function(){
            scope.$apply(function(){
                frame.imgEditing = false;
                frame.editing = false;
            })
        });

        el.bind('dragstart', function(event){
            event.dataTransfer.effectAllowed = "move";
            tgt = $('.img.fitted', this);
            scope.$apply(function(){
                controller.changed(frame);
            });
        })

        el.bind('drop', function (event){
            event.stopPropagation();
            event.preventDefault();

            var img = tgt;
            var dta = $(img).attr('data');
            frame.rasterData = (angular.isString(dta))? JSON.parse(dta) : dta

            scope.$apply(function(){
                if(frame.imgdata && frame.imgdata!=''){
                    var panelEl = $('#picsLoadedPanel'),
                        rasterData = JSON.stringify(frame.rasterData);

                    $('<img style="width:100%" id="i-'+panelEl.children().length+'" src="' + frame.imgdata + '" data=\''+JSON.stringify(frame.rasterData)+'\' />')
                        .on('dragstart', function(e){
                            e.originalEvent.dataTransfer.effectAllowed = "move";
                            tgt = this;
                        })
                        .appendTo( panelEl);

                    scope.$parent.$parent.page.images--;
                }
                frame.imgdata = tgt.src;

                //fit to maximize
                var koef, w, h;
                if(!img.width){
                    koef = img.data.c_scale;
                    w = 125, h= w/koef;
                }else{
                    koef = Math.max(frame.w/img.width, frame.h/img.height);
                    w= img.width, h = img.height;
                }

                frame.imgstyle = {
                    width: Math.ceil(koef*w)+"px",
                    height: Math.ceil(koef*h)+"px",
                    top: 0, left: 0
                };

                controller.changed(frame);

            });

            if( !event.shiftKey )
                $(img).remove();
        })

        .bind('dragover', function(e) {
            e.stopPropagation();
            e.preventDefault();
        })

        .bind('drag', function(){
            imgFrameEl = el;
            fromObj = frame;
        })

        .bind('click dblclick', function(event){
            event.stopPropagation();
            event.preventDefault();

            if(frame.imgdata!=""){
                scope.$apply(function(){
                    if(event.type=='click'){
                        if(!frame.imgEditing){
                            frame.imgEditing = true;
                            frame.editing = false;
                        }
                    }else{
                        if(!frame.editing){
                            frame.imgEditing = false;  frame.editing = true;
                        }
                    }
                })
                controller.changed(frame);
            }
        })
    }

    return{
        controller: Controller,
        link: link
    }
});