var THREE = require('three');
var cannon = require('cannon')
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res){
  res.render('/index.html');
});
 
server.listen(8100);
console.log("Multiplayer app listening on port 8100");
var logReset = 0;



function gameServer() {
  this.border = { // Vanilla border values are - top: 0, left: 0, right: 111180.3398875, bottom: 11180.3398875,
    xMin: -500, // Backwards/Forwards
    xMax: 500, // Backwards/Forwards
    yMin: -500, // Left/Right
    yMax: 500, // Left/Right
		zMin: -10, // Up/Down
		zMax: 10 // Up/Down
  }; // Foward: X increases, Right: Y increases, Up: Z decreases
	//      | Z
	//      |______    inside of corner of cube
	//     /      X
	//    / Y
  this.clients = [];
  this.nodes = [];
  this.locations = {};
  this.map = [];
  this.loc = {
    clients: {},
    nodes: {}
  };
  this.lastId = 0;
  this.config = {
  };
	this.t = {};
	this.t.scene = new THREE.Scene();
	this.c = {};
	this.c.pw = new CANNON.World();
		this.c.objects = [];
		this.c.pw.gravity.set(0, 0, -9.82);
		this.c.pw.broadphase = new CANNON.NaiveBroadphase();
		//this.c.pw.broadphase = new CANNON.SAPBroadphase(this.c.pw);
		this.c.pw.solver.iterations = 10;
		this.c.pw.defaultContactMaterial.friction = 1;
	//this.t.renderer = new THREE.WebGLRenderer();
  //this.t.renderer.setSize( this.width, this.height );
}


gameServer.prototype.getNextId = function() {
  if (this.lastId > 2147483647) {
    this.lastId = 1;
  }
  return this.lastId++;
};

gameServer.prototype.getRandPos = function() {
  return {
    x: Math.floor(Math.random() * (this.border.xMax - this.border.xMin)) + this.border.xMin,
    y: Math.floor(Math.random() * (this.border.yMax - this.border.yMin)) + this.border.yMin,
		z: Math.floor(Math.random() * (this.border.zMax - this.border.zMin)) + this.border.zMin
  };
};

