// グローバルに展開
phina.globalize();


// 定数
var ASSETS = {
  image: {
    bgi: 'src/bgi/grass.jpg',
    numbers: 'src/piecechip.png',
    tiles: 'src/fieldchip.png',
    gems: 'src/gems.png',
    bar: 'src/bar.png',
    magics: 'src/magics.png',
  },
};

var myApp = {};

var SCREEN_WIDTH    = 720;
var SCREEN_HEIGHT   = 1080;
var BLOCK_SIZE      = 80;
var MAXLIFE = 10;
var OFFSET_BTM = BLOCK_SIZE*5/4;

//タイトルシーン
phina.define("TitleScene", {
  superClass: 'DisplayScene',
  
  init: function(options){
    this.superInit({width: SCREEN_WIDTH,height: SCREEN_HEIGHT,});
    
    var label = Label('ThisIsTitle').addChildTo(this);
    label.x = this.gridX.center();
    label.y = this.gridY.center();
    
    var self = this;
    
    var startbtn = Button({text: ('START')}).addChildTo(this).setPosition(this.gridX.center(), 200 );
    startbtn.onpush = function(){ StartGame(true); self.exit(); };
    
    var tempbtn = Button({text: ('CLEARDATA')}).addChildTo(this).setPosition(this.gridX.center(), 320 );
    tempbtn.onpush = function(){ StartGame(false); self.exit(); };
    
  },
  
});



//マップシーン
phina.define("MapScene", {
  superClass: 'DisplayScene',
  
  init: function(options){
    this.superInit({width: SCREEN_WIDTH,height: SCREEN_HEIGHT,});
    var self = this;
	
	this.map = myApp.Game.Map;
	this.MapLayer = DisplayElement({width:this.map.size[0]*80, height:this.map.size[1]*80,}).addChildTo(this).setPosition(0, 0);
	this.MapLayer.setOrigin(0,0);
	//this.MapLayer.backgroundColor = "white";
	this.MapLayer.marginX = Math.abs(this.MapLayer.width-SCREEN_WIDTH);
	this.MapLayer.marginY = Math.abs(this.MapLayer.height-SCREEN_HEIGHT);
	
	this.mapwarp = [];
	for(var i in this.map.stages){
		this.mapwarp[i] = MapPiece().addChildTo(this.MapLayer).setPosition(this.map.stages[i].position[0]*80, this.map.stages[i].position[1]*80);
		this.mapwarp[i].pt = this.map.stages[i].pointer;
		this.mapwarp[i].onpointend = function(){
			self.openWindow(this);
		};
	}
    
    //メニュー
    var MenuBt = Button({text: "Menu"}).addChildTo(this).setPosition(600, 120);
    var menuscene = MenuScene({mapscene:self});
    MenuBt.onpush = function(){ self.app.pushScene( menuscene ); };
    //ショップ
	var ShopBt = Button({text: "Shop"}).addChildTo(this).setPosition(600, 192);
    var shopscene = ShopScene({mapscene:self});
    ShopBt.onpush = function(){ self.app.pushScene( shopscene ); };
    
    //設定とか？
    
    

  },
  
  
  
  openWindow: function(piece){
	var self = this;
	this.stageWindow = DisplayElement().addChildTo(this).setPosition(piece.x/2 + SCREEN_WIDTH/4, piece.y/2 + SCREEN_HEIGHT/4);
	var Bg = Shape({width:320, height:480}).addChildTo(this.stageWindow);
	
	var st1 = myApp.Game.Stages[ piece.pt[0] ][ piece.pt[1] ];
	var st2 = myApp.User.Stages[ piece.pt[0] ][ piece.pt[1] ];
	
	//info
	var tempLabel = Label("").addChildTo(Bg).setPosition(0, -120);
	if(st1.disc)tempLabel.text += st1.disc + "\n\n";
	var qt = st1.questions;
	for(var i in qt) tempLabel.text += qt[i].text + "\n";
	
	var gobt = Button({text: ('Go')}).addChildTo(Bg).setPosition(0, 80 );
	gobt.onpush = function(){
		self.stageWindow.remove();
		self.exit("Stage", {stage: piece.pt[0], stagenum: piece.pt[1] });
	};
	
	var canselbt = Button({text: ('Cancel')}).addChildTo(Bg).setPosition(0, 160 );
	canselbt.onpush = function(){
		self.stageWindow.remove();
	};
	
  },
  
  
  onpointmove: function(e){
	var p = e.pointer;
	var newx = this.MapLayer.x + (p.position.x - p.prevPosition.x);
	var newy = this.MapLayer.y + (p.position.y - p.prevPosition.y);
	
	if(newx < 0) this.MapLayer.x = 0;
	else if(newx > this.MapLayer.marginX) this.MapLayer.x = this.MapLayer.marginX;
	else this.MapLayer.x = newx;
	
	if(newy < 0) this.MapLayer.y = 0;
	else if(newy > this.MapLayer.marginY) this.MapLayer.y = this.MapLayer.marginY;
	else this.MapLayer.y = newy;
	
  },
  
  
});

//マップのワープする場所
phina.define('MapPiece', {
  superClass: 'Sprite',

  init: function(option) {
    this.superInit('tiles', 80, 80);
    //this.scaleX = 0.5;
    //this.scaleY = 0.5;
	
	this.interactive = true;
	this.checkHierarchy = true;
	
    //this.index = option.index;
    this.frameIndex = 2;
    
  },
  

});



