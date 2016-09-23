var Questions = {};

Questions["flat"] = function(nums, ope, txt){
    var obj = {};
    obj.eles = [];
    obj.ope = ope;
    obj.inpnums = [];
    obj.lensum = 0;
    obj.type = "flat";
    obj.text = txt;
    
    for(var i in nums){
    	
    	obj.eles[i] = function(input, i){
    		var sum = 0;
    		var a = 0;
    		for(var j in nums[i]){
    			if(nums[i][j] == -1){ sum += input[a]*Math.pow(10, nums[i].length-j-1); a++; }
    			else sum += nums[i][j]*Math.pow(10, nums[i].length-j-1);
    		}
    		return sum;
    	};
    	
    	obj.inpnums[i] = 0;
    	for(var j in nums[i]){
    		if(nums[i][j] == -1) {
    			obj.inpnums[i] += 1;
    		}
    	}
    	obj.lensum += obj.inpnums[i];
    	
    }
    
    obj.check = function(input){
        if(input.length>=this.lensum){
        	var inpind = 0;
            var eles = [];
            for(var i in this.eles){
            	eles.push(this.eles[i](input.slice(inpind, inpind + obj.inpnums[i]), i) );
            	inpind += obj.inpnums[i];
            }
            
            var res = ope(eles);
            if(res[0]) return [true, res[1], this.lensum, eles ];
        }
        return [false, 0, 0, [] ];
    };

    return obj;
};


// [ [1,2,3], [4,5,6], function(b){return b[1]-b[0]} ] B+B=B
function PickRand(eles){
	return eles[Math.floor( Math.random() * eles.length ) ];
}

Gen = {};

Gen["B+B=B"] = function(e1,e3){
	var b1 = PickRand(e1);
	var b3 = PickRand(e3);
	return [b1, (b3-b1), b3];
}





Questions["pow"] = function(len){
    var obj = {};
    obj.lensum = len[0]+len[1]+len[2];
    obj.len1 = len[0];
    obj.len2 = len[1];
    obj.len3 = len[2];
    obj.type = "pow";
    
    obj.text = "";
    for(var i = 0; i < len[0]; i++)obj.text += "□";
    obj.text += "^";
    for(var i = 0; i < len[1]; i++)obj.text += "□";
    obj.text += "＝";
    for(var i = 0; i < len[2]; i++)obj.text += "□";
    
    obj.check = function(inp){
        if(inp.length>=this.lensum){
            var left1 = 0
            var left2 = 0
            var right = 0;
            for(var i = 0; i < this.len1; i++)left1 += inp[i]*Math.pow(10, this.len1-i-1);
            for(var i = 0; i < this.len2; i++)left2 += inp[i+this.len1]*Math.pow(10, this.len2-i-1);
            for(var i = 0; i < this.len3; i++)right += inp[i+this.len1+this.len2]*Math.pow(10, this.len3-i-1);
            
            if(Math.pow(left1,left2)==right) return [true, right*10, this.lensum, [left1, left2, right] ];
        }
        return [false, 0, 0, [] ];
    };

    return obj;
};


var Missions = {};

Missions["stone"] = function(goal){
    var obj = {};
    obj.name = "stone";
    obj.title = "魔法石を消す";
    obj.goal = goal;
    obj.bonus = 1;
    
    obj.init = function(state){
    	//if(state[this.name]) state[this.name] -= obj.goal;
    	//else 
    	state[this.name] = 0;
    };
    obj.check = function(temp, state){
    	state[this.name] += temp[this.name];
    	return temp[this.name] * this.bonus;
    };
    
    obj.achieved = function(state){
        if(this.goal <= state[this.name]) return true;
        else return false;
    };
    
    obj.remove = function(state){
    	state[this.name] -= this.goal;
    }
    
    return obj;
};

