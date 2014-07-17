//Used for constants' declaration
//Name in upper case
//Levy. Jul 13.
var WIDTH=2048;	//场景宽度
var HEIGHT=1300;	//场景高度
var SHOW_WIDTH=1024;	//展现画布宽度
var SHOW_HEIGHT=650;	//展现画布高度
var TRANSPARENT_COLOR=[163,73,164];	//作为透明色的颜色(已作废)
var FPS=60;		//帧率
var MAX_HEALTH=100;	//单人最大血量
var MAX_FALLING_SPEED=10000000;	//最大下落速度
var FLAG_FULL=63;	//全部加载完成时的变量（已作废）
var CANNOT_WALK=3;	//步行最大高度差
var JUMP_FORCE=140;	//跳跃力
var JUMP_LONG=50;	//跳远力
var LEAN_FORCE=30;	//空推力
var MIN_SPEED_RECOGNIZED=0.2;	//最小识别反弹速度
var KEY_UP=38;	//上键
var KEY_DOWN=40;	//下键
var KEY_LEFT=37;	//左键
var KEY_RIGHT=39;	//右键
var KEY_LCTRL=17;	//左ctrl键
var KEY_SPACE=32;	//空格键
var KEY_P=80;	//P键
var KEY_Z=90;	//Z键
var KEY_X=88;	//X键
var KEY_C=67;	//C键
var SAMPLE_RANGE=10;	//确定斜率的取样像素
var MAX_GRAD=10;	//最大斜率
var PLAYER_PIC_WIDTH=48;	//角色贴图宽度
var PLAYER_PIC_HEIGHT=32;	//角色贴图高度
var WORD_HEIGHT=50; 	//血量文字高度
var WORD_WIDTH=60; 	//血量文字宽度
var INIT_ANGLE=20; 	//初始角度
var MAP_MARGIN=20; 	//地图边沿：出则判死
var MAX_TEAM_HEALTH=100; 	//最大队伍血量（可变）
var MAX_HEALTH_WIDTH=400; 	//血队伍血条宽度
var MAX_ENERGY=200; 	//初始体力
var ENERGY_WIDTH=70; 	//体力指示条宽度

//Used for global variables' declaration
var globalTerrain={};	//全局地形类
var globalObjects=[];	//全局物体渲染数组
var globalContext2;	//图层2绘制设备
var globalContext3;	//图层3绘制设备
var globalFlag=0;	//加载进度指示器（已失效）
var globalPlayerCount=2;	//玩家数目
var globalIsIE;	//浏览器是否IE
var globalFocus;	//当前角色
var globalWind;	//风速