//メニュー
phina.define("MenuScene", {
  superClass: 'DisplayScene',
  
  init: function(option){
  	this.superInit({width: SCREEN_WIDTH,height: SCREEN_HEIGHT,});
  	
  	this.backgroundColor = "white";
  	
  	this.modes = ["gem","status", "item", "magic", "rensei", "cancel"];
  	this.mode = "gem"; //status, item, rensei, ...
  	
  	var self = this;
  	
  	this.Subwindow = DisplayElement().addChildTo(this).setPosition(160, 0).setOrigin(0,0);
  	
  	
  	for(var i=0; i<this.modes.length; i++){
  		var bt = Button({text: this.modes[i]}).addChildTo(this).setPosition(64, 120*(i+1) );
  		bt.width = 128;
  		bt.mode = this.modes[i];
  		bt.onpush = function(){
  			self.Subwindow.remove();
  			self.show(this.mode);
  		};
  	}
  	
  	//this.
  	
  	
    //
  },
  
  show: function(mode){
    this.Subwindow = DisplayElement().addChildTo(this).setPosition(160, 0).setOrigin(0,0);
    switch(mode){
    	case "gem":
    		var i = 1;
    		for(var key in myApp.User.Gems)
    			if(myApp.User.Gems[key].num>0){
    				var gemLabel = Label( myApp.Game.Gems[key].title + ": " + myApp.User.Gems[key].num).addChildTo(this.Subwindow).setPosition(120,64 * i);
    				i++;
    			}
    	break;
    	case "status":
    		var lifeLabel = Label( "Life: " + myApp.User.Life.num).addChildTo(this.Subwindow).setPosition(this.gridX.center(),32);
    	break;
		
    	case "magic":
    		
    	break;
    	
    	case "rensei":
    		var i = 0;
    		//var Gemlines = [];
    		for(var key in myApp.Game.Gems){
    			if(myApp.Game.Gems[key].recipe!=null){
    				var gemLabel = Label( myApp.Game.Gems[key].title + ": " + myApp.User.Gems[key].num + "\n" + myApp.Game.Gems[key].recipe ).addChildTo(this.Subwindow).setPosition(0,96*(i+1)).setOrigin(0,0);
    				var bt = Button({text: "錬成"}).addChildTo(this.Subwindow).setPosition(240,96*(i+1)).setOrigin(0,0);
    				bt.key = key;
    				bt.onpush = function(){
    					var can = true;
    					for(var type in myApp.Game.Gems[this.key].recipe){
    						if(myApp.User.Gems[type].num < myApp.Game.Gems[this.key].recipe[type]) can = false;
    						console.log(this.key, type, myApp.User.Gems[type].num, myApp.Game.Gems[this.key].recipe[type]);
    					}
    					
    					if(myApp.User.Gems["stone"].num < myApp.Game.Gems[this.key].stone) can = false;
    					console.log(can)
    					if(can){
    						for(var type in myApp.Game.Gems[this.key].recipe)
    						myApp.User.Gems[type].num -= myApp.Game.Gems[this.key].recipe[type];
    						myApp.User.Gems["stone"].num -= myApp.Game.Gems[this.key].stone;
    						myApp.User.Gems[this.key].num += 1;
    					}
    					
    				};
    				i++;
    			}
    		}
    	break;
    	
    	case "cancel":
    		this.app.popScene();
    	break;
    	default:
    	break;
    }
    
  },
  
});

//ショップ
phina.define("ShopScene", {
  superClass: 'DisplayScene',
  init: function(options) {
  	this.superInit({width: SCREEN_WIDTH,height: SCREEN_HEIGHT,});
  	
  	this.backgroundColor = "white";
  	
  	this.modes = ["sell", "buy", "cancel"];
  	this.mode = "sell";
  	
  	this.Subwindow = DisplayElement().addChildTo(this).setPosition(160, 0).setOrigin(0,0);
  	
  	var self = this;
  	
  	for(var i=0; i<this.modes.length; i++){
  		var bt = Button({text: this.modes[i]}).addChildTo(this).setPosition(64, 120*(i+1) );
  		bt.width = 128;
  		bt.mode = this.modes[i];
  		bt.onpush = function(){
  			self.Subwindow.remove();
  			self.show(this.mode);
  		};
  	}
  	
  },
  
  show: function(mode){
    this.Subwindow = DisplayElement().addChildTo(this).setPosition(160, 0).setOrigin(0,0);
    var self = this;
    switch(mode){
    	case "sell":
    		var i = 0;
    		var Gemlines = [];
    		for(var key in myApp.User.Gems)
    			if(myApp.User.Gems[key].num>0){
    				Gemlines.push(DisplayElement().addChildTo(this.Subwindow).setPosition(120,96*(i+1)));
    				var gemLabel = Label( myApp.Game.Gems[key].title + ": " + myApp.User.Gems[key].num).addChildTo(Gemlines[i]).setPosition(0,0).setOrigin(0,0);
    				var bt = Button({text: "sell 1"}).addChildTo(Gemlines[i]).setPosition(160, 0 ).setOrigin(0,0);
    				bt.key = key;
    				bt.onpush = function(){
    					self.sell(this.key, 1);
    				};
    				i++;
    			}
    			var coinLabel = Label( "Coin: " + myApp.User.Coin).addChildTo(this.Subwindow).setPosition(480,64);
    	break;
    	case "buy":
    		var lifeLabel = Label( "Life: " + myApp.User.Life.num).addChildTo(this.Subwindow).setPosition(this.gridX.center(),32);
    	break;
    	case "cancel":
    		this.app.popScene();
    	break;
    	default:
    	break;
    }
  
  },
  
  
  sell: function(name, num){
  	myApp.User.Gems[name].num -= num;
  	myApp.User.Coin += myApp.Game.Gems[name].coin * num;
  },
  
});

