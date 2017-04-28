//全局
var W = 800;//宽度
var H = 600;//高度
var S1 = [//平假名
	"あ", "い", "う", "え", "お",
	"か", "き", "く", "け", "こ",
	"さ", "し", "す", "せ", "そ",
	"た", "ち", "つ", "て", "と",
	"な", "に", "ぬ", "ね", "の",
	"は", "ひ", "ふ", "へ", "ほ",
	"ま", "み", "む", "め", "も",
	"や", "ゆ", "よ", "ら", "り",
	"る", "れ", "ろ", "わ", "を",
	"ん"];
var S2 = [//片假名
	"ア", "イ", "ウ", "エ", "オ",
	"カ", "キ", "ク", "ケ", "コ",
	"サ", "シ", "ス", "セ", "ソ",
	"タ", "チ", "ツ", "テ", "ト",
	"ナ", "ニ", "ヌ", "ネ", "ノ",
	"ハ", "ヒ", "フ", "ヘ", "ホ",
	"マ", "ミ", "ム", "メ", "モ",
	"ヤ", "ユ", "ヨ", "ラ", "リ",
	"ル", "レ", "ロ", "ワ", "ヲ",
	"ン"];
var CARD = [];//卡片图像
var LABEL = [];//卡片文字
var VALUE1 = -1;//第一次点击的id
var VALUE2 = -1;//第二次点击的id
var VALUEC = 0;//配对成功的次数
var ST = false;//游戏状态
var CR = 0;//计时
var ER = 0;//错误计数
var DA = "";//显示数据
//引擎
{
	Laya.init(W, H);
	Laya.stage.scaleMode = Laya.Stage.SCALE_SHOWALL;
	Laya.stage.screenMode = Laya.Stage.SCREEN_HORIZONTAL;
	Laya.stage.alignH = Laya.Stage.ALIGN_CENTER;
	Laya.stage.alignV = Laya.Stage.ALIGN_MIDDLE;
}
//背景
{
	var bg = new Laya.Sprite();
	bg.loadImage("linkgame_back.jpg");
	bg.cacheAsBitmap = true;
	Laya.stage.addChild(bg);
}
//标题
{
	var lb = new Laya.Label();
	lb.text = "五十音图对对碰";
	lb.font = "Arial";
	lb.fontSize = 50;
	lb.stroke = 2;
	lb.pos(W / 2 - lb.width / 2, 40);
	Laya.stage.addChild(lb);
}
//版权信息
{
	var cp = new Laya.Label();
	cp.text = "Copyright © 2016 程序员之乱";
	cp.font = "Arial";
	cp.fontSize = 20;
	cp.pos(20, H - 35);
	cp.on(Laya.Event.CLICK, this, function () {
		window.location.href = "http://www.coderluan.com";
	});
	Laya.stage.addChild(cp);
}
//卡片
{
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 3; j++) {
			var id = 8 * j + i;
			CARD[id] = new Laya.Image("linkgame_card.jpg");
			CARD[id].id = id;
			CARD[id].size(80, 120);
			CARD[id].pos(10 + 100 * i, 130 + 140 * j);
			CARD[id].on(Laya.Event.CLICK, this, check);
			Laya.stage.addChild(CARD[id]);
			LABEL[id] = new Laya.Label();
			LABEL[id].id = id;
			LABEL[id].text = "あ";
			LABEL[id].fontSize = 50;
			LABEL[id].pos(20 + 100 * i, 185 + 140 * j);
			LABEL[id].on(Laya.Event.CLICK, this, check);
			Laya.stage.addChild(LABEL[id]);
		}
	}
}
//开始按钮
{
	var lb = new Laya.Label();
	lb.text = "点击此处开始游戏";
	lb.font = "Arial";
	lb.fontSize = 30;
	lb.stroke = 2;
	lb.pos(W - lb.width - 40, H - lb.height - 20);
	Laya.stage.addChild(lb);
	lb.on(Laya.Event.CLICK, this, function (e) {
		switch (e.type) {
			case Laya.Event.CLICK:
				start();//开始游戏
				break;
		}
	});
	DA = lb;//引用
}
//开始
function start() {
	if (ST == false) {
		var id = [];
		var ts = [];
		for (var i = 0; i < S1.length; i++) {
			id[i] = i;
		}
		//随机取12对数据
		id.sort(function () {
			return 0.5 - Math.random()
		})
		for (var i = 0; i < 12; i++) {
			ts[i] = S1[id[i]];
			ts[i + 12] = S2[id[i]];
		}
		//打乱12对数据顺序
		ts.sort(function () {
			return 0.5 - Math.random()
		})
		for (var i = 0; i < 24; i++) {
			LABEL[i].text = ts[i];
		}
		//计时
		Laya.timer.loop(1000, this, counter);
		ST = true;
	}
}
//判断
function check(e) {
	if (ST == true) {
		if ((VALUE1 == -1) && (VALUE2 == -1)) {//第一次点击
			VALUE1 = e.target.id;
			LABEL[VALUE1].color = "red";
		} else if ((VALUE1 != -1) && (VALUE2 == -1)) {//偶数次点击
			VALUE2 = e.target.id;
			if ((S1.indexOf(LABEL[VALUE1].text) != -1)
				&& (S1.indexOf(LABEL[VALUE1].text) == S2.indexOf(LABEL[VALUE2].text))
				|| (S1.indexOf(LABEL[VALUE1].text) == -1)
				&& (S1.indexOf(LABEL[VALUE2].text) == S2.indexOf(LABEL[VALUE1].text))) {//正确
				LABEL[VALUE1].color = LABEL[VALUE2].color = "red";
				//游戏结束
				if (++VALUEC == 12) {
					Laya.timer.clear(this, counter);
					DA.text = "游戏结束 得分 : " + (100 - CR - ER * 5);
					ST = false;
				}
			} else {//错误
				LABEL[VALUE1].color = LABEL[VALUE2].color = "black";
				ER += 1;
			}
		} else if ((VALUE1 != -1) && (VALUE2 != -1)) {//奇数次点击
			VALUE1 = e.target.id;
			VALUE2 = -1;
			LABEL[VALUE1].color = "red";
		}
	}
}
//计时
function counter() {
	DA.text = "用时 : " + CR + "  失误:" + ER;
	CR += 1;
}