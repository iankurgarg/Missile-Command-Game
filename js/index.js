
var startTime	= Date.now();
var container, notifications, animation_frame_requester;
var camera, scene, renderer, stats;
var skyboxMesh;
var env;
var game_started = 0;


setUp();
updateElements();
animate();

function setUp() {
	// create the camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );

	var listener = new THREE.AudioListener();
	camera.add( listener );


	// var alight = new THREE.AmbientLight( 0x404040 ); // soft white light

	// create the Scene
	scene = new THREE.Scene();
	// scene.fog	= new THREE.FogExp2( 0xd0e0f0, 0.007 );
	// scene.add(alight);

	var plight = new THREE.PointLight( 'yellow', 1, 100 );
	plight.position.set( 0, 50, 50 );
	plight.shadow.mapSize.width = 512;  // default
	plight.shadow.mapSize.height = 512; // default
	plight.shadow.camera.near = 0.5;       // default
	plight.shadow.camera.far = 500      // default
	scene.add( plight );

	// var light	= new THREE.HemisphereLight( 0xfffff0, 0x101020, 1.25 );
	// light.position.set( 0.75, 1, 0.25 );
	// scene.add( light );

	// create the container element
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	notifications = document.getElementById('notifications');

	// init the WebGL renderer and append it to the Dom
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	

	env = new Environment(scene, camera, listener);
}

function updateElements() {
	env.createGround();
	env.createSky();
	env.fillBuildings();
	env.loadModels();
	env.addWeapon();
	
	env.addMissiles();
	env.addMissiles();
	env.addMissiles();
	env.addMissiles();
	env.addMissiles();

	document.addEventListener( 'mousedown', onMouseClick, false );

	document.addEventListener('keydown', handleKeyboardEvent, false);
}

function handleKeyboardEvent(event) {
  const keyName = event.key;
  event.preventDefault();
  if (keyName === ' ') {
  	game_started = 1;
    return;
  }

}

function animateMissile() {
	if (failed() || won()) {
		return;
	}
	env.addMissiles();


	env.updateExplosions();

	var missiles = env.getMissiles();

	var l = missiles.length - 1;
	while (l >= 0) {
		var m = missiles[l];
		if (m.position.y > 0) {
			m.position.y -= 0.1;
			m.position.x += ((m.rotation.z - Math.PI)*0.1);	
		}
		else {
			// reached ground. app explosion here
			env.destroyMissile(l);
		}

		if (!env.checkCollisionWithDefense(l)) {
			env.checkCollisionWithBuildings(l);	
		}
		
		l -= 1;
	}

	var defense = env.getDefensive();
	var l = defense.length - 1;
	while (l >= 0) {
		var m = defense[l];
		if (m.position.y < 70) {
			var deltaX = 0.2/Math.sqrt(1 + m.slopez*m.slopez);
			var deltaY = 0.0;
			if (m.slopez == Infinity) {
				deltaX = 0;
			}
			else if (m.slopez < 0) {
				deltaX = -deltaX;
			}
			else if (m.slopez == 0){
				if (m.rotation.z < 0) {
					deltaX = -deltaX;
				}
			}
			if (deltaX == 0) {
				deltaY = 0.2;
			}
			else {
				deltaY = deltaX*m.slopez;
			}

			m.position.y += (deltaY);
			m.position.x += (deltaX);

		}
		else {
			// out of range. stop rendering
			env.destroyDefense(l);
		}
		l -= 1;
	}
}


function won() {
	if (env.total_max == 0 && env.getMissiles().length == 0 && env.score > 0 && env.explosions.length == 0) {
		alert("Game Over. You win. Next Level will be added soon");
		cancelAnimationFrame(animation_frame_requester);
	}
}

function failed() {
	if ((env.lives == 0 || env.weapons.length == 0)  && env.explosions.length == 0) {
		alert ("Game Over. You Lost. Restart to play again");
		cancelAnimationFrame(animation_frame_requester);
	}
	else {
		if (env.total_max == 0 && env.getMissiles().length == 0 && env.score == 0) {
			alert ("Game Over. You Lost. Zero Score. Restart to play again");
			cancelAnimationFrame(animation_frame_requester);
		}
	}
}

// function to update the information about score and ammo and lives
function updateNotification() {
	notifications.textContent = "Ammo: " + env.ammo + "    Score: " + env.score + " Lives left:" + env.lives;
}


function onMouseClick(event) {
	event.preventDefault();
	// alert('hello');
	// alert(env.ammo);
	env.fireWeapon(event.clientX, event.clientY);
}

// ## Animate and Display the Scene
function animate() {
	animation_frame_requester = requestAnimationFrame( animate );
	// render the 3D scene
	render();
	if (game_started == 1) {
		animateMissile(); 
	}
	updateNotification();
	// relaunch the 'timer' 
}




// ## Render the 3D Scene
function render() {

	camera.position.y = 20;
	camera.position.z = 75;

	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}
