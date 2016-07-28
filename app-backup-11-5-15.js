var util = require('util');
var THREE = require('three');
var CANNON = require('cannon');
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










var carPhysicsMesh=[{verts:[-1.616247,-.787435,.050138,1.622449,.972075,.369802,1.622449,.892088,.409848,1.342338,-.947408,-.189786,.902661,-.987497,.809721,-1.336485,.931986,-.149858,-.017106,.532053,.929742,1.342338,.851999,-.229832,-.696828,-.987497,-.269996,-1.57653,-.067557,.529751,-.89646,.972075,.529751,-.056824,-.987497,.809721,1.742646,-.587373,.329873,.942727,.972075,.809721,-.696828,.972075,-.269996,.902661,-.547475,.929742,1.462535,-.067557,-.269996,-1.736444,.532053,.290062,-1.496399,-.547475,-.189786,-1.256354,-.90751,.409848,1.702232,.532053,.529751,1.742646,.532053,.050138,-.017106,-.547475,.929742,1.622449,-.987497,.170041,-1.816576,.17221,.050138,1.702232,-.507578,.529751,-1.616247,-.547475,.449776,.902661,.532053,.929742,-1.176571,.41217,.649772,.702681,.972075,-.269996,-.056824,.972075,.809721,1.742646,-.507578,.050138],faces:[12,23,31,8,4,11,2,1,13,1,10,13,10,1,14,5,10,14,11,4,15,3,8,16,8,14,16,10,5,17,8,0,18,5,14,18,14,8,18,0,8,19,8,11,19,1,2,20,2,13,20,7,1,21,16,7,21,1,20,21,20,12,21,11,15,22,15,6,22,4,8,23,8,3,23,17,5,24,18,0,24,5,18,24,15,4,25,12,20,25,20,15,25,4,23,25,23,12,25,9,17,26,0,19,26,19,11,26,22,9,26,11,22,26,24,0,26,17,24,26,13,6,27,6,15,27,20,13,27,15,20,27,17,9,28,10,17,28,22,6,28,9,22,28,1,7,29,14,1,29,7,16,29,16,14,29,6,13,30,13,10,30,28,6,30,10,28,30,3,16,31,16,21,31,21,12,31,23,3,31],offset:[0,0,0]}];







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
		this.c.pw.gravity.set(0, 0, -10);
			//this.c.pw.broadphase = new CANNON.NaiveBroadphase();
			this.c.pw.broadphase = new CANNON.SAPBroadphase(this.c.pw);
			this.c.pw.solver.iterations = 10;
			this.c.pw.defaultContactMaterial.friction = 5;//1
			this.c.pw.defaultContactMaterial.restitution = 0;//unset
			this.c.pw.defaultContactMaterial.contactEquationStiffness = 1000000;//unset
			this.c.pw.defaultContactMaterial.frictionEquationStiffness = 100000;//unset
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

gameServer.prototype.createPhysicsObject = function(phys) {
	var testObject = {};
	//testObject.mesh = mesh;
	testObject.phys = phys;
	
	//testObject.update = function(world) {
		//this.mesh.position.copy(this.phys.position);
		//this.mesh.quaternion.copy(this.phys.quaternion);
	//};
	
	var length = this.c.objects.length;
	this.c.objects.push(testObject);
	//this.t.scene.add(this.c.objects[length].mesh);
	this.c.pw.addBody(this.c.objects[length].phys);
};


gameServer.prototype.createBall = function() {
	
	var shape = new CANNON.Sphere(2);
	var testBody = new CANNON.Body({
		mass: 1
	});
	testBody.addShape(shape);
	//testBody.angularVelocity.set(1,1,0);
	testBody.angularDamping = 0.5;
	testBody.position.set(0, 2, 5);
	
	var testObject = {};
	//testObject.mesh = mesh;
	testObject.phys = testBody;
	
	//testObject.update = function(world) {
		//this.mesh.position.copy(this.phys.position);
		//this.mesh.quaternion.copy(this.phys.quaternion);
	//};
	
	var length = this.c.objects.length;
	this.c.objects.push(testObject);
	//this.t.scene.add(this.c.objects[length].mesh);
	this.c.pw.addBody(this.c.objects[length].phys);
	return this.c.objects[length].phys;
};

