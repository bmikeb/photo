
testApp.directive('imgControls', function($document, $log){
        return {
            link: function(scope, el, attr, ctrl){

            el.addClass("imgcontrols");

            var frame = scope.frame,
                ctrls = frame.imgcontrols,
                page = scope.$parent.$parent;

            var resize = angular.element(el.children()[0])
                move = angular.element(el.children()[1]);

            resize.bind('mousedown', function(event){
                var initX = event.pageX,
                    initY = event.pageY,
                    deltaX, deltaY,
                    koef = frame.rasterData.c_scale,
                    img = frame.imgstyle;

                page.changed = true;

                $document.bind('mousemove', mousemove);
                $document.bind('mouseup', mouseup);

                function mousemove(event){
                    var currY = event.pageY,
                        newHeight, newWidth;

                    deltaY = i(currY - initY);
                    initY = currY;

                    deltaX = i(koef*deltaY);

                    newHeight = i(img.height) + deltaY;
                    newWidth = i(img.width) + deltaX;

                    scope.safeApply(function(){
                        if( newHeight < frame.h || newWidth < frame.w)
                            return;
                        if(newWidth > 3*frame.w || newHeight > 3*frame.h){
                            return;
                        }
                        else{
                            frame.rasterData.c_scale *= img.height/newHeight;

                            img.height = newHeight + 'px';
                            img.width = newWidth + 'px';

                            ctrls.top = i(ctrls.top) + deltaY + 'px';
                            ctrls.left = i(ctrls.left) + deltaX + 'px';

                        }
                    })
                };
            });

            move.bind('mousedown', function(event){
                var initX = event.pageX,
                    initY = event.pageY;

                page.changed = true;

                $document.bind('mousemove', mousemoveMV);
                $document.bind('mouseup', mouseup);

                function mousemoveMV (event){
                    var currX = event.pageX,
                        currY = event.pageY;
                        deltaX = (currX - initX),
                        deltaY = (currY - initY),
                        img = frame.imgstyle,
                        initX = currX,
                        initY = currY;

                    scope.safeApply(function(){
                        img.top = i(img.top) + deltaY + 'px';
                        img.left = i(img.left) + deltaX + 'px';

                        ctrls.top = i(ctrls.top) + deltaY + 'px';
                        ctrls.left = i(ctrls.left) + deltaX + 'px';
                    })
                }
            });

            function mouseup(event){
                frame.imgEditing = false;

                $document.unbind('mousemove');
                $document.unbind('mouseup');
            };
            function i(str){return parseInt(str)}
        }
        }
    })

testApp.directive('frameControls', function(){
        return function(scope, el, attr){
            el.addClass('framecontrols');
            var frame = scope.frame,
                page = scope.$parent.$parent;

            $('.delete', el).on('mouseup', function(){
                el.parent().remove();
                scope.$destroy();
                page.changed = true;
            });
            $('.download', el).on('mouseup', function(){
                $('.file', el).trigger('click');
            });
            $('.file', el).on('click', function(e, data){
                var img = data;
            })
            $('.comment', el).on('mouseup', function(){
                var comnts = (frame.comments && frame.comments.length==0)
                    ? "" : frame.comments;

                promptDlg = prompt("Enter comments: ", comnts);
                frame.comments = promptDlg;
                page.changed = (comnts==promptDlg) ? false : true;
            });
            $('.revert', el).on('mouseup', function(){
                var numOfPreviews = $('#picsLoadedPanel').children().length;
                $('<img style="width:100%" src="' + frame.imgdata + '" data=\''+JSON.stringify(frame.rasterData)+'\' />')
                    .on('dragstart', function(e){
                        e.originalEvent.dataTransfer.effectAllowed = "move";
                        tgt = this;
                    })
                    .appendTo($('#picsLoadedPanel'));

                $('.img.fitted', el.parent()).remove();

                scope.$apply(function(){
                    frame.imgdata = '';
                    frame.imgstyle = {top:0, left:0};
                    frame.rasterData = '';
                })
            })
        }
    })



