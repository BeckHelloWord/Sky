var carnival = {
    // host: 'http://10.0.20.101',       //本地
    host: '',
    flg: true,
    award: {},
    array: [],
    img: new Image(),
    ajaxConfig: {
        "J-redPackage": {
            "url": "",
            "title": "红包使用条件",
            "dom": ".J-redPackage-bomb",
            "artDom": "redPackage-artDom"
        },
        "J-winning": {
            "url": "/ferris-wheel-lottery/win-gifts.html",
            "title": "我的中奖记录",
            "dom": ".J-winning-bomb",
            "artDom": "winning-artDom"
        },
        "J-invite": {
            "url": "/ferris-wheel-lottery/get-recommend.html",
            "title": "我的邀请记录",
            "dom": ".J-invite-bomb",
            "artDom": "invite-artDom"
        }
    },
    isApp: /baoxiang/.test(navigator.userAgent),
    goLogin: function () {
        var _this = this;
        layer.open({
            content: '您还没有登录，马上去登录？',
            btn: ['确定', '取消'],
            yes: function (index) {
                if (_this.isApp) {
                    location.href = "baoxiang://APPLogin";
                } else {
                    location.href = _this.host + "/login/index.html?redirect=" + location.href;
                }
                layer.close(index);
            }
        });
    },
    loginFun: function (callback) {
        var _this = this;
        $.ajax({
            url: _this.host + '/secure/get-login-info.html?t=' + new Date().getTime(),
            // url: '../login.json',
            success: function (json) {
                //未登陆
                if (!json.isLogin) {
                    _this.goLogin();
                    return;
                }

                //已登陆
                $('.J-userName').html(json.username); //收货人
                $('.J-phone').html(json.mobile); //收货电话
                if (typeof callback == "function") {
                    callback();
                }

            }
        });
    },
    commLayer: function (options) {
        //公共弹出框
        layer.open({
            title: [options.title, 'font-size:14px;background-color:#f5f5ff;'],
            shadeClose: true,
            type: 1,
            area: ['90%', '56%'], //宽高
            content: options.dom,
            success: function (layero, index) {
                //知道了按钮关闭事件
                $(layero).find('.btn-closed').on('click', function () {
                    layer.close(index);
                })
            },
            end: function () {
                //销毁后，删除自身
                if (options.isEnd) {
                    $(options.dom).remove();
                }

            }
        });
    },
    getData: function (options) {
        //请求数据
        var _this = this;
        if (!options.url) {
            //红包弹框
            _this.commLayer({
                title: options.title,
                dom: $(options.dom)
            });
            return false;
        }

        //需要请求数据的弹框
        $.get(_this.host + options.url, function (result) {
            if (result.success) {
                if (result.isLogin) {
                    //登录
                    var html = template(options.artDom, result);
                    $('body').append(html);
                    _this.commLayer({
                        title: options.title,
                        dom: $(options.dom),
                        isEnd: true
                    })
                } else {
                    //未登录
                    _this.goLogin();
                }
            } else {
                //错误信息
                layer.msg(result.message);
            }
        })
    },
    lottery: function () {
        //抽奖  /ferris-wheel-lottery/lottery.html

        var _this = this;
        _this.flg = false;
        $.get(_this.host + '/ferris-wheel-lottery/lottery.html', function (result) {
            if(result.success && result.isLogin){
                
                _this.loginFun(); //获取用户信息
                var angel = _this.award[result.giftId] + 360;
                //转盘滚动
                
                startRotate(angel, null, null, _this.array, _this.img, function () {

                    layer.msg('恭喜您抽中' + result.giftName,function(){
                        
                        if(result.type && result.type == 'goods'){
                            $('.J-address').val(result.address)    
                            //收货地址
                            
                                layer.open({
                                    title: ['收货地址', 'font-size:14px;background-color:#f5f5ff;'],
                                    shadeClose: true,
                                    type: 1,
                                    area: ['90%', 'auto'], //宽高
                                    content: $('.J-address-bomb'),
                                    success: function (layero, index) {
                                        //知道了按钮关闭事件
                                        $(layero).find('.J-submit').on('click', function () {
                                            //提交收货地址 /ferris-wheel-lottery/save-address.html
                                            $.get(_this.host+'/ferris-wheel-lottery/save-address.html',{"address":$('.J-address').val()},function (result) {
                                                //提交成功
                                                if(result.success&&result.type){
                                                    layer.msg('保存成功');
                                                }else{
                                                    layer.msg(result.message);
                                                }
                                            })
                                        })
                                    }
                                });
                            
                        }
                    });

                })
               
                
            }else{
                
                if(!result.isLogin){
                    _this.goLogin();
                    return false;
                }
                //提示
                layer.open({
                    content: result.message
                    ,skin: 'msg'
                    ,time: 2000 //2秒后自动关闭                    
                });
                
            }
            // if (result.isLogin) {
            //     //没有邀请好友机会
            //     if (!result.hasChance) {
                    
            //         layer.msg(result.message);
            //         _this.flg = true;
            //         return false;
            //     }

            //     var angel = _this.award[result.giftId];

            //     if (result.hasGift) {
            //         _this.loginFun(); //获取用户信息
            //         //转盘滚动
            //         startRotate(angel, null, null, _this.array, _this.img, function () {

            //             layer.msg('恭喜您抽中' + result.giftName);

            //             //收货地址
            //             setTimeout(function () {
            //                 layer.open({
            //                     title: ['收货地址', 'font-size:14px;background-color:#f5f5ff;'],
            //                     shadeClose: true,
            //                     type: 1,
            //                     area: ['90%', 'auto'], //宽高
            //                     content: $('.J-address-bomb'),
            //                     success: function (layero, index) {
            //                         //知道了按钮关闭事件
            //                         $(layero).find('.J-submit').on('click', function () {
            //                             //提交收货地址
            //                             $.post(_this.host+'/ferris-wheel-lottery/save-address.html',{"address":$('.J-address')},function (result) {
            //                                 //提交成功
            //                                 if(result.success&&result.type){
            //                                     layer.msg('保存成功');
            //                                 }else{
            //                                     layer.msg(result.message);
            //                                 }
            //                             })
            //                         })
            //                     }
            //                 });
            //             }, 4000);

            //         })
            //     }

            // } else {
            //     //未登陆，去登录
            //     _this.goLogin();

            // }
            _this.flg = true;
        })
    },
    init: function () {
       
        var _this = this;
        // alert(_this.host)
        //初始化页面  /ferris-wheel-lottery/init-data.html
        $.get(_this.host + '/ferris-wheel-lottery/init-data.html', function (result) {
            if(result.success){
                var html = template('artDom', result);
                document.getElementById('template').innerHTML = html;
    
                var baseAngel = 360 / result.giftList.length,
                    base = 0;
                //循环添加图片
                var dtd = $.Deferred(); // 新建一个Deferred对象
                var i = 0;
                var addImg = function(){

                    result.giftList.forEach(function (element) {
                        var img = new Image();
                        img.src = element.logo;
                        img.alt = element.name;
                        _this.award[element.id] = 360 - base;
                        base += baseAngel;
                        img.onload = function(){
                            i++
                            if(i==result.giftList.length){
                                dtd.resolve()
                            }
                        }        
                        _this.array.push(img);
                        
                    });
                    return dtd.promise();
                }
                
                _this.img.src = './images/mobile/cage.png';
                $.when(addImg()).done(function(){                    
                    initSky("sky", _this.img, _this.array)
                })
                
            }else{
                
                $('.noActivity').show();
                $('.J-btn-Start').hide();
                layer.alert(result.message);
            }
        })


        //弹框添加事件
        $('body').on('click', '.J-redPackage,.J-invite,.J-winning', function () {
            var configStr = _this.ajaxConfig[$(this).data('key')];
            _this.getData(configStr);
        })

        //开始抽奖
        $('.J-btn-Start').on('click', function () {
            if (_this.flg) {
                _this.lottery();
            }

        })
    }
}