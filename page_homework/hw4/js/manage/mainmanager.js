var haveLoaded=[];
var NUM_OF_PICS=16;
var SPEED=1;
var onShow=-1;
var current;
var player=0,isPlaying,isInfo=false;
var isComment=true;
var upDelayer,downDelayer;
var NUMS_PER_PAGE=5;
var totalPage,currentPage=1;
var commentData=[];
var commentInited=0;
var isLoading=true,totalCom;
var isCommenting=false;
function setCurrentPic(theID)	//设置预览栏中的中央图片
{
	current=theID;
	var leftID=(theID-1+NUM_OF_PICS)%NUM_OF_PICS;
	var rightID=(theID+1)%NUM_OF_PICS;
	var slLeftID=(leftID-1+NUM_OF_PICS)%NUM_OF_PICS;
	var slRightID=(rightID+1)%NUM_OF_PICS;
	var veryLeftID=(slLeftID-1+NUM_OF_PICS)%NUM_OF_PICS;
	var veryRightID=(slRightID+1)%NUM_OF_PICS;
	
	$(".petiteImg").eq(theID).removeClass("hiddenImg").addClass("centerImg");
	$(".petiteImg").eq(leftID).removeClass("hiddenImg").addClass("leftImg");
	$(".petiteImg").eq(rightID).removeClass("hiddenImg").addClass("rightImg");
	$(".petiteImg").eq(slLeftID).removeClass("hiddenImg").addClass("slLeftImg");
	$(".petiteImg").eq(slRightID).removeClass("hiddenImg").addClass("slRightImg");
	$(".petiteImg").eq(veryLeftID).removeClass("hiddenImg").addClass("veryLeftImg");
	$(".petiteImg").eq(veryRightID).removeClass("hiddenImg").addClass("veryRightImg");
	
	loadPicture(current);
	loadPicture(leftID);
	loadPicture(rightID);
	loadPicture(slLeftID);
	loadPicture(slRightID);
}
function movePic(direction, speed, way)	//将预览栏的图片向左/右移动一格
{
	$(".petiteImg").css("transition",speed+"s "+way)
				   .css("-moz-transition",speed+"s "+way) /* Firefox 4 */
				   .css("-webkit-transition",speed+"s "+way) /* Safari & Chrome */
				   .css("-o-transition",speed+"s "+way); /* Opera */


	var leftID=(current-1+NUM_OF_PICS)%NUM_OF_PICS;
	var rightID=(current+1)%NUM_OF_PICS;
	var slLeftID=(leftID-1+NUM_OF_PICS)%NUM_OF_PICS;
	var slRightID=(rightID+1)%NUM_OF_PICS;
	var veryLeftID=(slLeftID-1+NUM_OF_PICS)%NUM_OF_PICS;
	var veryRightID=(slRightID+1)%NUM_OF_PICS;
	var exLeftID=(veryLeftID-1+NUM_OF_PICS)%NUM_OF_PICS;
	var exRightID=(veryRightID+1)%NUM_OF_PICS;
	
	if (direction=="left")
	{	
		loadPicture(veryRightID);
		loadPicture(current);
		$(".petiteImg").eq(veryLeftID).removeClass("veryLeftImg").addClass("hiddenImg");
		$(".petiteImg").eq(slLeftID).removeClass("slLeftImg").addClass("veryLeftImg");
		$(".petiteImg").eq(leftID).removeClass("leftImg").addClass("slLeftImg");
		$(".petiteImg").eq(current).removeClass("centerImg").addClass("leftImg");
		$(".petiteImg").eq(rightID).removeClass("rightImg").addClass("centerImg");
		$(".petiteImg").eq(slRightID).removeClass("slRightImg").addClass("rightImg");
		$(".petiteImg").eq(veryRightID).removeClass("veryRightImg").addClass("slRightImg");
		$(".petiteImg").eq(exRightID).addClass("veryRightImg").removeClass("hiddenImg");
		current=rightID;
	}
	if (direction=="right")
	{	
		loadPicture(veryLeftID);
		loadPicture(current);
		$(".petiteImg").eq(exLeftID).addClass("veryLeftImg").removeClass("hiddenImg");
		$(".petiteImg").eq(veryLeftID).removeClass("veryLeftImg").addClass("slLeftImg");
		$(".petiteImg").eq(slLeftID).removeClass("slLeftImg").addClass("leftImg");
		$(".petiteImg").eq(leftID).removeClass("leftImg").addClass("centerImg");
		$(".petiteImg").eq(current).removeClass("centerImg").addClass("rightImg");
		$(".petiteImg").eq(rightID).removeClass("rightImg").addClass("slRightImg");
		$(".petiteImg").eq(slRightID).removeClass("slRightImg").addClass("veryRightImg");
		$(".petiteImg").eq(veryRightID).removeClass("veryRightImg").addClass("hiddenImg");
		current=leftID;
	}
}
function addLoadingSign(fatherDiv,sizer)	//给父标签下加一个正在加载的svg动画
{
	fatherDiv.append($("<img src='img/loading.svg' class=loading>")
						.css("position","absolute")
						.css("height",sizer)
						.css("width",sizer)
						.css("left",(fatherDiv.width()-sizer)/2)
						.css("top",(fatherDiv.height()-sizer)/2)
						.css("z-index",1)
	)
}
function callbackMaker(picID)	//针对加载图片网址的异步回调函数生成器
{
	return function(data)
	{
		haveLoaded[picID]=(JSON.parse(data)).images[0];
		$(".petiteImg").eq(picID).append($("<img class=imgCover>").attr("src",haveLoaded[picID].url));
		if (onShow==picID)
			setGiantPic(picID);
	}
}
function loadPicture(picID)	//异步获取picID号图片的图片网址
{	
	if (haveLoaded[picID]!==false) return;
	if (picID==current) addLoadingSign($(".petiteImg").eq(picID),50);
	$.get("binginfo/"+(picID+1)+".txt",callbackMaker(picID));
}
function moveSeveral(direction,N)	//下方栏图片向某方向一次性移动N格
{
	$(".petiteImg img.loading").remove();
	if (N==1)
		movePic(direction,SPEED,"ease");
	else
	{
		var timeUnit=SPEED*1.0/N;
		movePic(direction,timeUnit,"ease-in");
		for (var i=1;i<=N-2;i++)
			setTimeout(function(){movePic(direction,timeUnit,"linear");},timeUnit*i*1000);
		setTimeout(function(){movePic(direction,timeUnit,"ease-out");},timeUnit*(N-1)*1000);
	}
	
	$(".petiteImg").css("transition","0.5s")
				   .css("-moz-transition","0.5s") /* Firefox 4 */
				   .css("-webkit-transition","0.5s") /* Safari & Chrome */
				   .css("-o-transition","0.5s"); /* Opera */
}
function moveToNum(N)	//移至某张图
{
	if (N==current) reuturn;
	if ((N-current+NUM_OF_PICS)%NUM_OF_PICS<(current-N+NUM_OF_PICS)%NUM_OF_PICS)
		moveSeveral("left",(N-current+NUM_OF_PICS)%NUM_OF_PICS);
	else
		moveSeveral("right",(current-N+NUM_OF_PICS)%NUM_OF_PICS);
}
function imgClickMaker(clickID)	//下方小图的点击事件生成器
{	
	return function()
	{
		var leftID=(current-1+NUM_OF_PICS)%NUM_OF_PICS;
		var rightID=(current+1)%NUM_OF_PICS;
		var slLeftID=(leftID-1+NUM_OF_PICS)%NUM_OF_PICS;
		var slRightID=(rightID+1)%NUM_OF_PICS;
		
		pausePlay();
		if (clickID==current)
		{
			
		}
		else if (clickID==leftID)
		{
			moveSeveral('right',1);
		}
		else if (clickID==rightID)
		{
			moveSeveral('left',1);
		}
		else if (clickID==slLeftID)
		{
			moveSeveral('right',2);
		}
		else if (clickID==slRightID)
		{
			moveSeveral('left',2);
		}
		setGiantPic(clickID);
	}
}
function setGiantPic(picID)	//设置大图，如没加载好则等待
{
	onShow=picID;
	$(".playedImg").removeClass("playedImg");
	$(".petiteImg").eq(picID).addClass("playedImg");
	window.localStorage.bigPic=picID;
	if (haveLoaded[picID]===false)
	{
		$("#picDiv").css("background-image","");
		addLoadingSign($("#picDiv"),50);
	}
	else
	{ 
		$("#picDiv img.loading").remove();
		$("#picDiv").css("background-image","url("+haveLoaded[picID].url+")");
		$("#text1").text(haveLoaded[picID].copyright);
		$("#text2").text(haveLoaded[picID].startdate);
		for (var i=0;i<4;i++)
		{
			$(".petiteDot").eq(i)
				.css("top",(i+1)*100+Math.random()*70)
				.css("left",Math.random()*350)
				.children(".text3").html(haveLoaded[picID].hs[i].desc+"<a href="+haveLoaded[picID].hs[i].link+" target=blank>"+haveLoaded[picID].hs[i].query+"</a>");
		}
	}
}
function startPlay()	//开始轮播
{
	isPlaying=true;
	$("#playButton").css("background-image","url(img/play-r.png)");
	player=setInterval(function()
	{
		var t=(onShow+1)%NUM_OF_PICS;
		setGiantPic(t);
		moveToNum(t);
	},5000)
}
function pausePlay()	//暂停轮播
{
	isPlaying=false;
	$("#playButton").css("background-image","url(img/play.png)");
	clearInterval(player);
}
function showInfo()	//显示图片上的文字及信息
{
	isInfo=true;
	$("#infoButton").css("background-image","url(img/info-r.png)");
	$("#hiddenInfo").css("opacity",1);
}
function hideInfo()	//隐藏图片文字信息
{
	isInfo=false;
	$("#infoButton").css("background-image","url(img/info.png)");
	$("#hiddenInfo").css("opacity","");
}
function adjustComment()	//根据窗口大小动态调整评论框细节
{
	$("#commentArea").height(window.innerHeight);
	if (isComment)
	{
		if (window.innerWidth<500)
			$("#commentArea").css("opacity",0);
		else
			$("#commentArea").css("opacity",1);
		
		if (window.innerHeight<230)
			$("#commentArea").css("opacity",0);
		else
		{
			$("#commentArea").css("opacity",1);
			$("#commentShower").height(window.innerHeight-150);
			$("#upButton").css("top",$("#commentShower").height()*0.1);
			$("#downButton").css("top",$("#commentShower").height()*0.9-30);
			$("#downLayer").css("top",window.innerHeight-57);
		}
	}
}
function getHeight(x,y)	//max{x,y}+5
{
	if (x>y)
		return x+5;
	else
		return y+5;
}
function layComment(commentID,page)	//呈现某页的某个评论
{
	var l=$("<div class=leftCO>");
	l.text(commentID.name).prepend($("<img class=commentImg>").attr("src","head/"+commentID.head));
	var r=$("<div class=rightCO>");
	r.text(commentID.comment);
	$("<div class=commentBlock>").append(l).append(r).appendTo($("#factShower")).height(getHeight(l.height(),r.height()));
}
function layCommentAll(fullPage)	//将某页的全部评论展现出
{
	for (var i=0;i<fullPage;i++)
		layComment(commentData[i],currentPage);
	isLoading=false;
}
function clearComment()	//清理当前页的评论
{
	$("#factShower").children().remove();
	commentInited=0;
}
function callbackMaker_lp(nums,fullPage)	//成功获取评论后的回调函数
{
	return function(data)
	{
		commentInited++;
		commentData[nums]=JSON.parse(data);
		if (commentInited==fullPage)
			layCommentAll(fullPage);
	}
}
function layPage(pageID)	//着手开始加载某页评论
{
	isLoading=true;
	clearComment();
	$("#factShower").css("top",0);
	var fullPage=((pageID==totalPage)?(totalCom%NUMS_PER_PAGE):NUMS_PER_PAGE);
	if (fullPage==0) fullPage=NUMS_PER_PAGE;
	for (var i=0;i<fullPage;i++)
		$.get("comment/"+((pageID-1)*NUMS_PER_PAGE+i+1)+".txt",callbackMaker_lp(i,fullPage));
	$("#pageIndexShower").text(pageID+"/"+totalPage);
	currentPage=pageID;
}
function layerDown()	//评论上移
{
	x=$("#factShower");
	if (x[0].offsetTop<0)
		x.css("top",x[0].offsetTop+1);
}
function layerUp()	//评论下移
{
	x=$("#factShower");
	if (x[0].offsetTop>$("#commentShower").height()-x.height())
		x.css("top",x[0].offsetTop-1);
}
function lupStart()	//开始持续上滚动
{
	clearInterval(upDelayer);
	clearInterval(downDelayer);
	upDelayer=setInterval(layerUp,5);
}
function ldStart()	//开始持续下滚动
{
	clearInterval(upDelayer);
	clearInterval(downDelayer);
	downDelayer=setInterval(layerDown,5);
}
function stp()	//停止滚动
{
	clearInterval(upDelayer);
	clearInterval(downDelayer);
}
function initComment()	//初始化评论个数、页数
{
	$.get("comment/totalCount.txt",function(DATA)
	{
		totalPage=Math.ceil((DATA-0)*1.0/NUMS_PER_PAGE);
		totalCom=DATA-0;
		isLoading=false;
	})
}
function foldComment()	//收起评论
{
	$("#bubbleButton").css("background-image","url(img/bubble.png)");
	isCommenting=false;
	$("#commentArea").css("left",-600);
}
function unfoldComment()	//展开评论
{
	$("#bubbleButton").css("background-image","url(img/bubble-r.png)");
	isCommenting=true;
	layPage(currentPage);
	pausePlay();
	$("#commentArea").css("left",0);
}
function getReady()	//DOM加载完成后执行总函数
{
	for (var i=0;i<NUM_OF_PICS;i++)
	{
		haveLoaded[i]=false;
		$("#changeDiv").append($("<div class='petiteImg hiddenImg'>").click(imgClickMaker(i)));
	}
	$("#playButton").click(function()
	{
		if (isPlaying)
			pausePlay();
		else
			startPlay();
	});
	$("#infoButton").click(function()
	{
		if (!isInfo)
			showInfo();
		else
			hideInfo();
	});
	$("#bubbleButton").click(function(e)
	{
		if (isCommenting)
			foldComment();
		else
			unfoldComment();
		e.stopPropagation();
	});
	$("#upButton").mouseover(function()
	{
		ldStart();
	}).mouseleave(function()
	{
		stp();
	});
	$("#downButton").mouseover(function()
	{
		lupStart();
	}).mouseleave(function()
	{
		stp();
	});
	$("#leftButton").click(function()
	{
		if (isLoading || (currentPage==1)) return;
		layPage(currentPage-1);
	});
	$("#rightButton").click(function()
	{
		if (isLoading || (currentPage==totalPage)) return;
		layPage(currentPage+1);
	});
	$("html").click(function()
	{
		if (isCommenting)
			foldComment();
	});
	$("#commentArea").click(function(e)
	{
		e.stopPropagation();
	});
	$("#postComment").click(function()
	{
		alert("施工中，请勿靠近！");
	});
	initComment();
	startPlay();
	
	if (typeof(window.localStorage.bigPic)=='undefined')
		window.localStorage.bigPic=0;
	setCurrentPic(window.localStorage.bigPic-0);
	setGiantPic(window.localStorage.bigPic-0);
}
$("document").ready(getReady);