//はじまる前
phina.define("bStageScene", {
  superClass: 'DisplayScene',

  // 初期化
  init: function(options) {
      this.superInit({width: SCREEN_WIDTH,height: SCREEN_HEIGHT,});
      
      this.stage = options.stage;
      this.stagenum = options.stagenum;
      this.stageinfo = myApp.Game.Stages[this.stage][this.stagenum];
      //仮。

      
      var tempLabel = Label( "Stage " + this.stagenum + " ready\n\n" ).addChildTo(this).setPosition(this.gridX.center(), 160);
      
      if(this.stageinfo.disc)tempLabel.text += this.stageinfo.disc + "\n\n";

      var qt = this.stageinfo.questions;
      for(var i in qt) tempLabel.text += qt[i].text + "\n";
  },
  
  
  onpointend:function(){
  	this.exit("Stage", {stage: this.stage, stagenum: this.stagenum});
  },
  
});

//終わった後
phina.define("aStageScene", {
  superClass: 'DisplayScene',

  // 初期化
  init: function(options) {
      this.superInit({width: SCREEN_WIDTH,height: SCREEN_HEIGHT,});
      //セーブ処理
      //一部、前のシーンに移動したい。
      if(options.result == true){
      	var dt = myApp.User.Stages[options.stage][options.stagenum];
      	//クリアの状況に応じてかえたい
      	dt.rank = 1;
      	if(dt.highscore<options.score) dt.highscore = options.score;
      	//石とかアイテム
      	for(var key in options.bargain){
      		var g = myApp.User.Gems[key];
      		if(g) g.num += options.bargain[key];
      	}
      }
      SaveData();
      
      if(options.result == false) LoseLife();
      
      var scoreLabel = Label().addChildTo(this).setPosition(this.gridX.center(),this.gridY.center());
      scoreLabel.text = "score: " + options.score + "\nhighscore: "+ myApp.User.Stages[options.stage][options.stagenum].highscore;
      var resLabel = Label().addChildTo(this).setPosition(this.gridX.center(),this.gridY.center()+128);
      
      if(options.result == true) resLabel.text = "Game Clear!";
      else resLabel.text = "Failed!";
      
      var gemLabel = Label("").addChildTo(this).setPosition(this.gridX.center(),this.gridY.center()+192);
      for(var key in options.bargain){
      	gemLabel.text += myApp.Game.Gems[key].title + ": " + options.bargain[key] + "\n";
      }
      
  },

  onpointend:function(){
  	this.exit("Map");
  },

});

//ゲーム中ポーズ
phina.define("PauseGame", {
  superClass: 'DisplayScene',
  
  init: function(options) {
    this.superInit({width: SCREEN_WIDTH,height: SCREEN_HEIGHT,});
  	
  	this.backgroundColor = 'rgb(50,50,50)';
  	
  	var hintLabel = Label().addChildTo(this).setPosition(this.gridX.center(), 80);
  	hintLabel.originY = 0;
  	hintLabel.fill = "white";
  	if(options.text)hintLabel.text = options.text;
  	
  	var self = this;
  	
  	var bbt = Button({text: 'Back'}).addChildTo(this).setPosition(560, 32 );
  	bbt.onpush = function(){ self.app.popScene();};
  	
  	var qbt = Button({text: 'Quit'}).addChildTo(this).setPosition(560, 920 );
  	qbt.onpush = function(){
  		var iswin = (options.gamescene.state.level != "quota")
  		
  		self.app.popScene();
  		//options.gamescene.exit("Map");
  		options.gamescene.endGame(iswin);
  	}
  },

});

