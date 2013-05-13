
testApp.directive('imgControls', function($document, $log){
        return {
            link: function(scope, el, attr){

            el.addClass("imgcontrols");

            var frame = scope.frame,
                ctrls = frame.imgcontrols,
                page = scope.$parent.page;

            var resize = $('.resize', el),
                move = $('.move', el);

            resize.on('mousedown', function(event){
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
                            img.height = newHeight + 'px';
                            img.width = newWidth + 'px';

                            ctrls.top = i(ctrls.top) + deltaY + 'px';
                            ctrls.left = i(ctrls.left) + deltaX + 'px';
                        }
                    })
                };
            });

            move.on('mousedown', function(event){
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

            $('.delete', el).on('mouseup', function(){
                el.parent().remove();
                scope.$destroy();
            });
            $('.download', el).on('mouseup', function(){
                $('.file', el).trigger('click');
            });
            $('.comment', el).on('mouseup', function(){
                promptDlg = prompt("Enter comments: ", "");
                scope.frame.comments = promptDlg;
            });
            $('.revert', el).on('mouseup', function(){
                var frame = scope.frame;
                var numOfPreviews = $('#picsLoadedPanel').children().length;
                $('<img style="width:100%" src="' + frame.imgdata + '" data=\''+JSON.stringify(frame.rasterData)+'\' />')
                    .on('dragstart', function(e){
                        e.originalEvent.dataTransfer.effectAllowed = "move";
                        tgt = this;
                    })
                    .appendTo($('#picsLoadedPanel'));
//                $('#picsLoadedPanel')
//                    .append('<img style="width:100%" id="i-'+numOfPreviews+'" src="'+frame.imgdata + '">')
//                    .on('dragstart', function(e){
//                        e.originalEvent.dataTransfer.effectAllowed = "move";
//                        tgt = this;
//                    })

//                var data = frame.rasterData.d_origSize.split('x');
//                panel.push(frame.rasterData)

//                tgt = {src: frame.imgdata, img: {width:data[0], height:data[1]},
//                        id:"i-"+numOfPreviews, rasterData: frame.rasterData};

                $('.img.fitted', el.parent()).remove();

                scope.$apply(function(){
                    frame.imgdata = '';
                    frame.imgstyle = {top:0, left:0};
                    frame.rasterData = '';
                })
            })
        }
    })



