
var img=new Image();
img.src='./images/pc/cage.png';

// 奖品images 集合
var array = []
var award = {}
var host = 'http://10.0.1.70:9000'
// var host = ''


// 旋转到指定角度
// startRotate(360)



/**
     * 抽奖接口
     * 访问地址：
     * ferris-wheel-lottery/lottery.html
     * 参数：
     *      无
     * 返回Map
     *  success 响应结果信息成功与否 true:成功 false:失败
     *  isLogin 是否登录 true: 已登录  false：未登录 --只是用作判断是否登录
     *  message 失败的提示信息
     *  address 收货地址
     *  count 剩余抽奖机会次数
     *  hasChance true: 剩余抽奖次数大于0或者本次抽奖抽到奖品  false:剩余抽奖次数小于等于0并且此次未抽到奖品
     *  hasGift 是否抽中奖品 true: 抽中 false: 未抽中
     *    奖品信息:
     *      giftId 奖品Id
     *      giftName 奖品名称
     *      giftLogo 奖品LOGO
     * 
     * 
     */


// 开始抽奖
$('#lottery').on('click',function(){
    var myCanvas = document.getElementById("myCanvas"); 
    if (!myCanvas.getContext) {
        layer.msg('当前浏览器版本过低，请使用其他浏览器尝试')
        return false;
    }
    
    $.ajax({
        url:host+'/ferris-wheel-lottery/lottery.html',
        // url:"../data.json",
        success:function(result){
            
            if(result.success && result.isLogin){
                var angel = 360+award[result.giftId]
                startRotate(angel,null,null,function(){

                    if(result.hasGift){
                        layer.msg('恭喜您抽中'+result.giftName,function(){
                            if(result.type && result.type == 'goods'){
                                showAddress(result.address);
                            }
                        })
                       
                    }
                })
                
            }else{
                if(!result.isLogin){
                    login()
                    return false;
                }
                if(!result.success){
                    layer.msg(result.message);
                    return false;
                }
            }

        }
    })
})

/**
 * 我的邀请记录
 * 访问地址: ferris-wheel-lottery/get-recommend.html
 * 参数
 *  无
 * @return
 * success 响应结果信息成功与否 true:成功 false:失败
 *  isLogin 是否登录 true: 已登录  false：未登录 --只是用作判断是否登录
 *  message 失败的提示信息
 *  recommends list
 *      Map
 *          username 用户名
 *          phone 手机
 *          recommendTime 推荐时间
 *          seq 序号
 *          money 投资金额
 */
$('.record').on('click',function(){
    getRecommend();
})
// 我的邀请记录
function getRecommend(){
    $.ajax({
        url:host+'/ferris-wheel-lottery/get-recommend.html',
        // url:'../data.json',
        success:function(result){
            if(result.success && result.isLogin){
                if(result.recommends){
                    var arr= result.recommends                    
                    var str = '';
                    for(var i = 0; i<arr.length;i++){
                        str += '<tr><td>'+arr[i].seq+'</td><td>'+arr[i].username+'</td><td>'+arr[i].phone+'</td><td>'+arr[i].recommendTime+'</td><td>'+arr[i].money+'</td></tr>'
                    }
                    layer.open({
                        title:'我的邀请记录',
                        type: 1,
                        skin:'getRecommend ',
                        content: '<table class=""'+
                        '<thead><tr><th width="66">序号</th><th width="183">用户名</th><th width="140">手机号码</th><th width="151">注册时间</th><th width="182">投资金额</th></tr>'+
                        '</thead>'+
                        '<tbody>'+
                             str+
                        '</tbody>'+
                    '</table>',
                        btn:['我知道了']
                      });
                }
                
            }else{
                if(!result.isLogin){
                    login()
                    return false;
                }
                if(!result.success){
                    layer.msg(result.message);
                    return false;
                }
            }
        }
    })
}


/**
 * 中奖纪录
 * 访问地址: ferris-wheel-lottery/win-gifts.html
 * success 成功与否 true: 成功 false：失败
 * message 错误提示信息
 * isLogin 是否登录
 * winGifts List<Map> 中奖纪录
 *   Map：
 *      date 中奖日期 yyyy-MM-dd
 *      dateFull 中奖日期-时间 yyyy-MM-dd HH:mm:ss
 *      giftName 奖品名称
 *      seq 序号
 */
$('.z_record span').on('click',function(){
    winGifts();
})
// 我的中奖纪录
function winGifts(){
    $.ajax({
        url:host+'/ferris-wheel-lottery/win-gifts.html',
        success:function(result){
            if(result.success && result.isLogin){
                if(result.winGifts){
                    var arr= result.winGifts                    
                    var str = '';
                    for(var i = 0; i<arr.length;i++){
                        str += '<tr><td>'+arr[i].seq+'</td><td>'+arr[i].giftName+'</td><td>'+arr[i].date+'</td></tr>'
                    }
                    layer.open({
                        title:'我的中奖纪录',
                        type: 1,
                        skin:'self',
                        content: '<table class="" >'+
                        '<thead><tr><th width="66">序号</th><th width="223">奖品</th><th width="196">中奖时间</th></tr>'+
                        '</thead>'+
                        '<tbody>'+
                              str+
                        '</tbody>'+
                    '</table>',
                        btn:['我知道了']
                      });
                }
            }else{
                if(!result.isLogin){
                    login()
                    return false;
                }
                if(!result.success){
                    layer.msg(result.message);
                    return false;
                }
            }
        }
    })
   
}
$('#useCon').on('click',function(){
    conditions();
})