gameServer.prototype.initScene = function() {
	var groundShape = new CANNON.Plane();
	var groundBody = new CANNON.Body({
			mass: 0
	});
	groundBody.position.set(0, 0, 0);
	groundBody.addShape(groundShape);
	this.createPhysicsObject(groundBody);
	
	
	
	//var ball = new 
	
	/*var shape = new CANNON.Sphere(2);
	var testBody = new CANNON.Body({
		mass: 1
	});
	testBody.addShape(shape);
	//testBody.angularVelocity.set(1,1,0);
	testBody.angularDamping = 0.5;
	testBody.position.set(0, 2, 5);

	//var testGeometry = new THREE.SphereGeometry(2);
	//var testMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00, wireframe: false } );
	//var testMesh = new THREE.Mesh( testGeometry, testMaterial );
	this.createPhysicsObject(testBody);*/
	
	


	/*shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
	testBody = new CANNON.Body({
		mass: 1
	});
	testBody.addShape(shape);
	testBody.angularVelocity.set(5,20,0);
	testBody.angularDamping = 0.5;
	testBody.position.set(0, 2, 0);
	testGeometry = new THREE.BoxGeometry( 2, 2, 2 );
	testMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00, wireframe: false } );
	testMesh = new THREE.Mesh( testGeometry, testMaterial );
	this.createPhysicsObject(testBody);*/
	
	/*var geometry = new THREE.BoxGeometry( 30, 0.1, 30 );
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
	var platform = new THREE.Mesh( geometry, material );
	this.t.scene.add( platform );*/
};

gameServer.prototype.updatePhysics = function() {
	this.c.pw.step(1/60);
	//this.c.pw.step(1/120);
	//this.c.pw.step(1/120);
	
	/*if(logReset === 0) {
		logReset += 1;
		console.log("physics");
	}*/
	
	for(var i = 0; i < this.c.objects.length; i++) {
		if(typeof this.c.objects[i].update != "undefined") {
			this.c.objects[i].update();
		}
	}
};

gameServer.prototype.createServerPhysicsObject = function() {
	
};


