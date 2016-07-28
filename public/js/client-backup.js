$(function() {
var mouse = {};
mouse.x = 0;
mouse.y = 0;
mouse.chg = {};
mouse.chg.x = 0;
mouse.chg.y = 0;
mouse.lclick = false;
mouse.mclick = false;
mouse.rclick = false;

var keys = [];
var key = {};
key.space = false;


key.w = false;
key.a = false;
key.s = false;
key.d = false;
key.q = false;
key.e = false;

key.left = false;
key.right = false;
key.up = false;
key.down = false;

key.n1 = false;
key.n2 = false;
key.n3 = false;
key.n4 = false;


$('#canvas').mousedown(function(event) {
  switch (event.which) {
    case 1:
      mouse.lclick = true;
      break;
    case 2:
      mouse.mclick = true;
      break;
    case 3:
      rclick = true;
      break;
  }
});

$('#canvas').mouseup(function(event) {
  switch (event.which) {
    case 1:
      mouse.lclick = false;
      break;
    case 2:
      mouse.mclick = false;
      break;
    case 3:
      mouse.rclick = false;
      break;
  }
});

function onKeyDown(event) {
  //event.preventDefault();
  //var keyCode = event.keyCode;
  switch (event.keyCode) {
    case 32: //space
      key.space = true;
      if(keys.indexOf("space") === -1) {
        keys.push("space");
      }
      break;
    case 87: //w
      key.w = true;
      if(keys.indexOf("w") === -1) {
        keys.push("w");
      }
      break;
    case 65: //a
      key.a = true;
      if(keys.indexOf("a") === -1) {
        keys.push("a");
      }
      break;
    case 83: //s
      key.s = true;
      if(keys.indexOf("s") === -1) {
        keys.push("s");
      }
      break;
    case 68: //d
      key.d = true;
      if(keys.indexOf("d") === -1) {
        keys.push("d");
      }
      break;
    case 81: //q
      key.q = true;
      break;
    case 69: //e
      key.e = true;
      break;
    case 37: //left
      key.left = true;
      break;
    case 39: //right
      key.right = true;
      break;
    case 38: //up
      key.up = true;
      break;
    case 40: //down
      key.down = true;
      break;
    case 49: //1
      key.n1 = true;
      break;
    case 50: //2
      key.n2 = true;
      break;
    case 51: //3
      key.n3 = true;
      break;
    case 52: //4
      key.n4 = true;
      break;
    /*case (event.keyCode > 47 && event.keyCode < 58):
      keyNum = event.keyCode-48;
      break;*/
  }
  /*switch (true) {
    case (keyCode > 47 && keyCode < 58):
      keyNum = keyCode-48;
      break;
  }*/
}

function onKeyUp(event) {
  //event.preventDefault();
  //var keyCode = event.keyCode;
  switch (event.keyCode) {
    case 32: //space
      key.space = false;
      keys.splice(keys.indexOf("space"), 1);
      break;
    case 87: //w
      key.w = false;
      keys.splice(keys.indexOf("w"), 1);
      break;
    case 65: //a
      key.a = false;
      keys.splice(keys.indexOf("a"), 1);
      break;
    case 83: //s
      key.s = false;
      keys.splice(keys.indexOf("s"), 1);
      break;
    case 68: //d
      key.d = false;
      keys.splice(keys.indexOf("d"), 1);
      break;
    case 81: //q
      key.q = false;
      break;
    case 69: //e
      key.e = false;
      break;
    case 37: //left
      key.left = false;
      break;
    case 39: //right
      key.right = false;
      break;
    case 38: //up
      key.up = false;
      break;
    case 40: //down
      key.down = false;
      break;
    case 49: //1
      key.n1 = false;
      break;
    case 50: //2
      key.n2 = false;
      break;
    case 51: //3
      key.n3 = false;
      break;
    case 52: //4
      key.n4 = false;
      break;
  }
  /*switch (true) {
    case (keyCode > 47 && keyCode < 58):
      keyNum = keyCode-48;
      break;
  }*/
}
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

/*function self() {
  this.x;
  this.y;
  this.update = function(obj) {
    this.x = obj.x;
    this.y = obj.y;
  };
  this.sendInput = function(input) {
    socket.emit('input', input);
  };
}*/



/*function player() {
  this.x;
  this.y;
  this.draw = function(x, y) {
    
  };
}*

var self = new player();*/

var socket;

socket = io('http://f1v3.net', {path: '/8100/socket.io'});
socket.on('connection', function(data) {
  console.log(data);
});

function setNick(name){
  socket.emit('addUser', {
    username: name
  });
  world1.game.player.username = name;
  $('#overlays').hide();
}

$("#playBtn").on('click', function(event){
  event.preventDefault();
  var nick = $("#nick").val();
  setNick(nick);
});

socket.on('initData', function(data) {
  world1.game.player.id = socket.id;
  world1.game.player.username = data.username;
  world1.game.player.pos.x = data.x;
  world1.game.player.pos.y = data.y;
  world1.game.width = data.gwidth;
  world1.game.height = data.gheight;
  world1.game.connected = true;
  console.log(data);
});


socket.on('Data', function(data) {
  world1.game.player.id = socket.id;
  world1.game.player.x = data.x;
  world1.game.player.y = data.y;
  world1.game.width = data.gwidth;
  world1.game.height = data.gheight;
  world1.game.connected = true;
  console.log(data);
});

socket.on('visibleNodes', function(data) {
  //for(var i; i < data.localplayers.length; i++) {
    //localplayers[i].update(data.localplayers[i]);
  //}
  
  //player.update(data.playerdata);
  world1.game.visiblePlayers = data.vn;
  //console.log(data.vn);
});



function log(data){
  if(!data) {
    console.error('Console.save: No data');
    return;
  }
  
  if(typeof data === "object"){
    data = JSON.stringify(data, undefined, 4);
  }
  
  //var blob = new Blob([data], {type: 'text/json'});
  console.log(data);
}



var newtext = document.createElement('textarea');
$(newtext).attr('id', 'console').appendTo('#overlays');
$("#console").on('keydown', function(evt){
  if(evt.keyCode == 67 && evt.shiftKey && evt.ctrlKey){
    evt.preventDefault();
    $("#console").val("");
    //$("#console").focus();
  }
  
  if(evt.keyCode == 13 && !evt.shiftKey){
    evt.preventDefault();
    debug($("#console").val());
  }
});


function debug(cmd) {
  socket.emit('console', {
    cmd: cmd
  });
}
socket.on('log', function(data) {
  //console.log(data.log);
});


function world() {
  this.createCanvas = function(location, id, width, height) {
    this.width = width || window.innerWidth;
    this.height = height || window.innerHeight;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.bgColor = '#EEEEEE';
    $(this.canvas)
      .attr('id', id)
      //.attr('class', classc)
      .text('unsupported browser')
      //.attr('width', 301)
      //.width(this.width)
      //.height(this.height)
      .appendTo(location);
    this.t = {};
    this.t.scene = new THREE.Scene();
    this.t.camera = new THREE.PerspectiveCamera( 75, this.width / this.height, 0.1, 1000 );
    //PerspectiveCamera( fov, aspect, near, far )
    //new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.t.renderer = new THREE.WebGLRenderer();
    this.t.renderer.setSize( this.width, this.height );
    document.body.appendChild( this.t.renderer.domElement );
  };
  this.game = {};
  this.game.leng = 0;
  this.game.width = 0;
  this.game.height = 0;
  this.game.xoffset = -this.game.width;
  this.game.yoffset = -this.game.height;
  this.game.zoffset = -this.game.leng;
  this.game.connected = false;
  //var w = this.width;
  //var h = this.height;
  //var that = this;
  this.game.player = {
    id: -1,
    username: "",
    pos: {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    },
    xoffset: 0,
    yoffset: 0
  };
  this.game.visiblePlayers = [];
  this.game.inputs = {};
  
}

var world1 = new world();
world1.createCanvas('body', 'canvas');

var geometry = new THREE.BoxGeometry( 30, 0.1, 30 );
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var platform = new THREE.Mesh( geometry, material );
world1.t.scene.add( platform );


geometry = new THREE.BoxGeometry( 1, 1, 1 );
material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
world1.t.scene.add( cube );
cube.position.y = 3;




/*(function draw(world) {
  window.requestAnimationFrame(draw);
  // Store the current transformation matrix
  world1.ctx.save();
  // Use the identity matrix while clearing the canvas
  //world1.ctx.setTransform(1, 0, 0, 1, 0, 0);
  world1.ctx.clearRect(0, 0, world1.canvas.width, world1.canvas.height);
  // Restore the transform
  world1.ctx.restore();
  // done clearing
  
  

  
}());*/

/*function drawCircle(centerX, centerY, mass, sides){
  var theta = 0;
  var x = 0;
  var y = 0;
  var radius = mass;//massToRadius(mass);
  
  graph.beginPath();
  
  for (var i = 0; i < sides; i++) {
    theta = (i / sides) * 2 * Math.PI;
    x = centerX + radius * Math.sin(theta);
    y = centerY + radius * Math.cos(theta);
    world1.ctx.lineTo(x, y);
  }
  
  world1.ctx.closePath();
  world1.ctx.stroke();
  world1.ctx.fill();
}*/

function randInt(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

/*function drawCircle(world, centerX, centerY, mass, spikiness, username){
  //var centerX = 200;
  //var centerY = 100;
  var radius = mass;//40;
  var variance = spikiness || 5;
  
  // an array to save your points
  var points=[];
  
  for(var degree=0;degree<360;degree += 360/16){
    var radians = degree * Math.PI/180;
    var x = centerX + randInt(radius, radius + variance) * Math.cos(radians);
    var y = centerY + randInt(radius, radius + variance) * Math.sin(radians);
    points.push({x:x,y:y});
  }
  
  world.ctx.beginPath();
  world.ctx.moveTo(points[0].x,points[0].y);
  for(var i=1;i<points.length;i++){
    world.ctx.lineTo(points[i].x,points[i].y);
  }
  world.ctx.closePath();
  world.ctx.fillStyle="skyblue";
  world.ctx.fill();
  world.ctx.strokeStyle="lightgray";
  world.ctx.lineWidth=3;
  world.ctx.stroke();
  
  if(username) {
    world.ctx.textAlign="center"; 
    world.ctx.font="22px Comic Sans MS";
    world.ctx.fillText(username, centerX, centerY+44);
  }
  
}

function draw(world) {
  for(var i = 0; i < world.game.visiblePlayers.length; i++) {
    var pl = world.game.visiblePlayers[i];
    if(pl.username == world.game.player.username) {
      world.game.player.pos = pl.pos;
    }
    var w2 = window.innerWidth/2;
    var h2 = window.innerHeight/2;
    
    var tx = pl.pos.x - world.game.player.pos.x + w2;
    var ty = pl.pos.y - world.game.player.pos.y + h2;
    
    //console.log("trying to draw at:");
    //console.log("x: " + tx);
    //console.log("y: " + ty);
    drawCircle(world, tx, ty, 20, 2, pl.username);
    
  }
  
  
  
}*/
    /*var kirbyImg = new Image();
    // When the image has loaded, draw it to the canvas
    kirbyImg.onload = function()
    {
        // draw image...
        //world.ctx.drawImage(kirbyImg, 0, 0, 100, 100);
    };
 
    // Now set the source of the image that we want to load
    kirbyImg.src = "img/kirby.png";*/


// MADE BETTER
/*function drawgrid(world) {
  var xcount = 0;
  for (var x = world.game.xoffset - world.game.player.pos.x; x < world.canvas.width; x += world.canvas.height / 20) {
    if(x < 0) {
      for (x = x; x < -1*(world.canvas.height / 20); x += world.canvas.height / 20) {
      }
    }
    world.ctx.moveTo(x, 0);
    world.ctx.lineTo(x, world.canvas.height);
    xcount += 1;
  }
  var ycount = 0;
  for (var y = world.game.yoffset - world.game.player.pos.y ; y < world.canvas.height; y += world.canvas.height / 20) {
    if(y < 0) {
      for (y = y; y < -1*(world.canvas.height / 20); y += world.canvas.height / 20) {
      }
    }
    world.ctx.moveTo(0, y);
    world.ctx.lineTo(world.canvas.width, y);
    ycount += 1;
  }
  ///console.log("world.width: " + world.width);
  ///console.log("world.canvas.width: " + world.canvas.width);
  ///console.log("innerwidth: " + window.innerWidth);
  ///console.log("xoffset: " + world.game.xoffset);
  //console.log("x: " + world.game.player.x);
  //console.log("y: " + world.game.player.y);
  //console.log("xcount: " + xcount);
  //console.log("ycount: " + ycount);
  world.ctx.strokeStyle = '#ddd';
  world.ctx.stroke();
  

  //world.ctx.drawImage(kirbyImg, world.game.player.pos.x, world.game.player.pos.y, world.width, world.height);
  
}*/


function followObject(obj, cam, offset) {
	var translateOffset = new THREE.Vector3(0, 5, 5);
	var rotateOffset = new THREE.Vector3(0, 0, 0);
  
  //var rotateOffset = obj.rotation;
  
	var cubePosition = new THREE.Vector3().copy(obj.position);
	//var cubeRotation = new THREE.Vector3().copy(cube.rotation);

	var camTranslate = new THREE.Vector3().copy(obj.position);
	camTranslate.add(translateOffset);
	camTranslate.sub(cam.position);
	camTranslate.multiplyScalar(0.1);
	//cam.position.add(camTranslate);
	//cam.lookAt(obj.position.add(rotateOffset));
	//cam.lookAt(obj.position);
	
	
	
	var ideal = new THREE.Object3D();
	
	//ideal.position.copy( obj.position );
	//ideal.quaternion.copy( obj.quaternion );
	
  //test( obj.position, obj );
  //cam.position.lerp( newPos.position, 0.1 );
	
	
	var targetSet = {
    object: obj.clone(),
    camPos: new THREE.Vector3(0, 4, 10),
    fixed: false,
    stiffness: 0.2,
    rotationStiffness: null,
    transStiffness: null,
    matchRotation: true,
    lookAt: false
	};
	
	//if(typeof offset !== "undefined") {
	  //targetSet.object.position.add(offset);
	//}
	
  ideal.position.copy( targetSet.object.position );
  ideal.quaternion.copy( targetSet.object.quaternion );
	
  if( targetSet.cameraRotation !== undefined ) {
    ideal.quaternion.multiply( targetSet.cameraRotation );
  }
  
  var tstiff = targetSet.transStiffness || targetSet.stiffness;
  var rstiff = targetSet.rotationStiffness || targetSet.stiffness;

  //translateIdealObject( ideal, targetSet.camPos );
  
  ideal.translateX(targetSet.camPos.x+offset.x);
  ideal.translateY(targetSet.camPos.y+offset.y);
  ideal.translateZ(targetSet.camPos.z+offset.z);
  
  cam.position.lerp( ideal.position, tstiff );
  
  if( targetSet.matchRotation ) {
    cam.quaternion.slerp( ideal.quaternion, rstiff );
  } else {
    cam.lookAt( targetSet.object.position );
  }
  
  if(targetSet.lookAt) {
    cam.lookAt( targetSet.object.position );
  }
  
}

cube.add(world1.t.camera);
world1.t.camera.position.z+=10;






window.addEventListener('resize', function() {
  world1.width = window.innerWidth;
  world1.height = window.innerHeight;
  world1.canvas.width = window.innerWidth;
  world1.canvas.height = window.innerHeight;
}, true);



window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

function loop() {
  window.requestAnimFrame(loop);
  gameLoop(world1);
}

//var temp = {};
//temp.x = world1.game.player.x;
//temp.y = world1.game.player.y;


function gameLoop(world) {
  if(world.game.connected) {
    socket.emit('input', {
      keys: keys
    });
    //console.log(keys);
    //world.ctx.fillStyle = world.bgColor;
    //world.ctx.clearRect(0, 0, world.width, world.height);
    //world.ctx.save();
    
    ////world.ctx.fillStyle = world.bgColor;
    ////world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    
    //world.canvas.width = window.innerWidth;
    //world1.ctx.restore();
    
    /*drawgrid(world);
    
    if(typeof key !== "undefined") {
      var spd = 6;
      if(key.w) {
        world.game.player.pos.y -= spd;
      }
      if(key.a) {
        world.game.player.pos.x -= spd;
      }
      if(key.s) {
        world.game.player.pos.y += spd;
      }
      if(key.d) {
        world.game.player.pos.x += spd;
      }
    }
    //world.game.player.x += 1;
    draw(world);
    drawCircle(world, window.innerWidth/2, window.innerHeight/2, 20, 2);*/
    
    var cspeed = 0.2;
    
    if(key.a) {
      cube.translateX(-1*cspeed);
    }
    if(key.d) {
      cube.translateX(cspeed);
    }
    if(key.w) {
      cube.translateZ(-1*cspeed);
    }
    if(key.s) {
      cube.translateZ(cspeed);
    }
    if(key.q) {
      cube.translateY(cspeed);
    }
    if(key.e) {
      cube.translateY(-1*cspeed);
    }
    
    if(key.left) {
      //cube.rotation.y += 0.1;
      var test = new THREE.Vector3(0,1,0);
      cube.rotateOnAxis(new THREE.Vector3(0,1,0), 0.1);
    }
    if(key.right) {
      //cube.rotation.y -= 0.1;
      cube.rotateOnAxis(new THREE.Vector3(0,1,0), -0.1);
    }
    if(key.up) {
      //cube.rotation.x += 0.1;
      cube.rotateOnAxis(new THREE.Vector3(1,0,0), 0.1);
    }
    if(key.down) {
      //cube.rotation.x -= 0.1;
      cube.rotateOnAxis(new THREE.Vector3(1,0,0), -0.1);
    }
    
    /*var offset = new THREE.Vector3(0, 0, 0);
    if(typeof offset !== "undefined") {
      followObject(cube, world.t.camera, offset);
    } else {
      followObject(cube, world.t.camera);
    }*/
    
    
    world.t.renderer.render( world.t.scene, world.t.camera );
  }
}
loop();







$(world1.canvas).on('mousemove', function(e) {
  e.preventDefault();
  
  //if(typeof mouse.mx !== "undefined") {
    mouse.chg = {};
    mouse.chg.x = -1*event.movementX;
    mouse.chg.y = -1*event.movementY;
    
    
    mouse.chg.x *= 0.01;
    mouse.chg.y *= 0.1;
    
    var n = 1;
    
    var xminmax = 0.1;
    var yminmax = 0.3;
    
    if(mouse.chg.x > xminmax) {
      mouse.chg.x = xminmax;
    } else if(mouse.chg.x < -1*xminmax) {
      mouse.chg.x = -1*xminmax;
    }
    if(mouse.chg.y > yminmax) {
      mouse.chg.y = yminmax;
    } else if(mouse.chg.y < -1*yminmax) {
      mouse.chg.y = -1*yminmax;
    }
    
    cube.rotateOnAxis(new THREE.Vector3(0,1,0), mouse.chg.x);
    
    /*var offset2 = new THREE.Vector3(0, mouse.chg.y, 0);
    offset = offset.add(offset2);
    
    var offsetyminmax = 2;
    
    if(offset.y > offsetyminmax) {
      offset.y = offsetyminmax;
    } else if(offset.y < -1*offsetyminmax) {
      offset.y = -1*offsetyminmax;
    }
    //cube.rotateOnAxis(new THREE.Vector3(1,0,0), mouse.chg.y);
  //}*/
  
  mouse.mx = event.clientX;
  mouse.my = event.clientY;
});

world1.canvas.requestPointerLock = canvas.requestPointerLock ||
  world1.canvas.mozRequestPointerLock ||
  world1.canvas.webkitRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
  document.mozExitPointerLock ||
  document.webkitExitPointerLock;

$(world1.canvas).on('click', function(e) {
  $(world1.canvas)[0].requestPointerLock();
});

















});