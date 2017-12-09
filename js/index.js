
var startTime	= Date.now();
var container;
var camera, scene, renderer, stats;
var skyboxMesh;


init();
animate();

function init() {
	// create the camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );

	// create the Scene
	scene = new THREE.Scene();
		
	// add ground
	var ground = createGround();
	scene.add( ground );
	ground.rotation.x = -1.5;

	// create the container element
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// init the WebGL renderer and append it to the Dom
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	
	// create buildings
	fillBuildings(5);
}

function fillBuildings(n) {

	for (var i = 0; i < n; i++) {
		var b1 = createBuilding();
		b1.position.x = (Math.random() * 50) - 20;
		b1.position.z = (Math.random() * 20) - 10;
		b1.scale.x = (Math.random() * 5) + 5;
		b1.scale.y = (Math.random() * 15) + 10;
		b1.scale.z = (Math.random() * 5) + 5;

		scene.add(b1);
	}
}

// function to create building
function createBuilding() {
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );

	geometry.faces.splice( 7, 1 );
	geometry.faces.splice( 6, 1 );
	
	geometry.faceVertexUvs[0].splice( 7, 1 );
	geometry.faceVertexUvs[0].splice( 6, 1 );

	geometry.faceVertexUvs[0][4][0].set( 0, 0 );
	geometry.faceVertexUvs[0][4][1].set( 0, 0 );
	geometry.faceVertexUvs[0][4][2].set( 0, 0 );

	geometry.faceVertexUvs[0][5][0].set( 0, 0 );
	geometry.faceVertexUvs[0][5][1].set( 0, 0 );
	geometry.faceVertexUvs[0][5][2].set( 0, 0 );

	var topColor = new THREE.Color( 0xffffff );
	var bottomColor = new THREE.Color( 'pink' );

	var baseColor2   = new THREE.Color().setRGB( 0.90, 0.70, 0.70 );
	
	for ( var j = 0; j < geometry.faces.length; j ++ ) {
	  if ( j === 4 || j == 5 ) {
	      geometry.faces[ j ].vertexColors = [ baseColor2, baseColor2, baseColor2];
	  } else {
	      if (j%2 == 0) {
	      	geometry.faces[ j ].vertexColors = [ topColor, bottomColor, topColor ];
	      }
	      else {
	      	geometry.faces[ j ].vertexColors = [ bottomColor, bottomColor, topColor ];	
	      }
	      
	  }
	}
	var building = "https://iankurgarg.github.io/Missile-Command-Game/assets/building.png";

	var texture       = new THREE.TextureLoader().load(building);
	texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
	texture.needsUpdate    = true;

	var material  = new THREE.MeshBasicMaterial({
	  map     : texture,
	  vertexColors    : THREE.VertexColors
	});

	var buildingMesh = new THREE.Mesh( geometry, material );
	return buildingMesh;
}

// function to create ground
function createGround() {
	var grass = "https://iankurgarg.github.io/Missile-Command-Game/assets/grass.jpg";

	var texture = new THREE.TextureLoader().load(grass);
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 4, 4 );

	var geometry = new THREE.PlaneGeometry( 100, 50, 32 );
	var material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
	var ground = new THREE.Mesh( geometry, material );
	return ground;
}

// ## Animate and Display the Scene
function animate() {
	// render the 3D scene
	render();
	// relaunch the 'timer' 
	requestAnimationFrame( animate );
}


// ## Render the 3D Scene
function render() {

	camera.position.y = 30;
	camera.position.z = 75;

	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}