gameServer.prototype.makeVehicle = function(node) {
	var car = {};

	var wheelMesh = false;
	var chassisMesh = false;
	car.parts = {};
	car.parts.chassis = {};
	//car.parts.chassis.phys;
	//car.parts.chassis.mesh;
	car.parts.wheels = {};
	car.parts.wheels.bodies = [];
	car.parts.wheels.meshes = [];
	car.parts.chassis.body = new CANNON.Body({mass:1500.0});
	//var chassisShape = new CANNON.Box(new CANNON.Vec3(2, 1, 0.5));
	var chassisShape = new CANNON.Box(new CANNON.Vec3(2, 0.85, 0.4));
	car.parts.chassis.body.addShape(chassisShape, new CANNON.Vec3(0, 0, 0));
	
	/*var cabShape = new CANNON.Box(new CANNON.Vec3(0.8, 0.85, 0.25));
	car.parts.chassis.body.addShape(cabShape, new CANNON.Vec3(0, 0, 0.4+0.25));*/
	
	
	//var cpm = physicsMesh;
	/*var cpm = carPhysicsMesh;
	var cpmBody = new CANNON.Body({mass: 150});
	for(var i = 0; i < cpm.length; i++){
		var rawVerts = cpm[i].verts;
		var rawFaces = cpm[i].faces;
		var rawOffset = cpm[i].offset;
		var verts=[], faces=[], offset;
		for(var j = 0; j < rawVerts.length; j += 3) {
			verts.push(new CANNON.Vec3( rawVerts[j],
			rawVerts[j+1],
			rawVerts[j+2]));
		}
		for(j = 0; j < rawFaces.length; j += 3) {
			faces.push([rawFaces[j], rawFaces[j+1], rawFaces[j+2]]);
		}
		offset = new CANNON.Vec3(rawOffset[0],rawOffset[1],rawOffset[2]);
		var cpmPart = new CANNON.ConvexPolyhedron(verts, faces);
		cpmBody.addShape(cpmPart, offset);
	}
	car.parts.chassis.body = cpmBody;*/
	car.parts.chassis.body.position.set(10, 4, 3);
	//chassisBody.angularVelocity.set(-0.75, 0, 0);

	var options = {
		radius: 0.385,//0.5
		directionLocal: new CANNON.Vec3(0, 0, -1),
		suspensionStiffness: 40,//40
		suspensionRestLength: 0.475,//0.3
		frictionSlip: 3,//100
		dampingRelaxation: 2.3,//2.3
		dampingCompression: 2.5,//4.4
		maxSuspensionForce: 100000,//100000
		rollInfluence: 0.1,//0.01
		axleLocal: new CANNON.Vec3(0, 1, 0),//0,1,0
		//axleWorld: new CANNON.Vec3(1, 0, 0),
		chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0),//1,1,0
		maxSuspensionTravel: 0.3,//0.3
		customSlidingRotationalSpeed: -30,//-30
		useCustomSlidingRotationalSpeed: true//true
	};
	
	car.vehicle = new CANNON.RaycastVehicle({
		chassisBody: car.parts.chassis.body,
	});
	
	/*options.chassisConnectionPointLocal.set(-1, 1, 0);// \_
	options.isFrontWheel = true;
	car.vehicle.addWheel(options);
	options.chassisConnectionPointLocal.set(-1, -1, 0);// _/
	options.isFrontWheel = true;
	car.vehicle.addWheel(options);
	options.chassisConnectionPointLocal.set(1, 1, 0);// /-
	options.isFrontWheel = false;
	car.vehicle.addWheel(options);
	options.chassisConnectionPointLocal.set(1, -1, 0);// -\
	options.isFrontWheel = false;
	car.vehicle.addWheel(options);*/
	
	var cWheelOpts = {};
	cWheelOpts.axleFront = 1.4;//1.4
	cWheelOpts.axleRear = 1.1;//1.1
	cWheelOpts.axleWidth = 0.75;//0.75
	cWheelOpts.axleHeight = -0.2;//0
	
	options.chassisConnectionPointLocal.set(-cWheelOpts.axleRear, cWheelOpts.axleWidth, cWheelOpts.axleHeight);
	//options.isFrontWheel = true;
	car.vehicle.addWheel(options);
	options.chassisConnectionPointLocal.set(-cWheelOpts.axleRear, -cWheelOpts.axleWidth, cWheelOpts.axleHeight);
	//options.isFrontWheel = true;
	car.vehicle.addWheel(options);
	options.chassisConnectionPointLocal.set(cWheelOpts.axleRear, cWheelOpts.axleWidth, cWheelOpts.axleHeight);
	//options.isFrontWheel = false;
	car.vehicle.addWheel(options);
	options.chassisConnectionPointLocal.set(cWheelOpts.axleRear, -cWheelOpts.axleWidth, cWheelOpts.axleHeight);
	//options.isFrontWheel = false;
	car.vehicle.addWheel(options);
	
	for(var i = 0; i < car.vehicle.wheelInfos.length; i++ ) {
		var wheel = car.vehicle.wheelInfos[i];
		var cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, 0.35, 16);//wheel.radius/2 for width 20 for last parameter
		var wheelBody = new CANNON.Body({mass: 1}); //, material:car.cMatWheel});
		wheelBody.type = CANNON.Body.KINEMATIC;
		wheelBody.collisionFilterGroup = 0; // turn off collisions
		var q = new CANNON.Quaternion();
		q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI/2);
		//cylinderShape.transformAllPoints(new CANNON.Vec3(), q);
		wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
		car.parts.wheels.bodies.push(wheelBody);
		
		/*var cylinderGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 8, 1);
		var wmesh = new THREE.Mesh(
			cylinderGeo, new THREE.MeshLambertMaterial({
			shading:THREE.SmoothShading, color:0x888888
		}));
		//wmesh.rotation.z += Math.PI/2;
		//car.parts.wheels.meshes.push(wmesh);
		if(wheelMesh) {
			car.parts.wheels.meshes.push(wheelMesh);
		} else {
			car.parts.wheels.meshes.push(wmesh);
		}*/
	}
	car.vehicle.setBrake(0, 0);
	car.vehicle.setBrake(0, 1);
	car.vehicle.setBrake(0, 2);
	car.vehicle.setBrake(0, 3);
	
	/*if(chassisMesh) {
		car.parts.chassis.mesh = chassisMesh;
	} else {
		var boxGeo = new THREE.BoxGeometry(2, 1, 0.5);
		car.parts.chassis.mesh = new THREE.Mesh(
			boxGeo, new THREE.MeshLambertMaterial({
			shading:THREE.SmoothShading, color:0xFFFFEE
		}));
	}*/
	
	car.update = function() {
		//this.parts.chassis.mesh.position.copy(car.parts.chassis.body.position);
		//car.parts.chassis.mesh.quaternion.copy(car.parts.chassis.body.quaternion);
		for (var i = 0; i < car.vehicle.wheelInfos.length; i++) {
			car.vehicle.updateWheelTransform(i);
			var t = car.vehicle.wheelInfos[i].worldTransform;
			car.parts.wheels.bodies[i].position.copy(t.position);
			car.parts.wheels.bodies[i].quaternion.copy(t.quaternion);
			//car.parts.wheels.meshes[i].position.copy(t.position);
			//car.parts.wheels.meshes[i].quaternion.copy(t.quaternion);
		}
	};
	
	/*if(typeof node != "undefined") {
		car.node = node;
	}*/
	
	
	//this.t.scene.add(this.parts.chassis.mesh);
	this.c.pw.addBody(car.parts.chassis.body);
	
	for(var i = 0; i < 4; i++) {
		//this.t.scene.add(car.parts.wheels.meshes[i]);
		this.c.pw.addBody(car.parts.wheels.bodies[i]);
	}
	car.vehicle.addToWorld(this.c.pw);
	this.c.objects.push(car);
	return car;
};






