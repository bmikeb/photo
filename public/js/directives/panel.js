testApp.directive('inPanel', function(mylocalStorage){

    function inController($rootScope){
        var img = $rootScope.images;

        function addImage(data){
            img[fname] = data;
        }

        return {addImage: addImage};
    };

    function link(scope, el, controller) {
        panel = scope.panel = [];

        IMG_MIN_SIZE= 200;
        that = this;

        el.bind('dragover', function(e) {
            e.stopPropagation();
            e.preventDefault();
        })
            .bind('drop', function(e) {
                e.stopPropagation();
                e.preventDefault();

                var files = e.dataTransfer.files;//e.originalEvent in case of $
                if(files.length>0){

                    for (var i = 0, file; file = files[i]; i++) {
                        if (!file.type.match(/image.*/)) {
                            continue;
                        }

                        var reader = new FileReader();

                        reader.onload = (function(aFile) {
                            return function(evt) {
                                if (evt.target.readyState == FileReader.DONE) {

                                    var img = new Image();
                                    img.onload = function(){
                                        var orig_w = this.width, orig_h= this.height,
                                            koef = Math.max(IMG_MIN_SIZE/orig_w, IMG_MIN_SIZE/orig_h),//min side size is 500 px
                                            scale = orig_w/orig_h;
                                        canvas = document.createElement("canvas");

                                        canvas.width = orig_w * koef;
                                        canvas.height = orig_h * koef;

                                        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                                        var data = canvas.toDataURL('image/jpeg', 0.8);
                                        var stats = {b_fname: aFile.name, c_scale: parseInt(scale*10)/10,
                                            d_origSize: orig_w+'x'+orig_h, e_size: parseInt(aFile.size/1000)};

//                                        panel.push(stats);
                                        mylocalStorage.saveImg(stats.b_fname, data);

                                        $('<img style="width:100%" id="i-'+panel.length+'" src="' + data + '" data=\''+JSON.stringify(stats)+'\' />')
                                            .on('dragstart', function(e){
                                                e.originalEvent.dataTransfer.effectAllowed = "move";
                                                tgt = this;
                                            })
                                            .appendTo( $(el));
                                    }
                                    img.src = evt.target.result;
                                }
                            }
                        })(file);
                        reader.readAsDataURL(file);
                    }
                }else{
                    el.append('<img style="width:100%" src="' +e.dataTransfer.getData("text/uri-list")+'">');
                    imgFrameEl.children().remove();

                    panel.push(fromObj.rasterData);

                    var fromScope = imgFrameEl.scope();
                    tgt = {src: fromScope.frame.imgdata, id:"i-"+panel.length}

                    fromScope.safeApply(function(){
                        fromScope.frame.imgdata='';
                        fromScope.frame.imgstyle="";
                    })
                    imgFrameEl.append('<img class="img fitted" picture ng-src="{{frame.imgdata}}" ng-style="frame.imgstyle">')
                }
                return false;
            });
    };
    return{
        link: link,
        controller: inController,
        scope: true
    }
})