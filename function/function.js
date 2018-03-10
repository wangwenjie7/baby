//3.通用函数.获得选择器
function g(selector){
  var method = selector.substr(0,1) == '.' ? 'getElementsByClassName' : 'getElementById';//class和id区别
  return document[method](selector.substr(1));
}

//随机生成一个值(0~20)，来选中一张图片
function random( range ){
  //分一下大小
  var max = Math.max( range[0],range[1] );
  var min = Math.min( range[0],range[1] );
  var diff = max-min;

  var number = Math.ceil((Math.random()*diff + min));  //ceil取整
  return number;
}

//4.输出所有的图片
var data = data;
function addPhotos(){
  var template = g('#wrap').innerHTML;//获得一个模板字符串，把 wrap里的字符串取出
  var html =[];
  var nav=[];
  //遍历data数组
  for (var s = 0; s < data.length; s++) {                     //可简写为 for(s in data)
    var _html = template.replace('{{index}}',s)               //用模板字符串来替换，替换以下四个关键字
                        .replace('{{img}}',data[s].img)
                        .replace('{{caption}}',data[s].caption)
                        .replace('{{description}}',data[s].description);
    html.push( _html );//html数组获取替换完的信息

    nav.push('<span id="nav_'+s+'" onclick="turn( g(\'#photo_'+s+'\'))" class="i">&nbsp;</span>');//控制按钮
  }

  html.push('<div class="nav">'+nav.join('')+'</div>');

  g('#wrap').innerHTML = html.join('');//把html数组获取替换完的信息，再写入wrap里
  rsort( random([0,data.length]) );//随机输出海报，立即执行一次排序
}
addPhotos();



//6.计算左右分区的范围
function range(){
  var range = { left:{ x:[], y:[] },  right:{ x:[], y:[] }};
  //整个视图
  var wrap ={
    w:g('#wrap').clientWidth,
    h:g('#wrap').clientHeight
  }
  //某个图片
  var photo ={
    w:g('.photo')[0].clientWidth,
    h:g('.photo')[0].clientHeight
  }
  range.wrap = wrap;
  range.photo = photo;

  range.left.x = [ 0-photo.w, wrap.w/2-photo.w/2 ];//[最小值，最大值]
  range.left.y = [ 0-photo.h, wrap.h ];

  range.right.x = [ wrap.w/2 + photo.w/2,wrap.w + photo.w ];
  range.right.y = range.left.y;

  return range;//返回对象
}

//5.排序图片
function rsort(n){//当前海报n

  var _photo = g('.photo');//JS约定，如果一个变量不常用，会以_开头，表示临时变量
  var photos = [];

  for(s=0;s<_photo.length;s++){//遍历图片数组，去掉 photo_center
    _photo[s].className = _photo[s].className.replace(/\s*photo_center\s*/,' ');
    _photo[s].className = _photo[s].className.replace(/\s*photo_front\s*/,' ');
    _photo[s].className = _photo[s].className.replace(/\s*photo_reverse\s*/,' ');


    _photo[s].className += ' photo_front';

    _photo[s].style.left='';
    _photo[s].style.top='';
    _photo[s].style['-webkit-transform']='rotate(360deg) scale(1.4)';


     photos.push( _photo[s] );
  }

  var photo_center = g('#photo_'+n);
  photo_center.className += ' photo_center';
  photo_center = photos.splice(n,1)[0];

  //把剩下的海报分为左右两个部分
  var photos_left = photos.splice(0,Math.ceil(photos.length/2))  //左面的一半
  var photos_right = photos;  //剩下的一半给右面

  var ranges = range();
  //左分区
  for (s in photos_left) {//for 循环数组的简写
    var photo = photos_left[s];//当前的图片
    //图片随机摆放
    photo.style.left = random(ranges.left.x)+'px';
    photo.style.top = random(ranges.left.y)+'px';

    photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg) scale(1)';


  }
  //右分区
  for (s in photos_right) {//for 循环数组的简写
    var photo = photos_right[s];//当前的图片
    //图片随机摆放
    photo.style.left = random(ranges.right.x)+'px';
    photo.style.top = random(ranges.left.y)+'px';

    photo.style['-webkit-transform'] = 'rotate('+random([-150,150])+'deg) scale(1)';


  }

  //控制按钮处理
  var navs = g('.i');//获取控制按钮元素
  for (var s = 0; s < navs.length; s++) {
    navs[s].className = navs[s].className.replace(/i_current\s*/,' ');
    navs[s].className = navs[s].className.replace(/i_back\s*/,' ');
  }
  g('#nav_'+n).className += ' i_current ';//当前选中的图片与按钮关联



  console.log(photos_left.length,photos_right.length)
}

  //1.控制翻转的函数。如果是正面，点击翻转为反面，反面点击翻转为正面。
  function turn(elem){
    var cls = elem.className;
    var n = elem.id.split('_')[1];//图片的索引编号

    if( !/photo_center/.test(cls) ){
      return rsort(n);
    }

    if (/photo_front/.test(cls)) {//正则表达式
      cls = cls.replace(/photo_front/,'photo_reverse');
      g('#nav_'+n).className += ' i_back ';
    }
    else{
      cls = cls.replace(/photo_reverse/,'photo_front');
      g('#nav_'+n).className = g('#nav_'+n).className.replace(/\s*i_back\s*/,' ');

    }
    return elem.className = cls;
  }