gameServer.prototype.addPlayer = function() {
	
	
};






function node(type, owner) {
	this.type = type;
	if(typeof owner != "undefined") {
		this.owner = owner;
		this.socketId = this.owner.socketId;        
	}
	//this.nodeId = nodeId;
	//this.owner = owner; // playerTracker that owns this cell
	this.color = {r: 0, g: 0, b: 255};
	this.size = 0; // Radius of the cell - Depreciated, use getSize() instead
	//this.mass = mass; // Starting mass of the cell
	//this.speed = 30; // Filler, will be changed later
	
	this.position = 0;
	this.velocity = 0;
	this.quaternion = 0;

	/*this.position = new THREE.Vector3();
	this.rotation = function() {
		return {x: this.tObject.rotation.x,
						y: this.tObject.rotation.y,
						z: this.tObject.rotation.z,
						xRotation: this.input.rotation.x,
						yRotation: this.input.rotation.y};
	};
	this.quaternion = function() {
		return this.tObject.quaternion;
	};*/

	this.input = {};
	this.input.rotation = {};
	this.input.rotation.x = 0;
	this.input.rotation.y = 0;
	
	this.temp = {
		tCurrent: 0,
		tSpd: 10,
		tMinMax: 1000,
		rCurrent: 0,
		rSpd: 0.05,
		rMinMax: 0.6,
		jumps: 0,
		airTurnForce: 1,
		jumpForce: 200*10,
		jumpMoveForce: 800*10,
		jumpRollForce: 55*10,
		boostForce: 50*10
	};


	//create object
	//var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	//var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	//this.tObject = new THREE.Mesh( geometry, material );
	
	if(this.type == "player"){
		this.tObject = gs.makeVehicle();
		this.tObject.parts.chassis.body.position.x = (Math.random()*10)*(Math.round(Math.random()) * 2 - 1);
		this.tObject.parts.chassis.body.position.y = (Math.random()*10)*(Math.round(Math.random()) * 2 - 1);
		this.tObject.parts.chassis.body.position.z = (4+Math.random()*46);
		this.position = this.tObject.parts.chassis.body.position;
		this.quaternion = this.tObject.parts.chassis.body.quaternion;
		this.velocity = this.tObject.parts.chassis.body.velocity;
		//this.rotation = this.tObject.parts.chassis.body.rotation;
		/*this.rotation = function() {
			return {x: this.tObject.parts.chassis.body.rotation.x,
							y: this.tObject.parts.chassis.body.rotation.y,
							z: this.tObject.parts.chassis.body.rotation.z,
							xRotation: this.input.rotation.x,
							yRotation: this.input.rotation.y};
		};*/
	} else if(this.type == "ball") {
		this.tObject = gs.createBall();
		this.position = this.tObject.position;
		this.quaternion = this.tObject.quaternion;
		this.velocity = this.tObject.velocity;
	}



	/*this.tObject = new THREE.Object3D();
	this.tObject.position.x = 0;
	this.tObject.position.y = 0;
	this.tObject.position.z = 0;

	this.tObject.rotation.x = 0;
	this.tObject.rotation.y = 0;
	this.tObject.rotation.z = 0;*/
	//gs.t.scene.add(this.tObject);
}

