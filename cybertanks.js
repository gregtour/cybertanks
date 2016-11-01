// Game Logic
//

const CLIENT_NETWORK_POLL = 0.0667;

// GAME EVENTS | SPAWN || BULLET || DAMAGE || DEATH || PICKUP_GONE || PICKUP_SPAWN |
const SPAWN = 1;
const BULLET = 2;
const DAMAGE = 3;
const DEATH = 4;


var scratchVectorA = vec3.create();
var scratchVectorB = vec3.create();
var scratchVectorC = vec3.create();
var scratchMat4 = mat4.create();
var scratchMat3 = mat3.create();
var scratchRotA = quat.create();
var scratchRotB = quat.create();


// Server
class TankGame extends tedge.Game
{
	constructor() 
	{ 
		super();

		// Create root entities.
		this.root = new Entity("Root");
		this.stage = new Stage();
		this.tanks = new Entity("Tanks");
		this.bullets = new Entity("Bullets");
		this.explosions = new Entity("Explosions");

		// Arrange in hierarchy.
		this.root.addChild(this.stage);
		this.root.addChild(this.tanks);
		this.root.addChild(this.bullets);
		this.root.addChild(this.explosions);

		//
		this.seed = -1;
	}

	startup()
	{
		// make outside boundaries
	}

	startupHost()
	{ 
		// pick seed

		// create arena

		// create powerups
	}

	shutdown() 
	{ 
	}

	serverUpdate(dt) 
	{
		return [];
	}

	getPartialState() 
	{
		return {};
	}

	getCompleteState() 
	{
		return {};
	}

	clientEvent(e) 
	{
	}
}

class TankGameHost extends TankGame 
{
	constructor() {
		super();
		Event.bind(this, true);
	}
}

// class Player
class Player {
	constructor() {
		this.tank = null;
		this.inputs = [false, false, false, false];
		this.score = 0;
		this.name = "";
	}

	keypress(key) {

	}
}

/// 
//
class Stage extends tedge.Entity {
	constructor() 
	{
		super();
	}
}

//
class Tank extends tedge.Entity {
	constructor() 
	{
		super();
		this.spawnTime = 5.0;
		this.velocity = vec3.create();
		this.inputY = 0.0;
		this.inputX = 0.0;
		this.shootDelay = 0.0;
		this.boostTime = 0.0;
		this.health = Tank.FULL_HEALTH;
		this.fireCylinder = 0;
	}

	update(dt) {
		var SPEED = Tank.SPEED;
		var CAN_SHOOT = false;
		// shot delay
		if (this.shootDelay > 0.0) {
			this.shootDelay -= dt;
		} else {
			this.shootDelay = 0.0;
			CAN_SHOOT = true;
		}

		// boost time
		if (this.boostTime > 0.0) {
			SPEED = Tank.BOOST_SPEED;
			this.boostTime -= dt;
		} else {
			this.boostTime = 0.0;
		}

		// drag
		var dragAmt = dt * Tank.DRAG;
		var invDragAmt = (dragAmt >= 1.0 ? 0.0 : 1.0 - dragAmt); 
		vec3.scale(this.velocity, this.velocity, invDragAmt);

		// controls

		// rotation
		var rotAngle = 0.0;
		rotAngle = this.inputX * Tank.TURN_SPEED * dt;
		mat4.rotateY(this.matrix, this.matrix, rotAngle);

		// acceleration
		var speed = this.inputY * Tank.SPEED * dt * (this.inputY >= 0.0 ? 1.0 : Tank.REVERSE_SPEED);
		var rotation = scratchRotA;
		var acceleration = scratchVectorA;
		mat4.getRotation(rotation, this.matrix);
		vec3.set(acceleration, 0.0, 0.0, speed);
		vec3.transformQuat(acceleration, acceleration, rotation);
		vec3.add(this.velocity, this.velocity, acceleration)

		// motion


		// collision
	}

	render () {

	}

	shoot () {
		var event = new FIRE_BULLET();
		Event.dispatch(event);
	}
}

Tank.FULL_HEALTH = 5;
Tank.SPEED = 20.0;
Tank.BOOST_SPEED = 30.0;
Tank.TURN_SPEED = 10.0;
Tank.DRAG = 0.5;
Tank.REVERSE_SPEED = 0.60;

//
class Bullet extends tedge.Entity {
	constructor() 
	{
		super();
	}
}

//
class Explosion extends tedge.Entity {
	constructor() 
	{
		super();
	}
}

//
class SPAWN_TANK extends tedge.Event {}
class DESTROY_TANK extends tedge.Event {}
class FIRE_BULLET extends tedge.ClientEvent {}
class DAMAGE_TANK extends tedge.Event {}
class GRAB_PICKUP extends tedge.Event {}
class DROP_PICKUP extends tedge.Event {}

//