Missions["fill"] = function(goal, bonus){
	var obj = {};
	obj.type = goal[0];
	obj.nums = goal[1];
	obj.goal = goal[2];
	obj.name = "F_"+goal[3];
	obj.title = goal[0];
	obj.bonus = bonus;
	
	obj.init = function(state){
		//if (state[this.name]) state[this.name] -= this.goal;
		//else 
		state[this.name] = 0;
	}
	
	obj.check = function(temp, state){
		c = true;
		for(var tp in temp.fill){
			for(var i in this.nums)c = c && (this.nums[i]==-1 || this.nums[i]==temp.fill[tp][i]);
			if(c){
				state[this.name] += 1;
				return this.bonus;
			}
		}
		return 0;
	};
	
	obj.achieved = function(state){
		if(state[this.name] >= this.goal) return true;
		else return false;
	};
	
	return obj;
};

Missions["more"] = function(goal, bonus){
	var obj = {};
	obj.type = goal[0];
	obj.num = goal[1];
	obj.goal = goal[2];
	obj.name = "M_"+goal[3];
	obj.title = goal[0];
	obj.bonus = bonus;
	
	obj.init = function(state){
		//if (state[this.name]) state[this.name] -= this.goal;
		//else 
		state[this.name] = 0;
	}
	
	obj.check = function(temp, state){
		c = true;
		for(var tp in temp.more){
			if(temp.more >= this.num) {
				state[this.name] += 1;
				return this.bonus;
			}
		}
		return 0;
	};
	
	obj.achieved = function(state){
		if(state[this.name] >= this.goal) return true;
		else return false;
	};
	
	return obj;
};

Missions["tile"] = function(){
	
};




/*
Gamedata -> Stages, Magics, Gems, Items(clear & goods), 
Userdata -> stages, coin, magics, gems, items, life, 
*/


var Stages = {};

//StageLock
function StageData(option){
	//stagedata
	var obj = {};
	for(var key in option){
		obj[key] = option[key];
	}
	
	//cleardata
	var obj2 = {};
	obj2.name = option.name;
	obj2.index = option.index;
	obj2.rank = 0; //rank-1: locked, rank0: unlocked, rank1,2,3...
	obj2.highscore = 0;
	
	
	//構成
	//stage
	if(!myApp.Game.Stages[obj.index]) myApp.Game.Stages[obj.index] = {};
	myApp.Game.Stages[obj.index][obj.name] = obj;
	//cleardata
	if(!myApp.User.Stages[obj2.index]) myApp.User.Stages[obj2.index] = {};
	myApp.User.Stages[obj2.index][obj2.name] = obj2;
	
};







