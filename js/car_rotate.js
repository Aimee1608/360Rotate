/**
 * Created by jiangqian on 2017/11/13.
 */
var c2dRotate = function (dom, obj) {
    var self = this;
    self.dom = $(dom);
    self.tWidth = typeof(obj.width) == "undefined" ? self.dom.width() : obj.width;//项目宽
    self.tHeight = typeof(obj.height) == "undefined" ? self.dom.height() : obj.height;//项目高
    self.imgLength = typeof(obj.imgLength) == "undefined" ? 0 : obj.imgLength;//图片的长度
    self.imgPath = typeof(obj.imgPath) == "undefined" ? "img/" : obj.imgPath;//图片路径
    self.imgType = typeof(obj.imgType) == "undefined" ? ".png" : obj.imgType;//图片的格式
    self.isAuto = typeof(obj.isAuto) == "undefined" ? false : obj.isAuto;//是否在自动播放中
    self.idName = typeof(obj.idName) == "undefined" ? dom.selector.split('#')[1] : obj.idName;//id名称
    self.tSpeed = typeof(obj.tSpeed) == "undefined" ? 80 : obj.tSpeed;//间隔时间
    self.tImgObj = [];//生成的图片对象
    self.tIndex = 0;//当前转到的第几张
    self.imgWidth=0;
    self.imgHeight = 0;//图片的宽高
    self.autoTimer = null;
    self.paused = true;//判断当前是否暂停状态
    self.initData();

};
c2dRotate.prototype =  {
    constructor:c2dRotate,
    initData:function() {
        var self = this;

        self.dom.append("<img id='"+self.idName+"imgStart' src='" + self.imgPath + '00' + self.imgType + "' style='display: none;'/>");
        $("#"+self.idName+"imgStart").load(function () {

            self.imgWidth = $("#"+self.idName+"imgStart").width();
            self.imgHeight = $("#"+self.idName+"imgStart").height();
            self.dom.append("<canvas id='" + self.idName + "canvas' width='" + self.tWidth + "' height='" + self.tHeight + "' ></canvas>");
            self.canvas = document.getElementById(self.idName+"canvas");
            self.content = self.canvas.getContext("2d");
            for (var i = 0; i < self.imgLength; i++) {
                var img2 = new Image();
                //注意注意3的倍数
                //if(i%3==0){
                if(i<10){
                    img2.src = self.imgPath + '0' + i + self.imgType;
                }else{
                    img2.src = self.imgPath + i + self.imgType;
                }
                self.tImgObj.push(img2);
                //}

            }

        });
        var timer = setTimeout(function () {
            self.move();
            self.autoPlay();
            self.initHScroll();
        }, 300);
    },
    autoPlay :function () {
        var self = this;
        if (self.isAuto) {
            self.paused = false;
            var timer = setTimeout(function () {
                self.autoTimer = setInterval(function () {
                    self.jian()
                }, self.tSpeed);
                clearTimeout(timer);
            }, 100)
        }
    },

    //向右转
    add :function() {
        var self = this;
        self.tIndex++;
        if (self.tIndex > self.tImgObj.length - 1) {
            self.tIndex = 0
        }
        self.move()
    },
    //向左转
    jian: function() {
        var self = this;
        self.tIndex--;
        if (self.tIndex < 0) {
            self.tIndex = self.tImgObj.length - 1
        }
        self.move()
    },
    //移动
    move:function() {
        var self = this;
        self.content.clearRect(0, 0, self.tWidth, self.tHeight);
        self.content.drawImage(self.tImgObj[self.tIndex], 0, (self.tHeight - self.tWidth / self.imgWidth * self.imgHeight) / 2, self.tWidth, self.tWidth / self.imgWidth * self.imgHeight)

    },
    pause:function(){
        var self = this;
        self.paused = true;
        clearInterval(self.autoTimer);
    },
    //手动切换方法
    initHScroll:function () {
        var self = this;
        var nHStartX;
        var isHMove = false;//是否正在移动中
        var hasMove = false;//是否触发了touchmove 事件
        function initHMoveStart(e) {
            e.preventDefault();
            hasMove = false;
            if (e.type == "touchstart") {
                nHStartX =event.touches[0].pageX
            } else {
                nHStartX = e.x || e.pageX
            }
            isHMove = true;
        }

        function initHMoveMove(e) {
            e.preventDefault();
            //console.log(999);
            hasMove = true;
            if (isHMove) {
                var moveP;
                if (e.type == "touchmove") {
                    moveP = event.touches[0].pageX;

                } else {
                    moveP = e.x || e.pageX
                }
                var hm = nHStartX - moveP;
                if (hm < 0 ) {

                    if (self.isAuto) {
                        clearInterval(self.autoTimer)
                    }
                    self.add()
                }else if(hm > 0 ){

                    if (self.isAuto) {
                        clearInterval(self.autoTimer)
                    }
                    self.jian()
                }
                nHStartX = moveP
            }
        }

        function initHMoveEnd(e) {
            e.preventDefault();
            console.log(isHMove,hasMove);
            if(isHMove&&hasMove) {
                if (self.isAuto) {
                    clearInterval(self.autoTimer);
                    self.autoPlay();
                    isHMove = false;
                }
            }
        }
        function init() {
            self.dom.on("mousedown touchstart", initHMoveStart);
            self.dom.on("mousemove touchmove", initHMoveMove);
            self.dom.on("mouseup touchend", initHMoveEnd)
        }
        init()
    }
};


