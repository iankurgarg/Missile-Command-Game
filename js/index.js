
var startTime	= Date.now();
var container, notifications;
var camera, scene, renderer, stats;
var skyboxMesh;
var env;


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
	env.addWeapon();
	
	env.addMissiles();
	env.addMissiles();
	env.addMissiles();
	env.addMissiles();
	env.addMissiles();

	document.addEventListener( 'mousedown', onMouseClick, false );
}

function animateMissile() {
	var missiles = env.getMissiles();
	for (var i = 0; i < missiles.length; i++) {
		var m = missiles[i];
		if (m.position.y > 0) {
			m.position.y -= 0.1;
			m.position.x += (m.rotation.z*0.1);	
		}

		env.checkCollisionWithBuildings(m);
		env.checkCollisionWithDefense(m);
	}

	var defense = env.getDefensive();
	for (var i = 0; i < defense.length; i++) {
		var m = defense[i];
		// if (m.position.y < 10) {
			var deltaX = 0.2/Math.sqrt(1 + m.slopez*m.slopez);
			if (m.slopez > 0) {
				m.position.y += deltaX*m.slopez;
				m.position.x += (deltaX);
			}
			else {
				m.position.y += (-deltaX)*m.slopez;
				m.position.x += (-deltaX);
			}
		// }
	}
}


function isGameOver() {
	if (env.total_max == 0 && env.getMissiles().length == 0) {
		alert("Game Over");
	}
}

function updateNotification() {
	notifications.textContent = "Ammo: " + env.ammo;
}


function onMouseClick(event) {
	event.preventDefault();
	// alert('hello');
	// alert(env.ammo);
	env.fireWeapon(event.clientX, event.clientY);
}


// ## Animate and Display the Scene
function animate() {
	// render the 3D scene
	render();
	animateMissile();
	updateNotification();
	// relaunch the 'timer' 
	requestAnimationFrame( animate );
}


// ## Render the 3D Scene
function render() {

	camera.position.y = 20;
	camera.position.z = 75;

	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}
