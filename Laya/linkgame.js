// 设定全局参数
var g_game_title = "五十音图对对碰";
var g_stat_width = 800;
var g_stat_heiht = 600;
var g_list_A = ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ", "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と", "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ", "ま", "み", "む", "め", "も", "や", "ゆ", "よ", "ら", "り", "る", "れ", "ろ", "わ", "を", "ん"];
var g_list_B = ["ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ", "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト", "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ", "マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ", "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン"];

var gameStatue = false;

if (g_list_A.length != g_list_B.length) {
	alert("[Error] 数据长度不匹配！！！");
}

// 随机下标顺序
var g_list_C = [];
for (var i = 0; i < g_list_A.length; i++) {
	g_list_C[i] = i;
}

function GetRandomNum(Min, Max) {
	var Range = Max - Min;
	var Rand = Math.random();
	return (Min + Math.round(Rand * Range));
}

function debugInfo(str) {
	var txt  = new  laya.display.Text();
	txt.text = "[Debug] " + str;
	txt.fontSize = 10;
	Laya.stage.addChild(txt);
}

// 设定环境
Laya.init(g_stat_width, g_stat_heiht);
//Laya.Stat.show(0, 0);

// 设定舞台属性
Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE; 

// 设定背景
var background = new Laya.Sprite();
background.loadImage("linkgame_back.jpg");
background.cacheAsBitmap = true;
Laya.stage.addChild(background);

// 设定标题
var title = new laya.display.Text();
title.text = g_game_title;
title.font = "Arial";
title.fontSize = 50;
title.stroke = 2;
title.strokeColor = "Black";
title.pos(g_stat_width / 2 - title.width / 2, 40);
Laya.stage.addChild(title);

// 设定版权信息
var copyright = new laya.display.Text();
copyright.text = "Copyright © 2016 程序员之乱";
copyright.font = "Arial";
copyright.fontSize = 20;
copyright.bold = true;
copyright.pos(20, g_stat_heiht - 35);
copyright.on(Laya.Event.CLICK, this, function() {
	window.location.href = "http://www.coderluan.com";
});
Laya.stage.addChild(copyright);

// 设定开始按钮与计时器
var  txt  = new  laya.display.Text();
txt.text = "点击此处开始游戏";
txt.font = "Arial";
txt.fontSize = 30;
txt.bold = true;
txt.pos(g_stat_width - txt.width - 40, g_stat_heiht - txt.height - 20);
Laya.stage.addChild(txt);
txt.on(Laya.Event.CLICK, this, function(e) {
	switch (e.type) {
		case Laya.Event.CLICK:
			gameStart();
			break;
	}
}); //注册鼠标点击

var card_A = -1;
var card_B = -1;
var winCount = 0;

var timeCount = 0;
var errorCount = 0;

var card = [];
var button = [];

// 设定卡片
for (var i = 0; i < 8; i++) {
	for (var j = 0; j < 3; j++) {
		var index = 8 * j + i
		card[index] = new Laya.Sprite();
		Laya.stage.addChild(card[index]);
		card[index].name = index;
		card[index].graphics.drawRect(0, 0, 80, 120, null, "#000000", 2);
		card[index].graphics.loadImage("linkgame_card.jpg");
		card[index].size(80, 120);
		card[index].pos(10 + 100 * i, 130 + 140 * j);
		card[index].on(Laya.Event.CLICK, this, function(e) {
			if (gameStatue == true) {
				if ((card_A == -1) && (card_B == -1)) {
					card_A = e.target.name;
					button[card_A].color = "red";
				} else if ((card_A != -1) && (card_B == -1)) {
					card_B = e.target.name;
					if ((g_list_A.indexOf(button[card_A].text) != -1) && (g_list_A.indexOf(button[card_A].text) == g_list_B.indexOf(button[card_B].text)) || (g_list_A.indexOf(button[card_A].text) == -1) && (g_list_A.indexOf(button[card_B].text) == g_list_B.indexOf(button[card_A].text))) {
						button[card_A].color = "red";
						button[card_B].color = "red";
						winCount = winCount + 1;
						if (winCount == 8 * 3 / 2) {
							//游戏结束
							Laya.timer.clear(this, gameCounter);
							var score = 100 - timeCount - errorCount;
							txt.text = "游戏结束 得分 : " + score;
						}
					} else {
						button[card_A].color = "black";
						button[card_B].color = "black";
						errorCount += 1;
					}
				} else if ((card_A != -1) && (card_B != -1)) {
					card_A = e.target.name;
					card_B = -1;
					button[card_A].color = "red";
				}
			}
		});
		button[index] = new laya.display.Text();
		Laya.stage.addChild(button[index]);
		button[index].fontSize = 50;
		button[index].pos(5 + 100 * i + 40 - 50 / 2, 150 + 140 * j + 60 - 50 / 2);
	}
}

// 开始游戏
function gameStart() {

	if (!gameStatue) {
		gameStatue = true;
		//初始化随机下标数组
		g_list_C.sort(function() {
			return 0.5 - Math.random()
		})
		var g_list_word = [];
		for (var i = 0; i < 8 * 3 / 2; i++) {
			g_list_word[i] = g_list_A[g_list_C[i]];
			g_list_word[i + 8 * 3 / 2] = g_list_B[g_list_C[i]];
		}
		g_list_word.sort(function() {
			return 0.5 - Math.random()
		})
		for (var i = 0; i < 24; i++) {
			button[i].text = g_list_word[i];
		}

		//开始计时
		Laya.timer.loop(1000, this, gameCounter);
	}
}

function gameCounter() {
	txt.text  =  "用时 : " + timeCount + "  失误:" + errorCount;
	timeCount += 1;
}