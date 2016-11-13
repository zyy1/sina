/**
 * Created by lenovo on 2016/9/7.
 */
function getByClass(obj,sClass){
    if(obj.getElementsByClassName){
        return obj.getElementsByClassName(sClass);
    }
    var arr=[];
    var aEle=obj.getElementsByTagName('*');
    var re=new RegExp('\\b'+sClass+'\\b');
    for(var i=0;i<aEle.length;i++){
        if(aEle[i].className.search(re)!=-1){
            arr.push(aEle[i]);
        }
    }
    return arr;
}
function getId(id){
    return document.getElementById(id);
}

function getPos(obj){
    var l=0;
    var t=0;
    while (obj){
        l+=obj.offsetLeft;
        t+=obj.offsetTop;
        obj=obj.offsetParent;
    }
    return {left: l, top: t};
}

function json2url(json){
    json.t=Math.random();
    var arr=[];
    for(var name in json){
        arr.push(name+'='+encodeURIComponent(json[name]));
    }
    return arr.join('&');
}
//url,data,type,success,error
function ajax(json){
    json=json||{};
    if(!json.url)return;
    json.data=json.data||{};
    json.type=json.type||'get';
    json.timeout=json.timeout||10000;
    if(window.XMLHttpRequest){
        var oAjax=new XMLHttpRequest();
    }else{
        var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
    }
    switch(json.type.toLowerCase()){
        case 'get':
            oAjax.open('GET',json.url+'?'+json2url(json.data),true);
            oAjax.send();
            break;
        case 'post':
            oAjax.open('POST',json.url,true);
            oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            oAjax.send(json2url(json.data));
            break;
    }
    //加载的时候
    json.loading&&json.loading();
    //完成
    var timer=setTimeout(function (){
        json.complete&&json.complete();
        oAjax.onreadystatechange=null;
        json.error&&json.error('亲网络不给力');
    },json.timeout);

    oAjax.onreadystatechange=function (){
        if(oAjax.readyState==4){
            if(oAjax.status==200){
                json.complete&&json.complete();
                clearTimeout(timer);
                json.success&&json.success(oAjax.responseText);
            }else{
                json.error&&json.error(oAjax.status);
            }
        }
    };
}