//メインシーン
phina.define("StageScene", {
  // 継承
  superClass: 'DisplayScene',

  // 初期化
  init: function(options) {
    // super init
    this.superInit({width: SCREEN_WIDTH,height: SCREEN_HEIGHT,});
    var self = this;
    
    //ステージよみこみ
    this.stage = options.stage;
    this.stagenum = options.stagenum;
    this.stageinfo = myApp.Game.Stages[this.stage][this.stagenum];
    //問題を保持
    this.questions = this.stageinfo.questions;
    //ミッションを保持
    this.missions = [];
    //ミッションとかの状態
    this.state={level: "start"}; //, score: 0 
    this.bargain = {stone: 0};
    this.score = 0;
    this.missionNext();
        
    //数字の出具合
    this.pieceinfo = [0];
    for(var i in this.stageinfo.piece) this.pieceinfo.push(this.pieceinfo[i] + this.stageinfo.piece[i]);
	
	
	this.maxlinelen = 1;
	for(var i in this.questions) this.maxlinelen = Math.max(this.maxlinelen, this.questions[i].lensum);
	
    //フィールドとかレイヤー
    this.bgi = Sprite("bgi").addChildTo(this).setOrigin(0,0);
    
	this.field = Field(this.stageinfo.map).addChildTo(this);
	this.dropMap();
	this.field.effect = FieldEffect(this.stageinfo.map).addChildTo(this.field);
	

	
    //ラベル表示
    this.questPanel = Shape({width:320,height:240}).addChildTo(this).setPosition(180, 200);
    this.questPanel.backgroundColor = "black";
	this.questLabel = Label("お題\n").addChildTo(this.questPanel)
    for(var i in this.questions) this.questLabel.text += this.questions[i].text + "\n";
	this.questLabel.fill = '#fff';

	this.coinLabel = Label('Score: 0').addChildTo(this).setPosition(32, 32);
	this.coinLabel.setOrigin(0,0);
	//coinLabel.fontSize = 80;
	this.coinLabel.fill = '#fff';
	
	// タイマーラベルを生成
    this.timerLabel = Label("").addChildTo(this).setPosition(32, 0);
    this.timerLabel.setOrigin(0,0);
    this.timerLabel.fill = '#fff';
    this.time = 1 * 1000;
    
    this.timeBar = TimeBar().addChildTo(this);
	
	//ミッション表示
	this.missionPanel = Shape({width:320,height:240}).addChildTo(this).setPosition(540, 200);
	this.missionPanel.backgroundColor = "black";
	this.missionLabel = Label("ミッション\n").addChildTo(this.missionPanel)
	this.missionLabel.fill = '#fff';
	for(var i in this.missions) this.missionLabel.text += this.missions[i][0].title + " " + this.missions[i][0].goal + "\n";
	
	//ポーズボタン
	this.pausebt = Button({text: 'Pause'}).addChildTo(this).setPosition(560, 32 );
	this.pausescene = PauseGame({text:this.stageinfo.hint, gamescene:self});
	this.pausebt.onpush = function(){
		self.app.pushScene(self.pausescene);
	};
	
	//真ん中に表示されるラベル
	this.signLabel = Label("READY").addChildTo(this).setPosition(this.gridX.center(), this.gridY.center());
	this.signLabel.fontSize = 80;
	this.signLabel.fill = 'red';
	
	this.inputline = [];
	this.inputvanish = [];
	this.animdepth = 0;
	
	this.mode = 0;
	
	this.dragging = -1;
	//魔法デッキ？
	this.magicPanel = Shape({width:SCREEN_WIDTH,height:BLOCK_SIZE}).addChildTo(this).setPosition(0, SCREEN_HEIGHT-OFFSET_BTM).setOrigin(0,0);
	this.magicPanel.padding = 0;
	this.magicPanel.backgroundColor = "black";
	this.magics = []
	for(var i=0; i<myApp.User.myMagics.length; i++){
		var mb = MagicBomb({type:myApp.User.myMagics[i], index:i}).addChildTo(this);
		var mblbl = Label(mb.magic.title +"\n"+ mb.magic.tp +"秒").addChildTo(this).setPosition(mb.x+60, mb.y);
		mblbl.fill = '#fff';
		mblbl.fontSize = 24;
		
		mb.onpointstart = function(){self.dragging = this.index;};
		mb.onpointend = function(){self.dragging = -1; this.actuate(self); this.x = this.defx; this.y = this.defy;};
		this.magics.push(mb);
	}

	//時間回復の
    if(this.stageinfo.fullscore) this.fullscore = this.stageinfo.fullscore;
    else this.fullscore = 1000;
	this.fillscore = 0;
	this.fillBtn = Button({text: "0%", width:80, height:80}).addChildTo(this).setPosition(SCREEN_WIDTH-120, SCREEN_HEIGHT-100);
	this.fillBtn.setOrigin(0,0);
	this.content = 0;
	this.fillBtn.addtime = function(){if(self.content>=1){self.opeTime(this.stageinfo.time); self.fillscore=0; self.checkFill();} };
	
	
  },
  
  //更新
  update: function(app) {
	// タイマーを更新
	if(this.mode < 100){
		var t1 = Math.ceil(this.time/1000);
		this.time -= app.ticker.deltaTime;
		var t2 = Math.ceil(this.time/1000);
		
		switch(this.mode){
			case 0:
				if(this.time <= 0){
					this.time = this.stageinfo.time*1000;
					this.signLabel.remove();
					this.mode = 1;
				}
			break;
			case 1:
				//1秒ごとに時間表示
				if(t2<t1){
					this.timerLabel.text = t2 + "/" + this.stageinfo.time; // 秒数に変換
					this.timeBar.upd(t2/this.stageinfo.time);
				}
			  	//タッチが有効
			  	var p = app.pointer;
			  	if(this.dragging!= -1){
			  		this.magics[this.dragging].drag(p.x, p.y);
			  	}
			  	else{
				  	var index = this.field.pushcheck(p, this.inputline);
				  	this.addLine(index);
			  	}
			  	
				if(this.time < 0){
					if(this.content>=1){
						this.opeTime(this.stageinfo.time);
						this.fillscore=0;
						this.checkFill();
					}
					else{
						if(this.inputline.length > 0){
							this.checkAns();
							this.remLine();
						}
						else{
							this.time = 2 * 1000;
							this.signLabel.text = "TIME OVER"
							this.signLabel.addChildTo(this);
							if (this.state.level != "quota") this.mode = 3;
							else this.mode = 2;
						}
					}

				}
			break;
			case 2:
				if(this.time <= 0){
					this.endGame(false);
				}
			case 3:
				if(this.time <= 0){
					this.endGame(true);
				}
			break;
		}
  	}
  	
  	if(this.mode == 101){ //連鎖中
  		if(this.inputvanish[0]){
  			if(this.animdepth<3){
	  			for(var i in this.inputvanish[0]){
	  				var a = this.inputvanish[0][i];
	  				this.field.pieces[a[0]][a[1]].anim(this.animdepth+2);
  				}
   				this.animdepth += 1;
  			}
	  		else {
	  			this.animdepth = 0;
	  			for(var i in this.inputvanish[0]){
		  			var a = this.inputvanish[0][i];
		  			//this.field.map[a[0]][a[1]]=-1;
	  			}
	  			this.inputvanish.shift() ;
	  		}
  		}
  		else{
	  		this.dropMap();
	  		this.mode = 1;
  		}
  	}
  },
  onpointend:function(){
	if(this.inputline.length>0){
	  	this.checkAns();
	  	this.remLine();
  	}
  	//animation
	this.field.effect.line = this.inputline;
	this.field.effect._dirtyDraw = true;
  },
  
  opeTime: function(num){
  	if(num==null)this.time = this.time = this.stageinfo.time * 1000;
  	else this.time += num * 1000;
  	
  	var t = Math.floor(this.time/1000);
  	this.timerLabel.text = t + "/" + this.stageinfo.time; // 秒数に変換
	this.timeBar.upd(t/this.stageinfo.time);
  },
  
  addCoin: function(num){
  	this.score += num;
  	this.fillscore += num;
  	this.checkFill();
	this.coinLabel.text = 'Score: ' + this.score;
  },
  
  checkFill: function(){
  	this.content = Math.min(this.fillscore/this.fullscore, 1);
  	this.fillBtn.text = Math.floor(this.content * 100) + "%";
  },
  
  missionNext: function(){
  	if(this.state.level!="start"){
	  	this.missions = [];
	  	var rate = this.stageinfo.missionrate;
	  	var r = Math.floor( Math.random() * rate.length );
	  	this.state.level = rate[r];
	  	for(var i in this.stageinfo.missions[ this.state.level ]){
	  		this.missions.push([this.stageinfo.missions[ this.state.level ][i], false]);
	  		this.missions[i][0].init(this.state);
	  	}
	  	return true;
  	}
  	else{
		this.missions = [];
		this.state.level = "quota";
		for(var i in this.stageinfo.missions.quota){
	  		this.missions.push([this.stageinfo.missions.quota[i], false]);
	  		this.missions[i][0].init(this.state);
	  	}
  	}
  },
  
  endGame: function(iswin){
  	if(iswin){
  	//時間がスコアになるやつ
  		//this.score += this.time;
  		this.exit("AfterStage", {score:this.score, result:true, stage: this.stage, stagenum: this.stagenum, bargain:this.bargain });
  	}
  	else this.exit("AfterStage", {score:this.score, result:false, stage: this.stage, stagenum: this.stagenum, bargain:{} });
  },
  
  checkAns: function(){
	//var vanish = [];
	var inp = [];
	for (var i in this.inputline){
		inp.push(this.field.pieces[Math.floor(this.inputline[i]/100)][this.inputline[i]%100].num);
	}
	
	while(true){
		console.log(inp);
		var isRight = false;
		var maxlen = 0;
	    //答え合わせ
	    this.temp = {fill:[], stone:0, more:[]}
	    for(var i in this.questions){
	        var res = this.questions[i].check(inp);
	        isRight = (isRight || res[0]);
	        this.addCoin(res[1]*10);
	        maxlen=Math.max(res[2], maxlen);
	        
	        //ミッション条件 数式
			if(res[0]) this.temp.more.push(res[1]);
			if(res[0]) this.temp.fill.push(res[3]); //for(var j in this.missions) this.missions[j][0].check(this);
	    }
		if(isRight){
			this.mode = 101;
			console.log("yes!");
			var vanishblock = [];
			for (var i=0; i<maxlen; i++){
				var a = [Math.floor(this.inputline[0]/100), this.inputline[0]%100];
				//消滅とアニメーション
				this.field.map[a[0]][a[1]]=-1;
				vanishblock.push(a);
				//石をまきこむ
				for(var ay=-1;ay<=1;ay++)for(var ax=-1;ax<=1;ax++){
					if(this.field.map[a[0]+ay]&&this.field.map[a[0]+ay][a[1]+ax]==10){
						vanishblock.push([a[0]+ay, a[1]+ax]);
						this.field.map[a[0]+ay][a[1]+ax]=-1;
						//ミッション条件 石
						this.temp.stone += 1;
						this.bargain.stone += 1;
				}}
				inp.shift();
				this.inputline.shift();
			}
			this.inputvanish.push(vanishblock);
			//this.dropMap();
			//ミッションチェック//と時間回復
			for(var j in this.missions){
				var bonus = this.missions[j][0].check(this.temp, this.state);
				//this.time += 1000*bonus;
				
			}
			//ミッション達成をしらべる
			if(this.state.level == "quota") this.missionLabel.text = "クリア条件\n";
			else this.missionLabel.text = myApp.Game.Gems[this.state.level].title +": \n";
			for(var i in this.missions){
				if(!this.missions[i][1])this.missions[i][1] = this.missions[i][0].achieved(this.state);
				if(!this.missions[i][1])this.missionLabel.text += this.missions[i][0].title + " " + this.state[this.missions[i][0].name] + "/" +this.missions[i][0].goal + "\n";
			}
			var misres = this.checkMission();
			if(misres){
				//ミッション成功＆変更
				if(this.state.level != "quota"){
					if(this.bargain[this.state.level])this.bargain[this.state.level] += 1;
					else this.bargain[this.state.level] = 1;
				}
				
				var next = this.missionNext();
				//if(next)this.time = this.stageinfo.time * 1000;
			}
		}
		else break;
	}
	
  },
  
  
  checkMission: function(){
  	var result = true;
  	for (var i in this.missions) result = (result && this.missions[i][1] );
  	return result;
  },
  
  
  setMap: function(){
  	for(var i=0; i<this.field.sizeY; i++){
		for(var j=0; j<this.field.sizeX; j++){
  			this.field.pieces[i][j].set(this.field.map[i][j]);
  		}
  	}
  },
  
  dropMap: function(){
  	var droplist = [];
  	
  	for(var isDropped=true; isDropped!=false; ){
	  	
	  	var isDropped = false;
	  	for(var i=this.field.sizeY-1; i>-1; i--){
			for(var j=0; j<this.field.sizeX; j++){
	  			if(this.field.map[i][j]==-1){
	  				if(i>0){
	  					this.field.map[i][j] = this.field.map[i-1][j];
	  					this.field.map[i-1][j] = -1;
	  				}
	  				else {
	  					var rnd = Math.floor( Math.random() * this.pieceinfo[11] );
	 					for(num=0; ; num++) if(this.pieceinfo[num]<=rnd && this.pieceinfo[num+1]>rnd) break;
	  					this.field.map[i][j] = num;
	  					//if(this.field.map[i][j]==10) console.log("10");
	  				}
	  				this.field.pieces[i][j].high += 1;
	  				if(droplist.indexOf(this.field.pieces[i][j])==-1) droplist.push(this.field.pieces[i][j]);
	  				isDropped = true;
	  			 }
	  		}
	  	}
  	}
  	
  	this.setMap();
  	for(i in droplist) droplist[i].drop();
  	
  },
  
  addLine: function(ind){
	if(this.field.pieces[ind[0]]) var pc = this.field.pieces[ind[0]][ind[1]];
	var line = this.inputline;
	
	var index = ind[0]*100 + ind[1];

    if(pc){
    	var ido = line.indexOf(index);
        if(line.length>1 && ido>-1 ){
        	if(ido==line.length-2){
        		var last = line[line.length-1];
        		this.field.pieces[ Math.floor(last/100) ][ last%100 ].anim(0);
        		line.pop();
        	}
        	
        }
        //else if( line.length<this.maxlinelen && pc.num<10){line.push(index); pc.anim(1);}
        else if( pc.num<10){line.push(index); pc.anim(1);}
    }
    
  },
  
  remLine: function(){
	for(var i in this.inputline) this.field.pieces[ Math.floor(this.inputline[i]/100) ][ this.inputline[i]%100 ].anim(0);
	this.inputline = [];
  },
  
});

