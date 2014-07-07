var totalWidth=350;
var deadlines=[];
var semeterID;
var foldDelayer=0;
var upDelayer=0,downDelayer=0;
var flash=false;
function flashOut()
{
	var x=$("#levyWrapper");
	if (!flash)
	{
		x.css("background-color","#000000");
		return;
	}
	if (x.css("background-color")=='rgb(0, 0, 0)')
		//x.css("background-color","#550000");
		x.animate({backgroundColor:"#990000"},500);
	else
		//x.css("background-color","#000000");
		x.animate({backgroundColor:"#000000"},500);
}
function disvisibleWrap()
{
	$("#levyWrapper").css("visibility","hidden");
}
function visibleWrap()
{
	$("#levyWrapper").css("visibility","visible");
}
function layerDown()
{
	x=$("#layouter");
	if (x[0].offsetTop<0)
		x.css("top",x[0].offsetTop+1);
}
function layerUp()
{
	x=$("#layouter");
	if (x[0].offsetTop>420-x.height())
		x.css("top",x[0].offsetTop-1);
}
function lupStart()
{
	$("div#leftBlock img").eq(1).attr("src","http://levythu.github.io/page_homework/hw3/img/arrow-down-red.png");
	clearInterval(upDelayer);
	clearInterval(downDelayer);
	upDelayer=setInterval(layerUp,5);
}
function ldStart()
{
	$("div#leftBlock img").eq(0).attr("src","http://levythu.github.io/page_homework/hw3/img/arrow-up-red.png");
	clearInterval(upDelayer);
	clearInterval(downDelayer);
	downDelayer=setInterval(layerDown,5);
}
function refreshTurnRed()
{
	$("div#leftBlock img").eq(2).attr("src","http://levythu.github.io/page_homework/hw3/img/spinner-r.png");
}
function stp()
{
	$("div#leftBlock img").eq(0).attr("src","http://levythu.github.io/page_homework/hw3/img/arrow-up.png");
	$("div#leftBlock img").eq(1).attr("src","http://levythu.github.io/page_homework/hw3/img/arrow-down.png");
	$("div#leftBlock img").eq(2).attr("src","http://levythu.github.io/page_homework/hw3/img/spinner.png");
	clearInterval(upDelayer);
	clearInterval(downDelayer);
}
function setPos()	//Set the position of mainWrapper
{
	var deltaY,deltaX;
	if ($(window).height()-500>0)
	{
		visibleWrap();
		deltaY=($(window).height()-500)/2;
	}
	else
	{
		disvisibleWrap();
		return;
	}
	if ($(window).width()-$("#levyWrapper").width()>0)
	{
		visibleWrap();
		deltaX=$(window).width()-$("#levyWrapper").width();
	}
	else
	{
		disvisibleWrap();
		return;
	}
	$("#levyWrapper").css("left",deltaX);
	$("#levyWrapper").css("top",deltaY);
}
function foldWrap()
{
  	$("#levyWrapper").animate({width:'16px',left:$(window).width()-16+"px",opacity:0.5},200,"swing");
}
function unfoldWrap()
{
	clearTimeout(foldDelayer);
  	$("#levyWrapper").animate({width:totalWidth+'px',left:$(window).width()-totalWidth+"px",opacity:1},200,"swing");
}
function delayFold()
{
	clearTimeout(foldDelayer);
	foldDelayer=setTimeout(foldWrap,500);
}
function noHomework()
{
	alert("没有获取到作业。");
}
function failGet()
{
	alert("网络连接失败。");
}
function bubbleSort()
{
	var t;
	for (var i=0;i<deadlines.length;i++)
		for (var j=i;j>0;j--)
			if (deadlines[j].endDate<deadlines[j-1].endDate)
			{
				t=deadlines[j];
				deadlines[j]=deadlines[j-1];
				deadlines[j-1]=t;
			}
}
function outputTime(ms)
{
	if(ms<0)ms=-ms;
	ms/=60000;
	if (ms<60)
		return parseInt(ms)+"分钟";
	ms/=60;
	if (ms<24)
		return parseInt(ms)+"小时";
	ms/=24;
	return parseInt(ms)+"天";
}
function layoutRes()
{
	bubbleSort();
	flash=false;
	var nowDate=new Date;
	$("#layouter").css("top",0).children().remove();
	for (var i=0;i<deadlines.length;i++)
	{
		if (deadlines[i].endDate<nowDate.getTime()) continue;
		var p;
		var f=(function(a,b)
		{
			return function(){
				window.open(baseUrl+"/f/student/homework/hw_detail/"+a+"/"+b);
			}
		})(deadlines[i].courseId,deadlines[i].homewkId);
		$("#layouter").append(p=$("<div class=subLayerC>"));
		var lp=
		p.append($("<div class=subLayer>")
							  .append($("<p>")
							  	.html("<a class='notice1'>"+deadlines[i].title+"</a><br>--"+deadlines[i].lv_theCourseName))
							  .append($("<p class=reeed>")
							  	.html("&nbsp;&nbsp;剩余时间: "+outputTime(deadlines[i].endDate-nowDate.getTime())))
					)
		 .append($("<div class=submitter>").click(f))
		;
		if (deadlines[i].endDate-nowDate.getTime()<18000000)
		{
			p.find(".reeed").css("color","#FF0000").css("font-weight","bold");
			flash=true;
		}
	}
}
function getHWInfoDetailed(courseID,courseName,isLast)
{
	$.ajax( {
		"type" : 'GET',
		"url" : baseUrl+"/b/myCourse/homework/list4Student/"+courseID+"/0",
		"dataType" : "json",
		"success" : function(resp) {
			if(resp.message == 'success'){
				list = resp.resultList;
				for(var i in list)
				{
					deadlines.push(list[i].courseHomeworkInfo);
					deadlines[deadlines.length-1].lv_theCourseName=courseName;
				}
				if(isLast)
					layoutRes();
			}else {
				failGet();
			}
		},
		async:false
	});
}
function getHWInformation()
{
	deadlines=[];
	$.get(
		"/b/myCourse/courseList/loadCourse4Student/"+semesterID,
		function(courseListMap){
			if(courseListMap.message!='success') failGet();
			else if(courseListMap.resultList==null||courseListMap.resultList=="") noHomework();
			else 
			{
				var detailCourse=courseListMap.resultList;
				for(var i in detailCourse)
					getHWInfoDetailed(detailCourse[i].course_id,detailCourse[i].course_name,i==detailCourse.length-1);
			}
		}
	);
}
function main()
{
	$("head").append($("<link href='http://levythu.github.io/page_homework/hw3/levywrapper.css' rel='stylesheet'>"));
	var toIns=$("<div id=levyWrapper class=LVwrapper>")
		.mouseover(unfoldWrap)
		.mouseleave(delayFold)
		.css("width",totalWidth);
	$("body").append(toIns);
	$(window).resize(setPos);
	setPos();
	toIns.append($("<div class=whiteLine>"))
		 .append($("<img src='http://levythu.github.io/page_homework/hw3/img/clock.png' class=logoIcon>"))
		 .append($("<div class=textShow>")
		 	.append($("<a>").html("Levy's  ").css("color","#FF7A00"))
			.append($("<a>").html("Deadline Manager").css("color","#CCCCCC"))
		 )
		 .append($("<div id=leftBlock>")
		 	.append($("<img src='http://levythu.github.io/page_homework/hw3/img/arrow-up.png' style='top:35px;' class='petiteButton'>").mouseover(ldStart).mouseleave(stp))
		 	.append($("<img src='http://levythu.github.io/page_homework/hw3/img/arrow-down.png' style='top:335px;' class='petiteButton'>").mouseover(lupStart).mouseleave(stp))
		 	.append($("<img src='http://levythu.github.io/page_homework/hw3/img/spinner.png' style='top:185px;' class='petiteButton'>").mouseover(refreshTurnRed).mouseleave(stp).click(getHWInformation))
		 )
		 .append($("<div id=rightBlock>")
		 	.append($("<div id=layouter>"))
		 )
	;
	semesterID="2013-2014-3";
	$(".ml10.courseNameList.blue").attr("target","blank");
	setInterval(flashOut,1800);
	getHWInformation();
}
$(main);