function StageInit(){
	
	//ADD
	StageData({
		index:"ADD",
		name: "basic",
		piece: [0,1,2,2,1,1,1,0,0,0 ,1],
		questions: [ Questions.flat([[-1],[-1],[-1]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□＋□＝□")],
		missions: { quota:[Missions.stone(5)], gemA:[Missions.fill(["△+△=6をつくる", [-1,-1,6], 6, "e6"], 2)] },
		missionrate: ["gemA"],
		map:[6,6],
		time:60,
		fullscore:1000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"1桁の足し算",
		hint: ""
	});
	
	StageData({
		index:"ADD",
		name: "basic2",
		piece: [1,3,1,1,1,1,1,1,1,1 ,1],
		questions: [ Questions.flat([[-1],[-1],[-1]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□＋□＝□"),
			Questions.flat([[-1],[-1],[-1,-1]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□＋□＝□□")],
		missions: { quota:[Missions.stone(5)], gemA:[Missions.more(["△+△≧11", 11, 6, "11"], 2)] },
		missionrate: ["gemA"],
		map:[7,7],
		time:60,
		fullscore:1000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"1桁の足し算",
		hint: ""
	});
	
	StageData({
		index:"ADD",
		name: "make10",
		piece: [0,1,2,2,2,1,1,1,1,1 ,1],
		questions: [ Questions.flat([[-1],[-1],[1,0]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□＋□＝10"),
			Questions.flat([[-1],[-1],[-1],[1,0]], function(b){return [b[0]+b[1]+b[2]==b[3], b[3]];}, "□＋□＋□＝10")
		],
		missions: { quota:[Missions.stone(5)], gemA:[Missions.stone(10)] },
		missionrate: ["gemA"],
		map:[6,6],
		time:60,
		fullscore:2000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"□+□=10 の□を埋める",
		hint: " 1+9=10 \n 2+8=10 \n 3+7=10 \n 4+6=10 \n 5+5=10 "
	});
	
	StageData({
		index:"ADD",
		name: "make30",
		piece: [1,3,2,1,1,1,1,1,1,1 ,1],
		questions:[ Questions.flat([[-1,-1],[-1,-1],[3,0]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□□＋□□＝30"),
			Questions.flat([[-1,-1],[-1],[3,0]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□□＋□＝30"),
			Questions.flat([[-1],[-1,-1],[3,0]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□＋□□＝30")
		],
		missions: { quota:[Missions.stone(5)], gemB:[Missions.stone(10)], gemA:[Missions.stone(10)] },
		missionrate: ["gemA", "gemB"],
		map:[7,7],
		time:60,
		fullscore:2000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"数字を足して30を作る",
		hint: ""
	});
	
	StageData({
		index:"ADD",
		name: "make100",
		piece: [1,1,1,1,1,1,1,1,1,1 ,1],
		questions:[ Questions.flat([[-1,-1],[-1,-1],[1,0,0]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□□＋□□＝100"),
			Questions.flat([[-1,-1],[-1],[1,0,0]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□□＋□＝100"),
			Questions.flat([[-1],[-1,-1],[1,0,0]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□＋□□＝100")
		],
		missions: { quota:[Missions.stone(5)], gemC:[Missions.stone(10)], gemB:[Missions.stone(10)] },
		missionrate: ["gemB", "gemC"],
		map:[8,8],
		time:80,
		fullscore:6000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"数字を足して100を作る",
		hint: ""
	});
	
	StageData({
		index:"ADD",
		name: "add3",
		piece: [1,1,1,1,1,1,1,1,1,1 ,1],
		questions:[ Questions.flat([[-1],[-1],[-1],[-1]], function(b){return [b[0]+b[1]+b[2]==b[3], b[3]];}, "□＋□＋□＝□"),
			Questions.flat([[-1],[-1],[-1],[-1,-1]], function(b){return [b[0]+b[1]+b[2]==b[3], b[3]];}, "□＋□＋□＝□□")
		],
		missions: { quota:[Missions.stone(10)], gemB:[Missions.stone(10)], gemA:[Missions.stone(10)] },
		missionrate: ["gemA", "gemB"],
		map:[8,8],
		time:60,
		fullscore:1000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"",
		hint: ""
	});
	
	StageData({
		index:"ADD",
		name: "ad22",
		piece: [1,3,1,1,1,1,1,1,1,1 ,1],
		questions: [ Questions.flat([[-1,-1],[-1,-1],[-1,-1]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□□＋□□＝□□"),
			Questions.flat([[-1,-1],[-1,-1],[-1,-1,-1]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□□＋□□＝□□□")],
		missions: { quota:[Missions.stone(5)], gemA:[Missions.fill(["≧100", 100, 5, "100"], 2)] },
		missionrate: ["gemA"],
		map:[8,8],
		time:60,
		fullscore:1000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"2桁の足し算",
		hint: ""
	});
	
	//MIX
	StageData({
		index:"MIX",
		name: "add_mult",
		piece: [1,1,1,1,1,1,1,1,1,1 ,1],
		questions:[ Questions.flat([[-1],[-1],[-1],[-1,-1]], function(b){return [b[0]+b[1]*b[2]==b[3], b[3]];}, "□＋□×□＝□□") ],
		missions: { quota:[Missions.stone(5)], gemC:[Missions.stone(10)], gemD:[Missions.stone(10)], gemB:[Missions.stone(10)] },
		missionrate: ["gemD", "gemB", "gemC"],
		map:[8,8],
		time:90,
		fullscore:1000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"",
		hint: ""
	});
	
	StageData({
		index:"MIX",
		name: "add_mult2",
		piece: [1,1,1,1,1,1,1,1,1,1 ,1],
		questions:[ Questions.flat([[-1],[-1],[-1],[-1,-1]], function(b){return [(b[0]+b[1])*b[2]==b[3], b[3]];}, "(□＋□)×□＝□□"),
			Questions.flat([[-1],[-1],[-1],[-1,-1,-1]], function(b){return [(b[0]+b[1])*b[2]==b[3], b[3]];}, "(□＋□)×□＝□□□") ],
		missions: { quota:[Missions.stone(5)], gemC:[Missions.stone(10)], gemD:[Missions.stone(10)], gemB:[Missions.stone(10)] },
		missionrate: ["gemD", "gemB", "gemC"],
		map:[8,8],
		time:90,
		fullscore:1000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"",
		hint: ""
	});
	
	StageData({
		index:"MIX",
		name: "add_sub",
		piece: [1,1,1,1,1,1,1,1,1,1 ,1],
		questions:[ Questions.flat([[-1],[-1],[-1],[-1]], function(b){return [b[0]+b[1]-b[2]==b[3],b[0]+b[1]];}, "□＋□-□＝□") ],
		missions: { quota:[Missions.stone(5)], gemC:[Missions.stone(10)], gemD:[Missions.stone(10)], gemB:[Missions.stone(10)] },
		missionrate: ["gemD", "gemB", "gemC"],
		map:[8,8],
		time:90,
		fullscore:600,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"",
		hint: ""
	});
	
	//MULT
	
	StageData({
		index:"MULT",
		name: "basic",
		piece: [0,1,2,2,2,0,1,0,1,1 ,1],
		questions:[  Questions.flat([[-1],[-1],[-1]], function(b){return [b[0]*b[1]==b[2], b[2]];}, "□×□＝□"),
			Questions.flat([[-1],[-1],[-1,-1]], function(b){return [b[0]*b[1]==b[2], b[2]];}, "□×□＝□□") ],
		missions: { quota:[Missions.stone(10)], gemB:[Missions.stone(10)] },
		missionrate: ["gemB"],
		map:[6,6],
		time:60,
		fullscore:2000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"",
		hint: ""
	});
	
	StageData({
		index:"MULT",
		name: "basic2",
		piece: [1,1,1,1,1,1,1,1,1,1 ,1],
		questions:[  Questions.flat([[-1],[-1],[-1]], function(b){return [b[0]*b[1]==b[2], b[2]];}, "□×□＝□"),
			Questions.flat([[-1],[-1],[-1,-1]], function(b){return [b[0]*b[1]==b[2], b[2]];}, "□×□＝□□") ],
		missions: { quota:[Missions.stone(10)], gemB:[Missions.stone(10)] },
		missionrate: ["gemB"],
		map:[8,8],
		time:60,
		fullscore:2000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"",
		hint: ""
	});
	
	StageData({
		index:"MULT",
		name: "mult3",
		piece: [1,2,2,2,2,2,1,1,1,1 ,1],
		questions:[  Questions.flat([[-1],[-1],[-1],[-1]], function(b){return [b[0]*b[1]*b[2]==b[3], b[3]];}, "□×□×□＝□"),
			Questions.flat([[-1],[-1],[-1],[-1,-1]], function(b){return [b[0]*b[1]*b[2]==b[3], b[3]];}, "□×□×□＝□□"), 
			Questions.flat([[-1],[-1],[-1],[-1,-1,-1]], function(b){return [b[0]*b[1]*b[2]==b[3], b[3]];}, "□×□×□＝□□□") ],
		missions: { quota:[Missions.stone(10)], gemB:[Missions.stone(10)] },
		missionrate: ["gemB"],
		map:[8,8],
		time:90,
		fullscore:3000,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"",
		hint: ""
	});

	StageData({
		index:"ADD",
		name: "simple0",
		piece: [0,4,3,2,0,0,0,0,0,0 ,1],
		questions:[  Questions.flat([[-1],[-1],[-1]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□+□＝□") ],
		missions: { quota:[Missions.stone(10)], gemB:[Missions.stone(10)] },
		missionrate: ["gemB"],
		map:[6,6],
		time:90,
		fullscore:300,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"",
		hint: ""
	});
	
	StageData({
		index:"ADD",
		name: "simple1",
		piece: [0,3,2,2,1,1,0,0,0,0 ,1],
		questions:[  Questions.flat([[-1],[-1],[-1]], function(b){return [b[0]+b[1]==b[2], b[2]];}, "□+□＝□") ],
		missions: { quota:[Missions.stone(10)], gemB:[Missions.stone(10)] },
		missionrate: ["gemB"],
		map:[6,7],
		time:90,
		fullscore:500,
		unlocked:true,
		unlockkey:function(){return true;},
		disc:"",
		hint: ""
	});
	
	
}




function MapInit(){
	myApp.Game.Map = {};
	myApp.Game.Map.size = [10,10];
	myApp.Game.Map.stages = [];
	
	myApp.Game.Map.stages.push( { position:[2,1], pointer:["ADD", "basic"] } );
	myApp.Game.Map.stages.push( { position:[3.2,1], pointer:["ADD", "basic2"] } );
	myApp.Game.Map.stages.push( { position:[4.4,1], pointer:["ADD", "make10"] } );
	myApp.Game.Map.stages.push( { position:[5.6,1], pointer:["ADD", "make30"] } );
	myApp.Game.Map.stages.push( { position:[6.8,1], pointer:["ADD", "make100"] } );
	
	
	myApp.Game.Map.stages.push( { position:[2,3], pointer:["MULT", "basic"] } );
	myApp.Game.Map.stages.push( { position:[3.2,3], pointer:["MULT", "basic2"] } );
	myApp.Game.Map.stages.push( { position:[4.4,3], pointer:["MULT", "mult3"] } );
	myApp.Game.Map.stages.push( { position:[5.6,3], pointer:["MIX", "add_mult"] } );
	myApp.Game.Map.stages.push( { position:[6.8,3], pointer:["MIX", "add_mult2"] } );
	myApp.Game.Map.stages.push( { position:[8,3], pointer:["MIX", "add_sub"] } );
	
	myApp.Game.Map.stages.push( { position:[2,5], pointer:["ADD", "simple0"] } );
	myApp.Game.Map.stages.push( { position:[3.2,5], pointer:["ADD", "simple1"] } );
	/*myApp.Game.Map.stages.push( { position:[4.4,5], pointer:["MULT10", "13"] } );
	myApp.Game.Map.stages.push( { position:[5.6,5], pointer:["MULT10", "14"] } );
	myApp.Game.Map.stages.push( { position:[6.8,5], pointer:["MULT10", "15"] } );

	myApp.Game.Map.stages.push( { position:[2,7], pointer:["MULT10", "16"] } );
	myApp.Game.Map.stages.push( { position:[3.2,7], pointer:["MULT10", "17"] } );
	myApp.Game.Map.stages.push( { position:[4.4,7], pointer:["MULT10", "18"] } );
	myApp.Game.Map.stages.push( { position:[5.6,7], pointer:["MULT10", "19"] } );
	myApp.Game.Map.stages.push( { position:[6.8,7], pointer:["MULT10", "final"] } );

	myApp.Game.Map.stages.push( { position:[2,9], pointer:["POW", "basic"] } );
	myApp.Game.Map.stages.push( { position:[3.2,9], pointer:["POW", "basic2"] } );
	myApp.Game.Map.stages.push( { position:[4.4,9], pointer:["POW", "pow2"] } );
	*/
}