//フィールド
phina.define('Field', {
  superClass: 'Shape',
  
  init: function(map) {
  	this.superInit();
	
	this.sizeY = map[0];
	this.sizeX = map[1];
	
	this.width = BLOCK_SIZE * this.sizeX;
	this.height = BLOCK_SIZE * this.sizeY;
	
	this.origin.set(0, 0);
	this.padding = 0;
	
	//this.blendMode = 'multiply';
	//this.blendMode = 'linear';
	
	this.x = (SCREEN_WIDTH-this.width)/2;
	this.y = (SCREEN_HEIGHT - OFFSET_BTM - BLOCK_SIZE*(8+this.sizeY)/2 );
	
	
	this.map = [];
	this.pieces = [];
	for(var i=0; i<this.sizeY; i++){
		var mline = [];
		var pline = [];
		for (var j=0; j<this.sizeX; j++){
			mline.push(-1);
			var p = Piece({index: BLOCK_SIZE * i + j, x:BLOCK_SIZE * j + BLOCK_SIZE/2, y:BLOCK_SIZE * i + BLOCK_SIZE/2 }).addChildTo(this);
			pline.push(p);
		}
		this.map.push(mline);
		this.pieces.push(pline);
	}
	
	this.effect = null;
  },
  
  render: function(){
  	var c = this.canvas;
  	var tiles = AssetManager.get('image', 'tiles');
  	var bs = BLOCK_SIZE
  	
  	for(var i=0; i<this.sizeY; i++){
  		for(var j=0; j<this.sizeX; j++){
  			if((i+j)%2==0) c.context.drawImage(tiles.domElement, 0, 0, bs, bs, bs*j-this.width/2, bs*i-this.height/2, bs, bs);
  			else c.context.drawImage(tiles.domElement, bs, 0, bs, bs, bs*j-this.width/2, bs*i-this.height/2, bs, bs);
  		}
  	}
  },
  
  getposition: function(p){
	var x = (p.x-this.x);
	var y = (p.y-this.y);
	var indexy = Math.floor(y/BLOCK_SIZE);
	var indexx = Math.floor(x/BLOCK_SIZE);
	return [indexy, indexx];
  },
  
  pushcheck: function(p, line){
  	var indexy = -1;
    var indexx = -1;
    if (p.getPointing()) {
  		var x = (p.x-this.x);
        var y = (p.y-this.y);
        
        if(line.length==0){
            var indexy = Math.floor(y/BLOCK_SIZE);
  		    var indexx = Math.floor(x/BLOCK_SIZE);
        }
        else{
            var indexnow = [Math.floor(line[line.length-1]/100), line[line.length-1]%100];
            var nowy = (indexnow[0]+1/2)*BLOCK_SIZE;
            var nowx = (indexnow[1]+1/2)*BLOCK_SIZE;
              
            if(y-nowy > BLOCK_SIZE*1/2) indexy = indexnow[0]+1;
            else if(nowy-y > BLOCK_SIZE*1/2) indexy = indexnow[0]-1;
            else indexy = indexnow[0];
      		
            if(x-nowx > BLOCK_SIZE*1/2) indexx = indexnow[1]+1;
            else if(nowx-x > BLOCK_SIZE*1/2) indexx = indexnow[1]-1;
            else indexx = indexnow[1]; 
            
            if( (nowx-x < BLOCK_SIZE*3/4)&&(x-nowx < BLOCK_SIZE*3/4) && (nowy-y < BLOCK_SIZE*3/4)&&(y-nowy < BLOCK_SIZE*3/4) ){indexy=-1; indexx=-1;}
        }
  		
  		//animation
		this.effect.line = line;
		this.effect.pointx = x;
		this.effect.pointy = y;
		this.effect._dirtyDraw = true;
  	}
  	return [indexy, indexx];
  }
  
});

