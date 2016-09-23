
function MagicData(option){
	var obj = {};
	//このくだりいるのか？
	for(var key in option){
		obj[key] = option[key];
	}
	
	var obj2 = {};
	obj2.name = option.name;
	obj2.unlocked = false;
	
	
	myApp.Game.Magics[obj.name] = obj;
	myApp.User.Magics[obj2.name] = obj2;
}

function MagicInit(){
	var Magics = {};
	
	Magics["clearall"] = {
		image: 0,
		name: "clearall",
		title: "全消し",
		tp: 20,
		effect: function(scene, p){
			var map = scene.field.map;
			for(var i in map) for(var j in map[i]) map[i][j]=-1;
			scene.dropMap();
		},
	};

	Magics["dltnum"] = {
		image: 1,
		name: "dltnum",
		title: "数字消し",
		tp: 15,
		effect: function(scene, p){
			var map = scene.field.map;
			var index = scene.field.getposition(p);
			var num = map[index[0]][index[1]];
			for(var i in map) for(var j in map[i]) if(map[i][j]==num)map[i][j]=-1;
			scene.dropMap();
		},
	};

	Magics["dltlineh"] = {
		image: 2,
		name: "dltlineh",
		title: "横消し",
		tp: 10,
		effect: function(scene, p){
			var map = scene.field.map;
			var index = scene.field.getposition(p);
			for(var j in map[index[0]])map[index[0]][j]=-1;
			scene.dropMap();
		},
	};

	Magics["dltpoint"] = {
		image: 3,
		name: "dltpoint",
		title: "ピンポイント",
		tp: 5,
		effect: function(scene, p){
			var map = scene.field.map;
			var index = scene.field.getposition(p);
			map[index[0]][index[1]]=-1;
			scene.dropMap();
		},
	};

	Magics["addnum"] = {
		image: 4,
		name: "addnum",
		title: "増殖",
		tp: 15,
		effect: function(scene, p){
			var map = scene.field.map;
			var index = scene.field.getposition(p);
			var num = map[index[0]][index[1]];
			
			for(var i=0; i<8; i++){
 				map[Math.floor(Math.random() * map.length)][Math.floor(Math.random() * map[0].length)] = num; }
			scene.dropMap();
		},
	};
	
	
	for(var ele in Magics) MagicData(Magics[ele]);

}




//Bombs = {};



//GEMS
function GemData(option){
	var obj = {};
	//このくだりいるのか？
	for(var key in option){
		obj[key] = option[key];
	}
	
	var obj2 = {};
	obj2.name = option.name;
	obj2.num = 0;
	obj2.unlocked = false;
	
	
	
	myApp.Game.Gems[obj.name] = obj;
	myApp.User.Gems[obj2.name] = obj2;
}


function GemInit(){
	GemData({
		name:"stone",
		title:"魔法石",
		image:-1,
		recipe: null,
		stone: 0,
		coin: 1,
		
	});
	
	GemData({
		name:"gemA",
		title:"リンゴキャンディ",
		image:0,
		recipe: {},
		stone: 50,
		coin: 100,
		
	});
	
	GemData({
		name:"gemB",
		title:"レモンキャンディ",
		image:1,
		recipe: null,
		stone: 0,
		coin: 150,
		
	});
	
	GemData({
		name:"gemC",
		title:"ミカンキャンディ",
		recipe: null,
		image:2,
		stone: 0,
		coin: 200,
		
	});
	
	GemData({
		name:"gemD",
		title:"イチゴキャンディ",
		recipe: null,
		image:3,
		stone: 0,
		coin: 250,
		
	});
	
	GemData({
		name:"gemE",
		title:"アンズキャンディ",
		recipe: null,
		image:4,
		stone: 0,
		coin: 300,
		
	});
	
	GemData({
		name:"clover",
		title:"クローバードロップ",
		recipe: {gemA:2, gemB:1},
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"spade",
		title:"スペードドロップ",
		recipe: {gemA:2, gemB:1},
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"heart",
		title:"ハートドロップ",
		recipe: {gemA:2, gemB:1},
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"diamond",
		title:"ダイヤドロップ",
		recipe: {gemA:2, gemB:1},
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"candy",
		title:"アメ水晶",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"sugar",
		title:"砂糖石",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"cat",
		title:"猫水晶",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"magaA",
		title:"縞勾玉",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"magaB",
		title:"水玉勾玉",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"amber",
		title:"青コハク",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"orion",
		title:"オリオン氷",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"star",
		title:"星",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"sun",
		title:"太陽",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"sakura",
		title:"露さくら",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"momiji",
		title:"露もみじ",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	
	GemData({
		name:"kurage",
		title:"虹くらげ",
		recipe: null,
		stone: 100,
		coin: 1000,
	});
	

	// アメ水晶、虹くらげ、月、ハート石、涙、星、銀河、天の川、花、梅？サクラ？、鏡、縞、水玉、
	// 杏子石 苺石 砂糖石 鈴 卵 雨
}

