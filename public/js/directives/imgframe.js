testApp.directive('imgFrame', function($document, $log, mylocalStorage){
    function Controller($rootScope, $scope){
        var frame = $scope.frame;

//        function fireUpdate(data){
//            $rootScope.stat.push[$rootScope.currPageNum - 1][frame.ix] = data;
//        };
        function revert (){
            $rootScope.$broadcast('imageReverted', frame.imgdata)
        }
        function enter(){
            var img = frame.imgstyle,
                imgcontrols = frame.imgcontrols;

            function i(str){return parseInt(str)}

            if(frame.imgEditing){
                $scope.$apply(function(){
                    imgcontrols.top = i(img.height) + i(img.top) +'px';
                    imgcontrols.left = i(img.width) + i(img.left) + 'px';
                })
            }
        }
        return{
//            fireUpdate: fireUpdate,
            revert: revert,
            enter:enter
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
            tgt = $('.img.fitted', this)})

        el.bind('drop', function (event){
            event.stopPropagation();
            event.preventDefault();

            scope.$parent.page.changed = true;

            try{
                //always DOM element
                var img = tgt
//                    id = (parseInt($(img).attr('id').substr(2)) - 1) || tgt.id.substr(2) - 1;
            }catch(err){
                var img = event.target;
//                alert("Dropping image from desktop onto frame is not supported")
            }
            frame.rasterData = JSON.parse( $(img).attr('data'));

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

                    scope.$parent.page.images--;
                }
                frame.imgdata = tgt.src;

                //fit to maximize
                koef = Math.max(frame.w/img.width, frame.h/img.height)

                frame.imgstyle = {
                    width: Math.ceil(koef*img.width)+"px",
                    height: Math.ceil(koef*img.height)+"px",
                    top: 0, left: 0}
            });
//            controller.fireUpdate(frame.rasterData);

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
                controller.enter(frame);
            }
        })

    }

    return{
        controller: Controller,
        link: link
    }
});