phina.define('FieldEffect', {
  superClass: 'Shape',
  init: function(map) {
	this.superInit();
	
	this.sizeY = map[0];
	this.sizeX = map[1];
	
	this.width = BLOCK_SIZE * this.sizeX;
	this.height = BLOCK_SIZE * this.sizeY;
	
	this.origin.set(0, 0);
	this.padding = 0;
	
	this.line = [];
	
	this.backgroundColor = 'black'//'black'//'#888';
	this.blendMode = 'lighter';
	
	this.stst = '#17916A'
	this.flst = '#000000'//'#888'//'#000000'
	this.pointx = 0;
	this.pointy = 0;
  },
  
  render: function(){
  	if(this.line.length>0){
	  	var c = this.canvas;
	  	c.strokeStyle = this.stst;
	  	c.fillStyle = this.flst;
	    c.lineWidth = 10;
	    
	    for(i=0; i<this.line.length; i++){
	    	if(this.line[i+1]) var ln = [(Math.floor(this.line[i]/100)-this.sizeY/2+1/2)*BLOCK_SIZE, (this.line[i]%100-this.sizeX/2+1/2)*BLOCK_SIZE, (Math.floor(this.line[i+1]/100)-this.sizeY/2+1/2)*BLOCK_SIZE, (this.line[i+1]%100-this.sizeX/2+1/2)*BLOCK_SIZE];
	    	else var ln = [(Math.floor(this.line[i]/100)-this.sizeY/2+1/2)*BLOCK_SIZE, (this.line[i]%100-this.sizeX/2+1/2)*BLOCK_SIZE, this.pointy-this.height/2, this.pointx-this.width/2];
			c.drawLine( ln[1], ln[0], ln[3], ln[2]);
			c.beginPath();
			c.arc(ln[1], ln[0], BLOCK_SIZE/2-10, 0, Math.PI*2, false)
			c.fill();
			c.stroke();
	    }
    }
  },
  
});

