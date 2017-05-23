/**
 * @copyright www.coderluan.com
 * @author coderluan
 * @desc     
 */

class Main extends egret.DisplayObjectContainer {
    constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        var imgLoader: egret.ImageLoader = new egret.ImageLoader;
        imgLoader.once(egret.Event.COMPLETE, this.initGame, this);
        imgLoader.load("resource/assets/cartoon-egret_00.png");
    }

    //初始化赋值
    private initGame(evt: egret.Event): void {
        let background: egret.Shape = new egret.Shape();
        this.addChild(background);

        background.graphics.beginFill(0x000000, 0.8);
        background.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
        background.graphics.endFill();

        background.graphics.beginFill(0x000000, 0);
        background.graphics.lineStyle(2, 0xffffff);
        background.graphics.drawRect(20, 40, this.stage.stageWidth - 40, this.stage.stageHeight - 80);
        background.graphics.endFill();

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 4; y++) {
                let i = y * 8 + x;
                background.graphics.beginFill(0x000000, 0);
                background.graphics.lineStyle(2, 0xffffff);
                background.graphics.drawRect(130 + x * 100, 80 + y * 100, 80, 80);
                background.graphics.endFill();
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

        let bmd: egret.BitmapData = evt.currentTarget.data;
        let bird: egret.Bitmap = new egret.Bitmap(bmd);
        bird.width = 40;
        bird.height = 60;
        bird.x = 55;
        bird.y = 380;
        this.addChild(bird);

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

    }
}