node.prototype.viewObj = function() {
  return {
		type: this.type,
		//tObject: this.tObject,
    position: this.position,
		velocity: this.velocity,
		quaternion: this.quaternion,
    //mass: this.mass,
    //speed: this.speed,
    nodeId: this.nodeId,
    username: this.owner.username
  };
};



node.prototype.collisionCheck = function(xMin, xMax, yMin, yMax, zMin, zMax) {
	// Collision checking
	var obj;
	if(this.type == "player") {
		obj = this.tObject.parts.chassis.body;
	} else {
		obj = this.tObject;
	}
	if (obj.position.x < xMin) {
		return false;
	}
	if (obj.position.x > xMax) {
		return false;
	}
	if (obj.position.y < yMin) {
		return false;
	}
	if (obj.position.y > yMax) {
		return false;
	}
	if (obj.position.z < zMin) {
		return false;
	}
	if (obj.position.z > zMax) {
		return false;
	}
	return true;
};

node.prototype.move = function() {
  var keys = this.owner.keys;
  if(typeof keys !== "undefined") {
    //var tspd = 0.1;
		
		
    if(keys.indexOf("w") > -1) {
			if(this.temp.tCurrent < this.temp.tMinMax) {
				if(this.temp.tCurrent < 0) {
					this.tObject.vehicle.setBrake(10, 2);
					this.tObject.vehicle.setBrake(10, 3);
					this.temp.tCurrent = 0;
				} else {
					if(this.temp.tCurrent > 5*this.temp.tSpd) {
						this.tObject.vehicle.setBrake(0, 2);
						this.tObject.vehicle.setBrake(0, 3);
					}
					this.temp.tCurrent = Math.abs(this.temp.tCurrent);
					this.temp.tCurrent += this.temp.tSpd;
				}
			}
			this.tObject.vehicle.applyEngineForce(this.temp.tCurrent, 2);
			this.tObject.vehicle.applyEngineForce(this.temp.tCurrent, 3);
    }
    if(keys.indexOf("s") > -1) {
			if(this.temp.tCurrent > -1*this.temp.tMinMax) {
				if(this.temp.tCurrent > 0) {
					this.tObject.vehicle.setBrake(10, 2);
					this.tObject.vehicle.setBrake(10, 3);
					this.temp.tCurrent = 0;
				} else {
					if(this.temp.tCurrent < -5*this.temp.tSpd) {
						this.tObject.vehicle.setBrake(0, 2);
						this.tObject.vehicle.setBrake(0, 3);
					}
					this.temp.tCurrent = -1*Math.abs(this.temp.tCurrent);
					this.temp.tCurrent -= this.temp.tSpd;
				}
			}
			this.tObject.vehicle.applyEngineForce(this.temp.tCurrent, 2);
			this.tObject.vehicle.applyEngineForce(this.temp.tCurrent, 3);
    }
		
		if(keys.indexOf("w") == -1 && keys.indexOf("s") == -1) {
			if(this.temp.tCurrent < 0) {
				this.temp.tCurrent -= this.temp.tCurrent/50;
			} else if(this.temp.tCurrent > 0) {
				this.temp.tCurrent += -1*this.temp.tCurrent/50;
			}
			this.tObject.vehicle.applyEngineForce(this.temp.tCurrent, 2);
			this.tObject.vehicle.applyEngineForce(this.temp.tCurrent, 3);
		}
		
		var velX = this.tObject.parts.chassis.body.velocity.x;
		var velY = this.tObject.parts.chassis.body.velocity.y;
		var velMag = Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2));
		velMag /= 10;
		if(velMag > 1) {
			this.temp.rMinMax = 0.6/velMag;
		}
		
		if(keys.indexOf("a") > -1) {
			if(this.temp.rCurrent < this.temp.rMinMax) {
				this.temp.rCurrent += this.temp.rSpd;
			} else if(this.temp.rCurrent > this.temp.rMinMax) {
				this.temp.rCurrent = this.temp.rMinMax;
			}
			this.tObject.vehicle.setSteeringValue(this.temp.rCurrent, 0);
			this.tObject.vehicle.setSteeringValue(this.temp.rCurrent, 1);
    }
    if(keys.indexOf("d") > -1) {
			if(this.temp.rCurrent > -1*this.temp.rMinMax) {
				this.temp.rCurrent -= this.temp.rSpd;
			} else if(this.temp.rCurrent < -1*this.temp.rMinMax) {
				this.temp.rCurrent = -1*this.temp.rMinMax;
			}
			this.tObject.vehicle.setSteeringValue(this.temp.rCurrent, 0);
			this.tObject.vehicle.setSteeringValue(this.temp.rCurrent, 1);
    }
		if(keys.indexOf("a") == -1 && keys.indexOf("d") == -1) {
			if(this.temp.rCurrent < 0) {
				this.temp.rCurrent += -1*this.temp.rCurrent/10;
			} else if(this.temp.rCurrent > 0) {
				this.temp.rCurrent -= this.temp.rCurrent/10;
			}
			this.tObject.vehicle.setSteeringValue(this.temp.rCurrent, 0);
			this.tObject.vehicle.setSteeringValue(this.temp.rCurrent, 1);
		}
		
		
		if(this.tObject.vehicle.chassisBody.position.z < 1.3) {
			this.temp.jumps = 0;
		}
		
    if(keys.indexOf("space") > -1 && this.tObject.vehicle.chassisBody.angularVelocity.z > -5  && this.tObject.vehicle.chassisBody.position.z < 1.3 && this.temp.jumps < 1) {
			this.temp.jumps = 1;
			this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, 0, this.temp.jumpForce), new CANNON.Vec3(0, 0, 0));
    }
		
		if(keys.indexOf("space") > -1 && this.temp.jumps == 1 && this.tObject.vehicle.chassisBody.position.z > 3.3) {
			//console.log(vehicle.chassisBody.position.z);
			this.temp.jumps = 2;
			if(keys.indexOf("w") > -1) {
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, 0, this.temp.jumpRollForce), new CANNON.Vec3(20, 0, 0));
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(-this.temp.jumpMoveForce, 0, 0), new CANNON.Vec3(0, 0, 0));
			} else if(keys.indexOf("s") > -1) {
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, 0, this.temp.jumpRollForce), new CANNON.Vec3(-20, 0, 0));
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(this.temp.jumpMoveForce, 0, 0), new CANNON.Vec3(0, 0, 0));
			} else if(keys.indexOf("a") > -1) {
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, 0, this.temp.jumpRollForce), new CANNON.Vec3(0, 10, 0));
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, -this.temp.jumpMoveForce, 0), new CANNON.Vec3(0, 0, 0));
			} else if(keys.indexOf("d") > -1) {
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, 0, this.temp.jumpRollForce), new CANNON.Vec3(0, -10, 0));
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, this.temp.jumpMoveForce, 0), new CANNON.Vec3(0, 0, 0));
			} else {
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, 0, this.temp.jumpForce), new CANNON.Vec3(0, 0, 0));
			}
    }
		
    if((keys.indexOf("r") > -1 )) {//&& this.tObject.vehicle.chassisBody.position.z < 1.3) && (Math.abs(this.tObject.vehicle.chassisBody.quaternion.y) > 0.8 || Math.abs(this.tObject.vehicle.chassisBody.quaternion.x) > 0.8 || Math.abs(this.tObject.vehicle.chassisBody.quaternion.z) > 0.8)) {
			this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, 0, -55), new CANNON.Vec3(0, 10, -10));
		}
		
		if(keys.indexOf("shift") > -1 ) {
			this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(-this.temp.boostForce, 0, 0), new CANNON.Vec3(100, 0, 0));
			//this.temp.airTurnForce = 10;
		} else if(this.temp.airTurnForce == 10) {
			//this.temp.airTurnForce = 1;
		}
		
		if(this.tObject.vehicle.chassisBody.position.z > 1.3) {
			if(keys.indexOf("w")) {
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, 0, this.temp.airTurnForce), new CANNON.Vec3(-20, 0, 0));
			}
			if(keys.indexOf("s")) {
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, 0, this.temp.airTurnForce), new CANNON.Vec3(20, 0, 0));
			}
			if(keys.indexOf("a")) {
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, this.temp.airTurnForce, 0), new CANNON.Vec3(-10, 0, 0));
			} 
			if(keys.indexOf("d")) {
				this.tObject.vehicle.chassisBody.applyLocalImpulse(new CANNON.Vec3(0, this.temp.airTurnForce, 0), new CANNON.Vec3(10, 0, 0));
			}
		}
		
		
		
		
		//var rspd = 0.015;
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
  	//this.tObject.quaternion.setFromEuler( euler );
		
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
	
		/*if(logReset === 0) {
			//console.log(this.visibleNodes);
		}*/
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
		//commented 11/5/15
		/*if(typeof gs.clients[gs.nodes[i].id] == "undefined") {
			delete gs.clients[gs.nodes[i].id];
			continue;
		}*/
		//end of comment
		
		
		
    var clnodes = gs.clients[gs.nodes[i].id].nodes;
		var node1 = clnodes[gs.nodes[i].clapos];
		
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
gs.initScene();

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
	//console.log("gs.c.pw: " + gs.c.pw);
	//console.log(util.inspect(gs.c.pw, {showHidden: false, depth: 1}));
  //console.log("gs.clients.length: " + gs.clients.length);
  
  //socket.emit('clientId', {id: gs.getNextId() });
  
  socket.on('disconnect', function() {
    var i;
		//socket.broadcast.emit('disc', {nodes: gs.clients[socket.id].nodes});
		
		//ADDED
		var clnodes = gs.clients[socket.id].nodes;
		for(i = 0; i < clnodes.length; i++) {
			var node1 = clnodes[i];
			clnodes[i].tObject.vehicle.removeFromWorld(gs.c.pw);
			//gs.c.pw.removeBody(clnodes[i].tObject);
			gs.c.pw.removeBody(clnodes[i].tObject.vehicle);
		}
		//END OF ADDED
		
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
		socket.on('chat message', function(msg) {
			io.emit('chat message', {msg:msg, name:data.username});
		});
		
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
		if(gs.nodes[i].type !== "player") {
			continue;
		}
		
		if(typeof gs.clients[gs.nodes[i].id] == "undefined") {
			//delete gs.clients[gs.nodes[i].id];
			//gs.nodes.splice(gs.nodes.indexOf(gs.nodes[i];), 1);
			gs.nodes.splice(i, 1);
			console.log("node deleted");
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
	
	gs.updatePhysics();
	
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