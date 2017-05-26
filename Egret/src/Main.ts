/** 
 * @copyright www.coderluan.com
 * @author coderluan
 * @desc 日语五十音图对对碰小游戏
*/

let S1: string[] = [
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
let S2: string[] = [
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

class Main extends egret.DisplayObjectContainer {

    private loadingView: LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    private onConfigComplete(event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    private onResourceLoadComplete(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    private onItemLoadError(event: RES.ResourceEvent) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    private onResourceLoadError(event: RES.ResourceEvent) {
        console.warn("Group:" + event.groupName + " has failed to load");
        this.onResourceLoadComplete(event);
    }

    private onResourceProgress(event: RES.ResourceEvent) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield: egret.TextField;

    private createGameScene() {

        //发布APP时，在wing里修改屏幕横竖模式没有作用
        //要在发布的时候生成的android项目里找到AndroidManifest.xml文件
        //修改android:screenOrientation="landscape"
        this.stage.orientation = egret.OrientationMode.LANDSCAPE;
        this.stage.scaleMode = egret.StageScaleMode.SHOW_ALL;
       
        let background = new egret.Bitmap();
        let texture: egret.Texture = RES.getRes("bg_jpg");
        background.texture = texture;
        this.addChild(background);
        background.width = this.stage.stageWidth;
        background.height = this.stage.stageHeight;

        this.initGame();
    }

    private status: boolean = false;
    private count: number = 0;
    private score: number = 300;
    private label1: number = -1;
    private label2: number = -1;
    private info: egret.TextField = new egret.TextField();

    private initGame(): void {
        let background: egret.Shape = new egret.Shape();
        this.addChild(background);

        background.graphics.beginFill(0x000000, 1);
        background.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        background.graphics.endFill();

        background.graphics.beginFill(0x000000, 0);
        background.graphics.lineStyle(2, 0xffffff);
        background.graphics.drawRect(20, 40, this.stage.stageWidth - 40, this.stage.stageHeight - 80);
        background.graphics.endFill();

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 4; y++) {
                let button: egret.Sprite = new egret.Sprite();
                this.addChild(button);
                button.name = "b" + String(y * 8 + x);
                button.graphics.beginFill(0x000000, 0);
                button.graphics.lineStyle(2, 0xffffff);
                button.graphics.drawRect(140 + x * 100, 80 + y * 100, 80, 80);
                button.graphics.endFill();
                button.touchEnabled = true;
                button.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) { this.judgeNumber(e, button.name); }, this);
            }
        }

        let title: egret.TextField = new egret.TextField();
        this.addChild(title);
        title.text = "五十音图对对碰";
        title.size = 40;
        title.bold = true;
        title.width = 40;
        title.x = 55;
        title.y = 80;

        let button: egret.Sprite = new egret.Sprite();
        this.addChild(button);
        button.graphics.beginFill(0x000000, 0);
        button.graphics.lineStyle(2, 0xffffff);
        button.graphics.drawRect(40, 380, 80, 80);
        button.graphics.endFill();
        button.touchEnabled = true;
        this.info.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);

        this.addChild(this.info);
        this.info.text = "点我开始"
        this.info.size = 35;
        this.info.width = 80;
        this.info.height = 80;
        this.info.anchorOffsetX = this.info.width / 2;
        this.info.anchorOffsetY = this.info.height / 2;
        this.info.x = 85;
        this.info.y = 425;
        this.info.touchEnabled = true;
        this.info.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);

        let copyright: egret.TextField = new egret.TextField();
        this.addChild(copyright);
        copyright.textFlow = new Array<egret.ITextElement>(
            { text: "Copyright © 2016 程序员之乱", style: { "href": "http://www.coderluan.com/" } },
        );
        copyright.size = 20;
        copyright.x = this.stage.stageWidth - 20 - copyright.width;
        copyright.y = this.stage.stageHeight - 30;
        copyright.touchEnabled = true;
    }

    private startGame(): void {
        let data: string[] = this.getData();
        if (this.status == false) {
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 4; y++) {
                    let label: egret.TextField = new egret.TextField();
                    this.addChild(label);
                    label.text = data[y * 8 + x];
                    label.name = "l" + String(y * 8 + x);
                    label.size = 40;
                    label.x = 180 + x * 100;
                    label.y = 120 + y * 100;
                    label.anchorOffsetX = label.width / 2;
                    label.anchorOffsetY = label.height / 2;
                    label.touchEnabled = true;
                    label.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) { this.judgeNumber(e, label.name); }, this);
                }
            }

            let timer: egret.Timer = new egret.Timer(1000, 0);
            timer.addEventListener(egret.TimerEvent.TIMER, function () {
                if (this.status == true) {
                    this.info.text = "分数" + String(this.score);
                    this.score--;
                }
            }, this);
            timer.start();
        }
        this.status = true;
    }

    private judgeNumber(evt: egret.TouchEvent, name): void {
        let id: number = Number(name.substring(1));
        if (this.status == true) {
            if (this.label1 == -1) {
                this.label1 = id;
                (<egret.TextField>this.getChildByName(String("l" + this.label1))).textColor = 0xff0000;
            }
            else {
                this.label2 = id;
                let text1: string = (<egret.TextField>this.getChildByName(String("l" + this.label1))).text;
                let text2: string = (<egret.TextField>this.getChildByName(String("l" + this.label2))).text;
                if ((S1.indexOf(text1) != -1) && (S1.indexOf(text1) == S2.indexOf(text2))
                    || (S1.indexOf(text1) == -1) && (S1.indexOf(text2) == S2.indexOf(text1))) {
                    (<egret.TextField>this.getChildByName(String("l" + this.label2))).textColor = 0xff0000;
                    this.count += 1;
                    if (this.count == 16) {
                        this.status = false;
                    }
                }
                else {
                    (<egret.TextField>this.getChildByName(String("l" + this.label1))).textColor = 0xffffff;
                    (<egret.TextField>this.getChildByName(String("l" + this.label2))).textColor = 0xffffff;
                    this.score -= 5;
                }
                this.label1 = -1;
            }
        }
    }

    private getData(): string[] {
        let id: number[] = [];
        let ts: string[] = [];
        for (let i = 0; i < S1.length; i++) {
            id[i] = i;
        }
        id.sort(function () {
            return 0.5 - Math.random()
        })
        for (let i = 0; i < 16; i++) {
            ts[i] = S1[id[i]];
            ts[i + 16] = S2[id[i]];
        }
        ts.sort(function () {
            return 0.5 - Math.random()
        })
        return ts;
    }    
}