var packet_use = ''
// 红包使用条件
function conditions(){
    layer.open({
        title:'红包使用条件',
        type: 1,
        skin:'self',
        content: '<ul>'+
        packet_use+
        '</ul>',
        
        btn:['我知道了']
      });
}

/**
* 邀请好友摩天轮初始化内容
* 包括：
* 【幸运数字6】红包、加息券奖品列表 【投资金额排行榜】 【投资金额排行榜】
* 访问地址: ferris-wheel-lottery/init-data.html
* 返回Map
*  success 响应结果信息成功与否 true:成功 false:失败
*  message 失败的提示信息
*  lucky map
*      envelope list 红包列表
*      increases 加息券利率
*  investPeople list
*      map
*          no 序号
*          username 用户名
*          phone 手机号
*          num 邀请人数
*  investMoney list
*      map
*          no 序号
*          username 用户名
*          phone 手机号
*          moeny 投资金额
*/

initSkyData()
function initSkyData(){
    $.ajax({
        url:host+'/ferris-wheel-lottery/init-data.html',
        // url:'../initData.json',
        success:function(result){
            console.log(result)
            if(result.giftList){
                var arr = result.giftList
                var baseAngel = 360/arr.length
                var base = 0;
                for(var i = 0 ; i < arr.length;i++){
                    var img = new Image()
                    img.src = arr[i].logo
                    img.alt = arr[i].name
                    award[arr[i].id] = 360-base
                    base +=baseAngel
                    array.push(img)
                }
                // 初始化摩天轮
               // initSky()
                initSky('myCanvas',img,array)
            }
            if(result.success){
                // 加息奖励配置
                if(result.lucky){
                    
                    packet_use += '<li>'+result.lucky.increases.amount+'%加息券：满<span>'+result.lucky.increases.useLimitMoney+'元</span>可以使用，'+result.lucky.increases.useLimitMonth+'天及以上标期可使用</li>'
                    $('.interest').html(result.lucky.increases.amount)
                    var arr = result.lucky.envelope
                    for(var i = 0 ; i < arr.length;i++){
                        $('.packet_'+i).html(result.lucky.envelope[i].amount)
                        packet_use += '<li>'+result.lucky.envelope[i].amount+'元红包：满<span>'+result.lucky.envelope[i].useLimitMoney+'元</span>可以使用，'+result.lucky.envelope[i].useLimitMonth+'天及以上标期可使用</li>'
                    }
                }
                // 投资金额
                if(result.investMoney){
                    var arr = result.investMoney
                    var str = ''
                    for(var i = 0 ; i < 10;i++){
                        if(arr[i]){
                            str += '<tr><td>'+arr[i].no+'</td><td>'+arr[i].username+'</td><td>'+arr[i].phone+'</td><td>'+arr[i].money+'</td></tr>'
                        }else{
                            str += '<tr><td></td><td></td><td></td><td></td></tr>'
                        }
                    }

                    $('#investMoney').html(str)
                }
                // 投资人数
                if(result.investPeople){
                    var arr = result.investPeople
                    var str = ''
                    for(var i = 0 ; i < 10;i++){
                        if(arr[i]){
                            str += '<tr><td>'+arr[i].no+'</td><td>'+arr[i].username+'</td><td>'+arr[i].phone+'</td><td>'+arr[i].num+'</td></tr>'
                        }else{
                            str += '<tr><td></td><td></td><td></td><td></td></tr>'
                        }
                    }

                    $('#investPeople').html(str)
                }
                investPeople
                
            }else{
                $('.noActivity').show()
                layer.msg(result.message)
            }
        }
    })
}
/**
 * 保存收货地址
 * 访问地址：
 * ferris-wheel-lottery/save-address.html
 * 参数：
 *      address 收货地址（25位字符）
 * 返回Map
 *  success true:已登录 false:未登录
 *  message 失败的提示信息
 *  type 保存地址信息是否正确 true：正确 false:异常
 */
$('#submitAddress').on('click',function(){
    $.ajax({
        url: host + '/ferris-wheel-lottery/save-address.html',
        data:{address:$('#address').val()},
        success:function(result){
            if(result.success){
                if(result.type){
                    layer.msg('保存成功')
                }else{
                    layer.msg(result.message)
                }
            }else{
                layer.msg('请先登录')
            }
        }
    })
})

function showAddress(address){
    // 获取用户名和手机信息
    $.ajax({
        url: host + '/secure/get-login-info.html',
        success:function(result){
            if(result.isLogin){
                $('#user').val(result.callName)
                $('#tel').val(result.mobile)

                layer.open({
                    title:'填写收货地址',
                    type: 1,
                    skin:'self',
                    shadeClose: true,
                    area: '840px',
                    content: $('#exchange')
                })
            }else{
                layer.msg('请先登录')
                return false;
            }
        }
    })
    // 地址信息
    if(address){
        $('#address').val(address)
    }
    
    
}

// 登录弹框
function login() {
   
    
        var loginLayer;
        loginLayer =
            layer.open({
                type: 2,
                area: ['489px', '454px'],
                shade: [0.6, '#000'],
                closeBtn: true,
                title: false, //不显示标题
                content: host + '/index/login-layer.html' //捕获的元素
            });
    
}

// 登录成功后的回调函数
function loginSuccess() {
    location.reload();
}