gameServer.prototype.initScene = function() {
	var geometry = new THREE.BoxGeometry( 30, 0.1, 30 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	var platform = new THREE.Mesh( geometry, material );
	this.t.scene.add( platform );
};

gameServer.prototype.addPlayer = function() {
	//geometry = new THREE.BoxGeometry( 1, 1, 1 );
	//material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	//var cube = new THREE.Mesh( geometry, material );
	//this.t.scene.add( cube );
	//cube.position.y = 3;
};




function node(type, owner) {
		this.type = type;
    if(owner) {
			this.owner = owner;
      this.socketId = this.owner.socketId;        
    }
    //this.nodeId = nodeId;
    //this.owner = owner; // playerTracker that owns this cell
    this.color = {r: 0, g: 0, b: 255};
    this.size = 0; // Radius of the cell - Depreciated, use getSize() instead
    //this.mass = mass; // Starting mass of the cell
    this.speed = 30; // Filler, will be changed later
	
		this.position = new THREE.Vector3();
		this.rotation = function() {
			return {x: this.tObject.rotation.x, y: this.tObject.rotation.y, z: this.tObject.rotation.z, xRotation: this.input.rotation.x, yRotation: this.input.rotation.y};
		};
		this.quaternion = function() {
			return this.tObject.quaternion;
		};
	
		this.input = {};
		this.input.rotation = {};
		this.input.rotation.x = 0;
		this.input.rotation.y = 0;
		
	
		//create object
		//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
		//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		//this.tObject = new THREE.Mesh( geometry, material );
		this.tObject = new THREE.Object3D();
		this.tObject.position.x = 0;
		this.tObject.position.y = 0;
		this.tObject.position.z = 0;
	
		this.tObject.rotation.x = 0;
		this.tObject.rotation.y = 0;
		this.tObject.rotation.z = 0;
		gs.t.scene.add(this.tObject);
}

node.prototype.viewObj = function() {
  return {
		type: this.type,
    position: this.tObject.position,
		rotation: this.rotation(),
    size: this.size,
    mass: this.mass,
    speed: this.speed,
    nodeId: this.nodeId,
    username: this.owner.username
  };
};



node.prototype.collisionCheck = function(xMin, xMax, yMin, yMax, zMin, zMax) {
	// Collision checking
	if (this.tObject.position.x < xMin) {
		return false;
	}
	if (this.tObject.position.x > xMax) {
		return false;
	}
	if (this.tObject.position.y < yMin) {
		return false;
	}
	if (this.tObject.position.y > yMax) {
		return false;
	}
	if (this.tObject.position.z < zMin) {
		return false;
	}
	if (this.tObject.position.z > zMax) {
		return false;
	}
	return true;
};

node.prototype.move = function() {
  var keys = this.owner.keys;
  if(typeof keys !== "undefined") {
    var tspd = 0.1;
    if(keys.indexOf("w") > -1) {
      //gs.nodes[this.nodeId].pos.y -= spd;
      //this.tObject.translateZ(-1*tspd);
    }
    if(keys.indexOf("a") > -1) {
      //gs.nodes[this.nodeId].pos.x -= spd;
      //this.tObject.translateX(-1*tspd);
    }
    if(keys.indexOf("s") > -1) {
      //gs.nodes[this.nodeId].pos.y += spd;
      //this.tObject.translateZ(tspd);
    }
    if(keys.indexOf("d") > -1) {
      //gs.nodes[this.nodeId].pos.x += spd;
      //this.tObject.translateX(tspd);
    }
		
		var rspd = 0.015;
    if(keys.indexOf("left") > -1) {
      //this.input.rotation.y += rspd;
    }
    if(keys.indexOf("right") > -1) {
      //this.input.rotation.y -= rspd;
    }
    if(keys.indexOf("up") > -1) {
      //this.input.rotation.x -= rspd;
    }
    if(keys.indexOf("down") > -1) {
      //this.input.rotation.x += rspd;
    }
		
    var euler = new THREE.Euler( 0, 0, 0, 'YXZ' );
  	euler.x = this.input.rotation.x;
  	euler.y = this.input.rotation.y;
  	this.tObject.quaternion.setFromEuler( euler );
		
		/*if(logReset === 0) {
			console.log(this.tObject.position);
		}*/
		
		
    //console.log("x: " + gs.nodes[this.nodeId].pos.x);
    //console.log("y: " + gs.nodes[this.nodeId].pos.y);
  }
};













function playerTracker(id) {
  this.isOnline = false;
  this.username = "";
  this.socketId = id;
  this.visibleNodes = [];
  this.nodes = [];
  this.keys = [];
  this.score = 0;

  this.mouseX = 0;
  this.mouseY = 0;
  //this.tickLeaderboard = 0;
  //this.team = 0;
  
  // Viewing box
  this.sightRange = 1200; //change sightrange later should be 0 at start
  this.centerPos = {
		x: 0,
		y: 0,
		z: 0
  };
  this.viewBox = {
    xMin: 0, // Left/Right
    xMax: 0, // Left/Right
    yMin: 0, // Up/Down
    yMax: 0, // Up/Down
		zMin: 0, // Backwards/Forwards
		zMax: 0 // Backwards/Forwards
		//topY: 0,
		//bottomY: 0,
		//leftX: 0,
		//rightX: 0
  };
}



playerTracker.prototype.update = function() {
    // Update and destroy nodes (Obsolete)
    /*for (var i = 0; i < this.nodeDestroyQueue.length; i++) {
        var index = this.visibleNodes.indexOf(this.nodeDestroyQueue[i]);
        if (index > -1) {
            this.visibleNodes.splice(index, 1);
        } else {
            this.nodeDestroyQueue.splice(i,1);
            //console.log("Warning: Node in destroy queue was never visible anyways!");
        }
    }*/
    
    
    
    // Get visible nodes
		this.previouslyVisibleNodes = this.visibleNodes;
    this.visibleNodes = this.calcViewBox();
	
		if(logReset === 0) {
			//console.log(this.visibleNodes);
		}
		//if(this.previouslyVisibleNodes !==)
	
    //console.log(this.visibleNodes);
    /*if(this.visibleNodes.length > 0) {
      //console.log("players found: " + this.visibleNodes.length);
      if(this.visibleNodes.length > 1) {
        var p1 = this.visibleNodes[0];
        var p2 = this.visibleNodes[1];
        var d1 = Math.pow(p1.pos.x-p2.pos.x, 2);
        var d2 = Math.pow(p1.pos.y-p2.pos.y, 2);
        var d3 = Math.sqrt(d1 + d2);
        console.log("distance: " + d3);
      }
      
      
    } else {
      //console.log("no players found");
    }*/
    
    //setTimeout(function() {
      io.to(this.socketId).emit('visibleNodes', {vn: this.visibleNodes});
    //}, 100);
    
    //console.log(this.visibleNodes);
    
    //io.to(this.socketId).emit('test', {test: 'test'});
    
    
    // Send packet
    //this.socket.sendPacket(new Packet.UpdateNodes(this.nodeDestroyQueue.slice(0), this.visibleNodes));

    //this.nodeDestroyQueue = []; // Reset destroy queue

    // Update leaderboard
    /*if (this.tickLeaderboard <= 0) {
        this.socket.sendPacket(new Packet.UpdateLeaderboard(this.gameServer.leaderboard,this.gameServer.getGameType()));
        this.tickLeaderboard = this.gameServer.config.leaderboardUpdateClient;
    } else {
        this.tickLeaderboard--;
    }*/
};

playerTracker.prototype.calcViewBox = function() {
  //change range later
	
	//this.updateSightRange();
	//this.updateCenter();
	
	// Box
	/*this.viewBox.topY = this.centerPos.y - this.sightRange;
	this.viewBox.bottomY = this.centerPos.y + this.sightRange;
	
	this.viewBox.leftX = this.centerPos.x - this.sightRange;
	this.viewBox.rightX = this.centerPos.x + this.sightRange;*/
	
	this.viewBox.xMin = this.centerPos.x - this.sightRange;
	this.viewBox.xMax = this.centerPos.x + this.sightRange;
	this.viewBox.yMin = this.centerPos.y - this.sightRange;
	this.viewBox.yMax = this.centerPos.y + this.sightRange;
	this.viewBox.zMin = this.centerPos.z - this.sightRange;
	this.viewBox.zMax = this.centerPos.z + this.sightRange;
	
	var newVisible = [];
	for (var i = 0; i < gs.nodes.length; i++) {
		//node1 = gs.nodes[i];
		if(typeof gs.clients[gs.nodes[i].id] == "undefined") {
			delete gs.clients[gs.nodes[i].id];
			continue;
		}
    var clnodes = gs.clients[gs.nodes[i].id].nodes;
		node1 = clnodes[gs.nodes[i].clapos];
		
		//if(!node1) {
			//continue;
		//}
		
		
		if (node1.collisionCheck(this.viewBox.xMin, this.viewBox.xMax, this.viewBox.yMin, this.viewBox.yMax, this.viewBox.zMin, this.viewBox.zMax)) {
			// Cell is in range of viewBox
			newVisible.push(node1.viewObj());
		}
  }
	return newVisible;
};







//io.sockets.socket(savedsocketId).emit(...)
//better: io.to(socketId).emit('message', 'for your eyes only');


var gameServer1 = new gameServer();
var gs = gameServer1;

io.on('connection', function (socket) {
  
  var newClient = new playerTracker(socket.id);
  //gs.clients.push(newClient);
	
	gs.clients[socket.id] = newClient;
	gs.map.push(socket.id);
  
  //gs.map[socket.id] = gs.clients[gs.clients.length-1];
  
  //var newloc = {client: gs.clients.length-1, nodes: []};
  //gs.locations[socket.id] = gs.clients.length-1;//newloc;
  
  //gs.locations[socket.id] = gs.clients.length-1;
  //console.log(gs.locations);
  
  //gs.clients[socket.id] = newClient;
  console.log("connected id: " + socket.id);
	console.log("gs.map.length: " + gs.map.length);
  console.log("gs.clients.length: " + gs.clients.length);
  
  //socket.emit('clientId', {id: gs.getNextId() });
  
  socket.on('disconnect', function() {
    var i;
		//socket.broadcast.emit('disc', {nodes: gs.clients[socket.id].nodes});
		delete gs.clients[socket.id];
		gs.map.splice(gs.map.indexOf(socket.id), 1);
		
		console.log("disconnected id: " + socket.id);
		console.log("gs.nodes.length: " + gs.nodes.length);
		console.log("gs.map.length: " + gs.map.length);
		console.log("gs.clients.length: " + gs.clients.length);
  });
  
  //socket.emit('userdata', { hello: 'world' });
  socket.on('addUser', function(data) {
    //var cloc = gs.clients.map(function(x) {return x.socketId; }).indexOf(socket.id);
    //var cloc = gs.clients.filter(function(x){return x.socketId === socket.id});
    
    //var cloc = gs.locations[socket.id].client;
		//var cloc = gs.map[]
    gs.clients[socket.id].username = data.username;
    gs.clients[socket.id].isOnline = true;
    
    //var pos = {x:gs.getRandPos().x, y:gs.getRandPos().y, z:gs.getRandPos().z};
		//var pos = {x:0, y:0, z:0};
    
    //var newNode = new node(gs.getNextId(), gs.clients[loc], pos, 20);
    //var newNode = new node(gs.nodes.length, gs.clients[cloc], pos, 20);
    //gs.locations[socket.id].nodes.push(gs.nodes.length);
		
		var newNode = new node("player", gs.clients[socket.id]);
    
    gs.clients[socket.id].nodes.push(newNode);
		var npos = {id: socket.id, clapos: gs.clients[socket.id].nodes.length-1};
    gs.nodes.push(npos);
    //gs.nodes[gs.nodes.length] = gs.clients[loc].nodes[gs.clients[loc].nodes.length-1];
    
    //gs.nodes.push(newNode);
    
    //var pos = gs.getRandPos();
    socket.emit('initData',{
			glength: gs.border.zMax,
      gwidth: gs.border.xMax,
      gheight: gs.border.yMax,
      username: data.username,
      x: 0,//gs.clients[socket.id].nodes[npos.clapos].position.z
      y: 0,
			z: 0
    });
    
  });
  
  
  
  socket.on('input', function(data) {
    var keys = data.keys;
    //var cloc = gs.locations[socket.id].client;
    gs.clients[socket.id].keys = keys;
  });
  
  
  
  //COMMENT OUT LATER
  socket.on('console', function (data) {
    if(eval("typeof " + data.cmd) !== "undefined") {
      var log = eval(data.cmd);
      socket.emit('log', {
        log: log
      });
      ////console.log(data.cmd);
      ////console.log(log);
    }
  });
});


function loop(){
  //setTimeout(function() {
  /*for(var i = 0; i < gs.nodes.length; i++) {
    var node1 = gs.nodes[i];
    node1.move();
    //console.log("1: " + i);
    //var node1 = gs.clients[i].nodes[0];
  }
  for(var j = 0; j < gs.clients.length; j++) {
    var cl = gs.clients[j];
    cl.update();
    //console.log("2: " + j);
  }*/
	for(var i = 0; i < gs.nodes.length; i++) {
    
		if(typeof gs.clients[gs.nodes[i].id] == "undefined") {
			delete gs.clients[gs.nodes[i].id];
			continue;
		}
		var clnodes = gs.clients[gs.nodes[i].id].nodes;
		var node1 = clnodes[gs.nodes[i].clapos];
    node1.move();
		//console.log(clnodes);
		//console.log("clapos: " + gs.nodes[i].clapos);
	}
  for(var j = 0; j < gs.map.length; j++) {
    var cl = gs.clients[gs.map[j]];
    cl.update();
    //console.log("2: " + j);
  }
	
	if(logReset <= 200) {
		logReset += 1;
	} else if(logReset > 200) {
		logReset = 0;
	}
	
	//gs.t.renderer.render( gs.t.scene );
	
	
  

  /*for(var j = 0; j < gs.clients.length; j++) {
    
    var cl = gs.clients[j];
    
    for(var i = 0; i < cl.nodes.length; i++) {
      var node1 = gs.nodes[i];
      node1.move();
      //console.log("1: " + i);
      //var node1 = gs.clients[i].nodes[0];
      
      
    }
    
    cl.update();
    
    //console.log("2: " + j);
    
    
  }*/
  
  
  
  
  //}, 100);
  setTimeout(loop, 10);
}
setTimeout(loop, 5000);
//loop();