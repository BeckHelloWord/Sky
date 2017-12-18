



/**
 * 
 * @param {*canvas的ID} id 
 * @param {*奖台的图片Dom} img 
 * @param {*奖品images 集合} array 
 */
function initSky(id,img,array){
    var c = document.getElementById(id);
    window.ctx = c.getContext("2d");
    window.canvasWidth = c.width
    window.canvasHeight = c.height
    // 圆心
    var x = c.width/2
    var y = c.height/2
    // 画布中心移动到canvas中心
    ctx.translate(x,y);
    
    // 初始化摩天轮
    img.onload = function(){
        
        skyWheel({
            num:7,
            width_w:25,
            radius_w:215,
            color_w:'#fc474d',
            width_l:20,
            radius_l:190,
            color_l1:'#ffd57c',
            color_l2:'#ffb933',
            lineColor:'#bc080d',
            lineLength:260,
            lineWidth:10,
            angelTo:0,
            award_length:260,
            award_width:85,
            award_height:118,
            award:array})
        
    }
}



// 摩天旋转到一定角度（快到慢）
function startRotate(angel,baseStep,baseSpeed,callback){
    // 基值（减速）
    baseStep = baseStep || 10
    // 起始滚动速度
    baseSpeed = baseSpeed || 0.3
    // 步长
    var count = 0;        
    // 间隔
    var times = 10;

    var timer = setInterval(function() {
        // 重置画布       
        // 绘制下个画面前清空画布
        ctx.clearRect(-canvasWidth,-canvasHeight,2*canvasWidth,2*canvasHeight);
        count = count+baseStep*(((angel-count)/angel)>baseSpeed?baseSpeed:((angel-count)/angel))
        skyWheel({
        num:7,
        width_w:25,
        radius_w:215,
        color_w:'#fc474d',
        width_l:20,
        radius_l:190,
        color_l1:'#ffd57c',
        color_l2:'#ffb933',
        lineColor:'#bc080d',
        lineLength:260,
        lineWidth:10,
        angelTo:count,
        award_length:260,
        award_width:85,
        award_height:118,
        award:array})

        if(count == angel){
            callback();
            clearInterval(timer)
        }
        if(angel - count<0.5){
            count = angel            
        }
    }, times);
}


/**
*   @param:圆心,x,y
*   @param:几个奖品 ,num
*   @param:外圈的宽 width_w,
*   @param:外圈的半径 ,radius_w
*   @param:外圈的颜色 color_w,
*   @param:里圈的宽 width_l
*   @param:里圈的半径 ,radius_l
*   @param:里圈的颜色 color_l1,
*   @param:里圈的颜色 color_l2,
*   @param:支架线的颜色,lineColor
*   @param:支架线的长度,lineLength
*   @param:支架线的宽度,lineWidth
*   @param:旋转角度,angelTo
*   @param:几个奖品 ,num
*   @param:奖品台 距离圆心的距离 ,award_length
*   @param:奖品台 的宽度 ,award_width
*   @param:奖品台 的高度 ,award_height
*   @param:奖品的数组 ,award ：array[img的DOM]
*   奖品的宽高和奖品台一样
*/

function skyWheel(params){
    // 默认值
    options = {
        num:7,
        width_w:25,
        radius_w:215,
        color_w:'#fc474d',
        width_l:20,
        radius_l:190,
        color_l1:'#ffd57c',
        color_l2:'#ffb933',
        lineColor:'#bc080d',
        lineLength:260,
        lineWidth:10,
        angelTo:0,
        award_length:260,
        award_width:85,
        award_height:118,
        award:[]
    }
    options = params
    // 移动画布中心点
    
    // alert(angelTo)
    var angelTo = options.angelTo || 0;
    // 平分角度
    var angel= (2*Math.PI/360)*(360/options.num);
    
    var startAngel = 2*Math.PI/360*(-90);
    var endAngel = 2*Math.PI/360*(-90)+angel

    ctx.save();
    
    // 旋转画布
    ctx.rotate(angelTo*Math.PI/180);
    // 划线 支架
    for(var i = 0 ; i<options.num;i++){
        ctx.beginPath();
        ctx.moveTo(0,0);
        var xr = options.lineLength*Math.cos(startAngel)
        var yr = options.lineLength*Math.sin(startAngel)

        ctx.lineTo(xr,yr);
        ctx.lineWidth=options.lineWidth;
        ctx.strokeStyle=options.lineColor;
        ctx.stroke();
        startAngel =endAngel
        endAngel +=angel
    }

    // 画外圆
    ctx.beginPath();
    ctx.lineWidth=options.width_w;
    ctx.strokeStyle=options.color_w;
    ctx.arc(0,0,options.radius_w,0 ,2*Math.PI)
    ctx.stroke();
    // 里圈
    
    var color = options.color_l1;
    for(var i = 0 ; i<options.num;i++){
        ctx.beginPath();
        ctx.lineWidth=options.width_l;
        ctx.strokeStyle= color 
        color = color == options.color_l2?options.color_l1:options.color_l2
        
        ctx.arc(0,0,options.radius_l,startAngel ,endAngel)
        ctx.stroke();
        
     

        startAngel =endAngel
        endAngel +=angel
    }
    // 装饰点
    for(var i = 0 ; i<options.num;i++){
        // 装饰点 圆心 坐标计算
        ctx.beginPath();
        var radius = options.radius_w - options.width_w/2;
        var xr = radius*Math.cos(startAngel)
        var yr = radius*Math.sin(startAngel)
        
        ctx.lineWidth=options.width_l;
        ctx.fillStyle= color 
        color = color == options.color_l2?options.color_l1:options.color_l2
        ctx.arc(xr,yr,10,0 ,2*Math.PI)
        ctx.fill()

        startAngel =endAngel
        endAngel +=angel
    }
    ctx.restore();
    // 奖品
    
   
    ctx.save();
    for(var i = 0 ; i < options.num;i++){
        
        ctx.beginPath();
        var radius = options.award_length;
        var xr = radius*Math.cos(startAngel+angelTo*Math.PI/180)
        var yr = radius*Math.sin(startAngel+angelTo*Math.PI/180)
                    
        ctx.drawImage(img,xr-options.award_width/2,yr,options.award_width,options.award_height);
        try {
            ctx.drawImage(options.award[i],xr-options.award_width/2,yr,options.award_width,options.award_height)
        } catch (error) {
            console.log('奖品图片加载失败')
        }

        // 添加描述的字
        ctx.fillStyle = "white";
        ctx.font="14px 微软雅黑";
        ctx.textAlign="center"; 
        ctx.fillText(options.award[i].alt,xr,yr+options.award_height+20);
        // 画框
        ctx.strokeStyle = 'white'

        // //上条线
        // ctx.moveTo(xr-options.award_width/2,yr+options.award_height+4)
        // ctx.lineTo(xr+options.award_width/2,yr+options.award_height+4)
        // // 左边圆
        // ctx.arc(xr+options.award_width/2,yr+options.award_height+15,11,-Math.PI/2,Math.PI/2);
        // // 下条线
        // ctx.moveTo(xr-options.award_width/2,yr+options.award_height+26)
        // ctx.lineTo(xr+options.award_width/2,yr+options.award_height+26)
        // // 右半圆
        // ctx.arc(xr-options.award_width/2,yr+options.award_height+15,11,Math.PI/2,-Math.PI/2);

        ctx.stroke()
        startAngel =endAngel
        endAngel +=angel
    }
    ctx.restore();
    
    
}