//数字
phina.define('Piece', {
  superClass: 'Sprite',

  init: function(option) {
    this.superInit('numbers', 80, 80);
    this.scaleX = 0.9;
    this.scaleY = 0.9;
    
    this.defaultx = this.x = option.x
    this.defaulty = this.y = option.y
    
    this.high = 0;
	
	this.interactive = true;
	this.checkHierarchy = true;
	
    this.index = option.index;
    this.frameIndex = -1;
    this.num = -1;
  },

  set: function(num) {
    if(num == -1) this.num = -1;
    else if(num >= 10){
    	this.frameIndex = 10;
    	this.num = 10;
    }
    else{
	    this.frameIndex = num;
	    this.num = num;
    }
  },
  
  anim: function(frm) {
  	this.frameIndex = this.num + 11*frm;
  	if(frm == 1)this.tweener.clear().to({y: (this.defaulty - 8 ) }, 100);
  	else this.tweener.clear().to({y: (this.defaulty) }, 100);
  },
  
  drop: function() {
    //this.tweener.clear().fromJSON(PIECE_APPEAR_ANIMATION);
    this.y = this.defaulty - this.high*BLOCK_SIZE;
    this.tweener.clear().to( {y:this.defaulty}, 100+25*this.high, "easeinQuad");
    this.high = 0;
  },
});


//時間のバー
phina.define('TimeBar', {
  superClass: 'DisplayElement',

  init: function(option) {
    this.superInit();
    this.height = BLOCK_SIZE / 4;
    this.width = SCREEN_WIDTH;
    
    this.setOrigin(0,0);
    
    this.x = 0;
    this.y = SCREEN_HEIGHT - BLOCK_SIZE/4;
    
    this.defwidth = SCREEN_WIDTH;
    
    this.bg = Shape().addChildTo(this).setPosition(0, 0).setOrigin(0,0);
    this.bg.padding = 0;
    this.bg.height = this.height;
    this.bg.width = this.width;
    this.bg.blendMode = 'multiply';
    this.bg.render = function(){
    	var c = this.canvas;
    	var bgimg = AssetManager.get('image', 'bar');
    	var bs = 20;
    	c.context.drawImage(bgimg.domElement, bs*4, 0, bs, bs, -this.width/2, -this.height/2, this.width, this.height);
    }
    this.bg.render();
    
    this.bar = Sprite('bar', 20, 20).addChildTo(this).setPosition(SCREEN_WIDTH, 0).setOrigin(1,0);
    this.bar.frameIndex = 3;
    
    this.frame = Shape().addChildTo(this).setPosition(0, 0).setOrigin(0,0);
    this.frame.padding = 0;
    this.frame.height = this.height;
    this.frame.width = this.width;
    
    this.frame.backgroundColor = 'transparent';
    this.frame.render = function(){
	  	var c = this.canvas;
	  	var tiles = AssetManager.get('image', 'bar');
	  	var bs = 20;
	  	
	  	c.context.drawImage(tiles.domElement, 0, 0, bs, bs, -this.width/2, -this.height/2, bs, bs);
	  	c.context.drawImage(tiles.domElement, bs, 0, bs, bs, bs-this.width/2, -this.height/2, this.width-bs*2, bs);
	  	c.context.drawImage(tiles.domElement, bs*2, 0, bs, bs, this.width/2-bs, -this.height/2, bs, bs);
	  	
  	}
  	this.frame.render();
    
    
  },

  upd: function(percent) {
    this.bar.width = this.defwidth*percent;
  },
  
});