window.onload=function(){
    //懒加载
    window.onresize = window.onscroll=function(){
        var scrollTop=document.documentElement.scrollTop||document.body.scrollTop;
        var clientH=document.documentElement.clientHeight;
        var aImg=document.getElementsByTagName('img');
        for(var i=0;i<aImg.length;i++){
            var imgT=getPos(aImg[i]).top;
            if(scrollTop + clientH >= imgT){
                aImg[i].src = aImg[i].getAttribute('_src');
            }
        }
    };

//选项卡
    function tab(sEv,id,title,box){
         var aBtn=getByClass(getId(id),title)[0].getElementsByTagName('li');
         var aBox=getByClass(getId(id),box)[0].children;
         for(var i=0;i<aBtn.length;i++){
            (function(index){
                aBtn[i][sEv]=function(){
                    for(var i=0;i<aBtn.length;i++){
                        aBtn[i].className='';
                        aBox[i].style.display='none';
                    }
                    this.className='on';
                    aBox[index].style.display='block';

                };
            })(i);
         }
    }
    tab('onmouseover','m-tab','title','box');
    for(var i=1;i<17;i++){
        tab('onmouseover','m-tab'+(i+1),'title','box');
    }
    tab('onmouseover','m-tab19','mt2-ul','mt2-box');
    tab('onmouseover','m-tab20','mt2-ul','mt2-box');
    tab('onmouseover','tab01','t1-ul','t1-box');
    tab('onmouseover','timeTab','t2-ul','t2-box');
    tab('onmouseover','timeTab3','t3-ul','t3-box');
    tab('onmouseover','live','clearfix','lvbox');

//导航
    (function(){
        var aSpan=getByClass(getId('top-nav'),'tn-arrow');
        for(var i=0;i<aSpan.length;i++){
            aSpan[i].parentNode.parentNode.onmouseover=function(){
                this.children[1].style.display='block';
            };
            aSpan[i].parentNode.parentNode.onmouseout=function(){
                this.children[1].style.display='none';
            };
        }


        var oBar=getByClass(getId('sbar'),'s-slt')[0];
        oBar.onmouseover=function(){
            oBar.children[1].style.display='block';
        };
        oBar.onmouseout=function(){
            oBar.children[1].style.display='none';
        };

    })();


//我爱看图(焦点图)

     function focus(){
         var aDiv=getByClass(getId('timeTab2'),'p4-box')[0].children;
         var aLi=getByClass(getId('timeTab2'),'p4-ul')[0].children;
         var oLeft=getByClass(getId('timeTab2'),'btn-l')[0];
         var oRight=getByClass(getId('timeTab2'),'btn-r')[0];
         var iNow=0;
         oLeft.onclick=function(){
             iNow--;
             if(iNow==-1){
                 iNow=aLi.length-1;
             }
             tab2();
         };
         oRight.onclick=function(){
             iNow++;
             if(iNow==aLi.length){
                 iNow=0;
             }
             tab2();
         };

         for(var i=0;i<aLi.length;i++){
             (function(index){
                 aLi[i].onclick=function(){
                     tab2();
                     iNow=index;
                 };
             })(i);
         }
         function tab2(){
             for(var i=0;i<aLi.length;i++){
                 aLi[i].className='';
                 aDiv[i].style.display='none';
             }
             aLi[iNow].className='on';
             aDiv[iNow].style.display='block';
         }

     }
     focus();

//视频and综艺   ***假数据
    var oUl=getByClass(getId('m-tab'),'box')[0].children[0].children[0];
    var oUl1=getByClass(getId('m-tab'),'box')[0].children[1].children[0];
    function video(url,obj){
        ajax({
            url:url,
            success:function(str){
                var arr=eval('('+str+')');
                for(var i=0;i<arr.length;i++){
                    var oLi=document.createElement('li');
                    if(i<2){
                        oLi.innerHTML='<a href="'+arr[i].href+'" class="pic"><img _src="'+arr[i].src+'" width="125" height="120"><i></i><span>'+arr[i].src_content+'</span></a><p><a class="b-box-list" href="'+arr[i].content[0].href+'">'+arr[i].content[0].title+'</a>|<a target="_blank" href="'+arr[i].content[1].href+'">'+arr[i].content[1].title+'</a></p><p><a class="b-box-list" href="'+arr[i].content[2].href+'">'+arr[i].content[2].title+'</a></p><p><a class="b-box-list" href="'+arr[i].content[3].href+'">'+arr[i].content[3].title+'</a></p><p><a class="b-box-list" href="'+arr[i].content[4].href+'">'+arr[i].content[4].title+'</a></p><p><a class="b-box-list" href="'+arr[i].content[5].href+'">'+arr[i].content[5].title+'</a></p>';
                    } else if(i==7){
                        oLi.innerHTML='<p><a class="b-box-list" href="'+arr[i].con1[0].href+'">'+arr[i].con1[0].title+'</a> <a href="'+arr[i].con1[1].href+'" class="linkRed">'+arr[i].con1[1].title+'</a> | <a href="'+arr[i].con1[2].href+'">'+arr[i].con1[2].title+'</a></p>';
                    } else if(i==2||i==5){
                        oLi.innerHTML='<p><a class="b-box-list" href="'+arr[i].con1[0].href+'">'+arr[i].con1[0].title+'</a> | <a href="'+arr[i].con1[1].href+'">'+arr[i].con1[1].title+'</a></p>';
                    } else{
                        oLi.innerHTML='<p><a class="b-box-list" href="'+arr[i].href+'">'+arr[i].title+'</a></p>';
                    }
                    obj.appendChild(oLi);
                }
                obj.children[0].className='padding1';
            },
            error:function(err){
                alert(err);
            }

        });
    }
    video('false/video.txt',oUl);

    function variety(url,obj){
        ajax({
            url:url,
            success:function(str){
                var arr=eval('('+str+')');
                for(var i=0;i<arr.length;i++){
                    var oLi=document.createElement('li');
                    if(i<2){
                        oLi.innerHTML='<a href="'+arr[i].href+'" class="pic"><img _src="'+arr[i].src+'" width="125" height="120"><i></i><span>'+arr[i].src_content+'</span></a><p><a class="b-box-list" href="'+arr[i].content[0].href+'">'+arr[i].content[0].title+'</a></p><p><a class="b-box-list" href="'+arr[i].content[1].href+'">'+arr[i].content[1].title+'</a></p><p><a class="b-box-list" href="'+arr[i].content[2].href+'">'+arr[i].content[2].title+'</a></p><p><a class="b-box-list" href="'+arr[i].content[3].href+'">'+arr[i].content[3].title+'</a></p> <p><a class="b-box-list" href="'+arr[i].content[4].href+'">'+arr[i].content[4].title+'</a></p>';
                    } else if(i==6){
                        oLi.innerHTML='<p><a class="b-box-list" href="'+arr[i].con1[0].href+'">'+arr[i].con1[0].title+'</a> | <a href="'+arr[i].con1[1].href+'">'+arr[i].con1[1].title+'</a> <a href="'+arr[i].con1[2].href+'">'+arr[i].con1[2].title+'</a> | <a href="'+arr[i].con1[3].href+'" class="linkRed">'+arr[i].con1[3].title+'</a></p>';
                    } else if(i==7){
                       oLi.innerHTML='<p><a class="b-box-list" href="'+arr[i].con1[0].href+'">'+arr[i].con1[0].title+'</a> | <a href="'+arr[i].con1[1].href+'">'+arr[i].con1[1].title+'</a></p>';
                    } else{
                        oLi.innerHTML='<p><a class="b-box-list" href="'+arr[i].href+'">'+arr[i].title+'</a></p>';
                    }
                    obj.appendChild(oLi);
                }
                obj.children[0].className='padding1';
            },
            error:function(err){
                alert(err);
            }
        });
    }
    variety('false/variety.txt',oUl1);

//news   ***假数据
    var aUl=getByClass(getId('main'),'r')[0].children[0].children[1].getElementsByTagName('ul');
    function news(url){
       ajax({
           url:url,
           success:function(str){
               var arr=eval('('+str+')');
                for(var i=0;i<5;i++){
                    var oLi=document.createElement('li');
                    oLi.innerHTML='<p><a href="'+arr[0].ul1[i].href+'">'+arr[0].ul1[i].title+'</a></p>';
                    aUl[0].appendChild(oLi);
                }
                for(var i=0;i<12;i++){
                    var oLi=document.createElement('li');
                    if(i==0||i==11){
                       oLi.innerHTML='<p><a href="'+arr[1].ul2[i].con[0].href+'" class="linkRed">'+arr[1].ul2[i].con[0].title+'</a> | <a href="'+arr[1].ul2[i].con[1].href+'">'+arr[1].ul2[i].con[1].title+'</a></p>';
                    } else{
                        oLi.innerHTML='<p><a href="'+arr[1].ul2[i].href+'">'+arr[1].ul2[i].title+'</a></p>';
                    }
                    aUl[1].appendChild(oLi);
                }
               for(var i=0;i<11;i++){
                   var oLi=document.createElement('li');
                   if(i==0||i==5||i==8||i==9||i==10){
                       oLi.innerHTML='<p><a href="'+arr[2].ul3[i].con[0].href+'" class="linkRed">'+arr[2].ul3[i].con[0].title+'</a> | <a href="'+arr[2].ul3[i].con[1].href+'">'+arr[2].ul3[i].con[1].title+'</a></p>';
                   } else{
                       oLi.innerHTML='<p><a href="'+arr[2].ul3[i].href+'">'+arr[2].ul3[i].title+'</a></p>';
                   }
                   aUl[2].appendChild(oLi);
               }


           },
           error:function(err){
               alert(err);
           }
       });
    }
     news('false/news.txt');

//PE  ***假数据

    var aPe=getByClass(getId('m-tab2'),'box')[0].getElementsByTagName('ul');
    var aMuse=getByClass(getId('m-tab4'),'box')[0].getElementsByTagName('ul');
    var aMoney=getByClass(getId('m-tab5'),'box')[0].getElementsByTagName('ul');
    var aDu=getByClass(getId('m-tab6'),'box')[0].getElementsByTagName('ul');


    function pe(url,obj){
      ajax({
          url:url,
          success:function(str){
             var arr=eval('('+str+')');
              for(var i=0;i<arr.length;i++){
                  var oLi=document.createElement('li');
                  if(i==0){
                      oLi.innerHTML='<a href="'+arr[i].href+'" class="pic pic2"><img _src="'+arr[i].src+'" width="105" height="90"><span>'+arr[i].src_content+'</span> </a><p><a href="'+arr[i].content[0].href+'">'+arr[i].content[0].title+'</a></p><p><a href="'+arr[i].content[1].href+'">'+arr[i].content[1].title+'</a></p><p><a href="'+arr[i].content[2].href+'" class="linkRed">'+arr[i].content[2].title+'</a></p><p><a href="'+arr[i].content[3].href+'">'+arr[i].content[3].title+'</a></p>';
                  } else{
                     oLi.innerHTML='<p><a href="'+arr[i].href+'">'+arr[i].title+'</a></p>';
                  }
                  obj.appendChild(oLi);

              }
              obj.children[obj.children.length-2].children[0].children[0].className='b-box-list';
          },
          error:function(err){
              alert(err);
          }
      });
    }


    //娱乐 八卦 大片 财经 股票 理财  博客 精选 读书 9
    pe('false/PE.txt',aPe[0]);
    pe('false/NBA.txt',aPe[1]);
    pe('false/PeShow.txt',aPe[2]);
    pe('false/muse.txt',aMuse[0]);
    pe('false/bagua.txt',aMuse[1]);
    pe('false/dapian.txt',aMuse[2]);
    pe('false/caijing.txt',aMoney[0]);
    pe('false/gupiao.txt',aMoney[1]);
    pe('false/licai.txt',aMoney[2]);


    pe('false/boke.txt',aDu[0]);
    pe('false/jingxuan.txt',aDu[1]);








//科技 探索 手机 数码 历史 文化 军事 社会  公益 游戏 看游戏 女性 时尚 情感  房产 二手房 家居
//    教育  出国 育儿  8




   // 7 尚品 高尔夫 旅游 相册 收藏 健康 宠物 美食 星座



    //5 智投 资讯






























};