//魔法
phina.define('MagicBomb', {
  superClass: 'Sprite',
  
  init: function(option) {
    this.superInit('magics', 80, 80);
    
    this.index = option.index;
    this.name = option.type;

    this.magic = myApp.Game.Magics[this.name];

    
    this.x = (this.index) * BLOCK_SIZE*2 + BLOCK_SIZE/2;
    this.y = SCREEN_HEIGHT - OFFSET_BTM +this.height/2;
    
    this.defx = this.x;
    this.defy = this.y;
	
	this.interactive = true;
	this.checkHierarchy = true;
	
    this.frameIndex = this.magic.image;
    this.isdragged = false;

  },
  
  actuate: function(scene){
  	if(this.x>scene.field.x && this.x<scene.field.x+scene.field.width){
  		if(this.y>scene.field.y && this.y<scene.field.y+scene.field.height){
		  	this.magic.effect(scene, {x:this.x, y:this.y});
		  	scene.time -= this.magic.tp*1000;
  	}}
  },
  
  drag: function(x,y){
  	this.x = x;
  	this.y = y;
  },
  
  
  
  
});

/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    startLabel: 'main',   // MainScene から開始
    width: SCREEN_WIDTH,  // 画面幅
    height: SCREEN_HEIGHT,// 画面高さ
    backgroundColor: '#467772',
    autoPause: true,
    assets: ASSETS,       // アセット読み込み
  });

  app.fps = 15;
  //app.enableStats();

  //document.body.appendChild(app.domElement);
  //作成したManagerSceneを使うにはこれが必要
  app.replaceScene(MainSequence());
  
  // 実行
  app.run();
});


// SceneSequenceクラス
phina.define("MainSequence", {
  superClass: "phina.game.ManagerScene",

  // 初期化
  init: function() {
    this.superInit({
      scenes: [

        {
          label: "Title", // ラベル。参照用
          className: "TitleScene", // シーンAのクラス名
          nextLabel: "Map" 
        },

        {
          label: "Map",
          className: "MapScene",
          nextLabel: "Stage" 
        },


		/*
        {
          label: "BeforeStage",
          className: "bStageScene",
          nextLabel: "Stage" 
        },
        */
        
        {
          label: "Stage",
          className: "StageScene",
          nextLabel: "AfterStage" 
        },
        
        {
          label: "AfterStage",
          className: "aStageScene",
          nextLabel: "Map" 
        },        
        
        
      ]
    });
  }
});


// その他の関数

//セーブ
function SaveData(){
	if(window.localStorage){
		var jsondata = JSON.stringify(myApp.User);
		window.localStorage.setItem("savedata" , jsondata);
	}
}

function LoadData(){
	if(window.localStorage){
		var loaddata = window.localStorage.getItem("savedata");
		var parsedata = JSON.parse(loaddata);
		
		if(myApp.User) return parsedata;
	}
	return null;
}


function StartGame(isload){
	myApp = {};
	myApp.Game = InitGame();
	myApp.User = InitUser();
	
	/*
	if(myApp.User==null){
		myApp.User = InitUser();
		SaveData();
	}*/
	
	StageInit();
	MagicInit();
	GemInit();
	
	MapInit();
	
	if(isload){
		var userdata = LoadData();
		if(userdata!= null) myApp.User = userdata;
	}
	SaveData();
	//ライフ回復
	//ほんとは時間を見て更新したい
	myApp.User.Life.num = MAXLIFE;
}

function InitGame(){
	var gamedata = { Stages:{}, Magics:{}, Gems:{}, Items:{} };
	return gamedata;
}

function InitUser(){
	var userdata = { Coin:0, Life:{}, Stages:{}, Magics:{}, myMagics:[], Gems:{}, Items:{} };
	//以下をあとで修正
	userdata.Life.num = MAXLIFE;
	userdata.Life.next = new Date();
	
	//テストのときだけね
	userdata.myMagics = ["clearall", "dltnum", "dltlineh", "addnum"];
	//userdata.Stages = {};
	
	return userdata;
}




//ライフ
function LoseLife(){
	if(myApp.User.Life.num == MAXLIFE) NextLife();
	myApp.User.Life.num -= 1;
}

function UpdateLife(){
	var date = new Date();
	if(date.getTime() > myApp.User.Life.next.getTime()){
		myApp.User.Life.num += 1;
		NextLife();
	}
}

function NextLife(){
	myApp.User.Life.next = new Date();
	myApp.User.Life.next.setMinutes(myApp.User.Life.next.getMinutes()+3);
}

