
function Environment(scene, camera, audio_listener) {
	this.buildings = [];
	this.gound = null;
	this.sky = null;
	this.missiles = [];
	this.scene = scene;
	this.camera = camera;
	this.plane = null;
	
	// objects to store ascending and descending missiles
	this.missiles = [];
	this.defense = [];
	this.weapons = [];
	this.explosions = [];
	
	// z of the plane where 'playing' happens. will change the location of the buildings
	this.planez = 10;
	
	// audio listener to load audio files 
	this.audio_listener = audio_listener;


	// max number of descending missiles at any point
	this.max = 5;
	// max number of missiles that will descend in current level
	this.total_max = 10;

	// ammo left
	this.ammo = 20;
	// score
	this.score = 0;
	// lives left.
	this.lives = 3;


	this.fillBuildings = function () {
		this.addBuilding(-30, -10, 7.5, 20);
		this.addBuilding(30, -20, 7.5, 40);
		this.addBuilding(-50, -10, 7.5, 15);
		this.addBuilding(-30, -70, 7.5, 20);
		this.addBuilding(20, -40, 7.5, 20);
		this.addBuilding(20, -40, 7.5, 60);
		this.addBuilding(-10, -40, 7.5, 20);

		this.addBuilding(-30, this.planez, 7.5, 20);
		this.addBuilding(30, this.planez, 7.5, 40);
		this.addBuilding(-50, this.planez, 7.5, 15);
		this.addBuilding(-70, this.planez, 7.5, 20);
		this.addBuilding(70, this.planez, 7.5, 60);
		this.addBuilding(10, -this.planez, 7.5, 20);
		this.addBuilding(0, -this.planez, 7.5, 20);
	}

	this.loadSounds = function() {
		var sound = new THREE.Audio( this.audio_listener );

		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( 'sounds/ambient.ogg', function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( false );
			sound.setVolume( 0.5 );
			sound.play();
		});
	}

	this.addMissiles = function() {
		if ((this.missiles.length) < this.max && this.total_max > 0) {
			var m = this.createMissile('red');
			m.position.z = this.planez;
			m.position.y = 70;
			m.position.x = Math.random()*60 - 30;
			m.rotation.z = Math.random()-0.5;

			this.missiles.push(m);
			this.scene.add(m);
			this.total_max -= 1;
		}
	}

	this.destroyMissile = function(i) {
		this.scene.remove(this.missiles[i]);
		this.ExplodeAnimation(this.missiles[i].position.x, this.missiles[i].position.y);
		this.missiles.splice(i, 1);
	}

	this.destroyDefense = function(i) {
		this.scene.remove(this.defense[i]);
		this.defense.splice(i, 1);
	}

	this.destroyBuilding = function(i) {
		this.scene.remove(this.buildings[i]);
		this.buildings.splice(i, 1);
	}

	this.fireWeapon = function(x, y) {
		if (this.ammo > 0) {
			var m = this.createMissile('green');
			m.position.z = this.planez;

			var raycaster = new THREE.Raycaster();

			var vector = new THREE.Vector3(
		        ( x / window.innerWidth ) * 2 - 1,
		      - ( y / window.innerHeight ) * 2 + 1,
		      	0.5
		    );

		    vector.unproject(this.camera);
		    raycaster.set(this.camera.position, vector.sub(this.camera.position).normalize());

		    var intersects = raycaster.intersectObject( this.plane );
		    
		    var dir = intersects[0].point.sub(m.position);
		    
			m.rotation.z = Math.tanh(Math.abs(dir.y/dir.x)) - Math.PI/2;
			m.slopez = dir.y/dir.x;
			if (dir.x < 0) {
				if (dir.y > 0) {
					m.rotation.z = -m.rotation.z;
				}
				else {
					m.rotation.z = - Math.PI/2;
					m.slopez = 0;
				}
			}
			else {
				if (dir.y < 0) {
					m.rotation.z = Math.PI/2;
					m.slopez = 0;
				}
			}
			// console.log(dir.x + ", " + dir.y);
			if (Math.abs(dir.x) < 3) {
				m.rotation.z = 0;
				m.slopez = Infinity;
			}
			
			this.ammo -= 1;
			this.defense.push(m);
			this.scene.add(m);
		}
	}

	this.getMissiles = function() {
		return this.missiles;
	}

	this.getDefensive = function() {
		return this.defense;
	}

	this.createMissile = function (c) {
		var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 5, 32 );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );
		var material = new THREE.MeshBasicMaterial( {color: c} );
		var cylinder = new THREE.Mesh( geometry, material );
		return cylinder;
	}

	this.addBuilding = function(x, z, scalex, scaley) {
		var b1 = this.createBuilding();
		b1.position.x = x;
		b1.position.z = z;
		b1.scale.x = scalex;
		b1.scale.y = scaley;
		b1.scale.z = scalex;

		this.buildings.push(b1);
		this.scene.add(b1);
	}

	this.checkCollisionWithBuildings = function(i) {
		var missile = this.missiles[i];

		var mbox = new THREE.Box3();
		mbox.setFromObject(missile);
		var l = this.buildings.length - 1;
		while (l >= 0) {
			var b = this.buildings[l];
			var box = new THREE.Box3();
			box.setFromObject(b);
			if (box.intersectsBox(mbox)){
				console.log('collission with building');
				this.destroyBuilding(l);
				this.destroyMissile(i);
				this.lives -= 1;
				return true;
			}
			l -= 1;
		}
		return false;
	}

	this.checkCollisionWithDefense = function(i) {
		var missile = this.missiles[i];

		var mbox = new THREE.Box3();
		mbox.setFromObject(missile);
		var l = this.defense.length - 1;
		while (l >= 0) {
			var b = this.defense[l];
			var box = new THREE.Box3();
			box.setFromObject(b);
			if (box.intersectsBox(mbox)){
				console.log('collission with defense');
				this.scene.remove(b);
				this.defense.splice(l, 1);
				
				this.destroyDefense(l);
				this.destroyMissile(i);

				this.score += 10;
				return true;
			}
			l -= 1;
		}
		return false;
	}

	// function to create building
	this.createBuilding = function () {
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

		var topColor = new THREE.Color( 'white' );
		var colors = ['brown', 'black', 'pink', 'orange', 'red']

		var bottomColor = new THREE.Color( colors[Math.floor(Math.random()*colors.length)] );

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

	this.createSky = function() {
		var sky = "https://iankurgarg.github.io/Missile-Command-Game/assets/sky.jpg";

		var texture = new THREE.TextureLoader().load(sky);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 1, 1 );

		var geometry = new THREE.PlaneGeometry( 400, 135, 32 );
		var material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
		var sky = new THREE.Mesh( geometry, material );

		sky.position.z = -70;
		sky.position.y = 70;
		this.sky = sky;
		this.scene.add(sky);

		plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 8, 8), 
		   new THREE.MeshBasicMaterial( {
		       color: 0x248f24, alphaTest: 0, visible: false
		}));
		plane.position.z = this.planez;
		this.scene.add(plane);
		this.plane = plane;
	}

	// function to create ground
	this.createGround = function () {
		var grass = "https://iankurgarg.github.io/Missile-Command-Game/assets/grass.jpg";

		var texture = new THREE.TextureLoader().load(grass);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 4, 4 );

		var geometry = new THREE.PlaneGeometry( 400, 100, 32 );
		var material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
		var ground = new THREE.Mesh( geometry, material );

		ground.position.z = -20;
		ground.rotation.x = -1.5;
		this.ground = ground;
		this.scene.add(ground);
		// return ground;
	}

	this.ExplodeAnimation = function (x,y)
	{
		var geometry = new THREE.Geometry();
		dirs = [];

		var movementSpeed = 1;
		var totalObjects = 100;
		var objectSize = 0.5;
		var colors = [0xFF0FFF, 0xCCFF00, 0xFF000F, 0x996600, 0xFFFFFF];

		for (i = 0; i < totalObjects; i ++) 
		{ 
			var vertex = new THREE.Vector3();
			vertex.x = x;
			vertex.y = y;
			vertex.z = this.planez;

			geometry.vertices.push( vertex );
			dirs.push({x:(Math.random() * movementSpeed)-(movementSpeed/2),y:(Math.random() * movementSpeed)-(movementSpeed/2),z:(Math.random() * movementSpeed)-(movementSpeed/2)});
		}
		var material = new THREE.ParticleBasicMaterial( { size: objectSize,  color: 'orange' });
		var particles = new THREE.ParticleSystem( geometry, material );

		var explosion = particles;
		explosion.ecount = 0;
		explosion.estatus = true;
		explosion.dirs = dirs;
		this.explosions.push(explosion);
		this.scene.add(explosion);
	  
	}

	this.updateExplosions = function(){
		var l = this.explosions.length-1;
		while(l >= 0) {
			var a = this.updateExplosion(l);
			if (!a) {
				this.explosions.splice(l, 1);
			}
			l -=1;
		}
	}

	this.updateExplosion = function(i){
		var exp = this.explosions[i];
		if (exp.ecount < 100) {
			exp.ecount += 1;
			if (exp.ecount %10 == 0) {
				var pCount = exp.dirs.length;
				while(pCount--) {
					var particle =  exp.geometry.vertices[pCount];
					particle.y += exp.dirs[pCount].y;
					particle.x += exp.dirs[pCount].x;
					particle.z += exp.dirs[pCount].z;
				}
				exp.geometry.verticesNeedUpdate = true;
			}
			return true;
		}
		else {
			exp.estatus = false;
			this.scene.remove(exp);
			return false;
		}
	}

	this.loadObjectCallback = function ( object ) {

        // object.position.x = -35;
		object.position.z = 20;
		object.rotation.y = 1.57;
		// object.rotation.x = 1.17;
		object.scale.x = 0.15;
		object.scale.y = 0.15;
		object.scale.z = 0.15;
		this.scene.add( object );
		this.weapons.push(object);

    }

	// add weapon
	this.addWeapon = function () {
		// THREE.ImageUtils.crossOrigin = '';
		var mtlLoader = new THREE.MTLLoader();
		mtlLoader.setCrossOrigin('');
		// mtlLoader.setBaseUrl('https://iankurgarg.github.io/Missile-Command-Game/assets/models/');
		// mtlLoader.setPath('https://iankurgarg.github.io/Missile-Command-Game/assets/models/');
		// var url = 'https://iankurgarg.github.io/Missile-Command-Game/assets/models/weapon1.mtl';
		// mtlLoader.load( 'https://iankurgarg.github.io/Missile-Command-Game/assets/models/' + 'weapon1.mtl', function( materials ) {

		    // materials.preload();

		    var objLoader = new THREE.OBJLoader();
		    // objLoader.setMaterials( materials );
		    objLoader.setPath('https://iankurgarg.github.io/Missile-Command-Game/assets/models/');
		    objLoader.load( 'weapon1.obj', this.loadObjectCallback);

		// });


		// var loader = new THREE.OBJLoader();
		// loader.load(
		// // resource URL
		// 'https://iankurgarg.github.io/Missile-Command-Game/assets/models/weapon1.obj',
		// // called when resource is loaded
		// function ( object ) {
		// 	object.position.x = -30;
		// 	object.position.z = 10;
		// 	object.rotation.y = 1.57;
		// 	object.rotation.x = 1.17;
		// 	object.scale.x = 0.2;
		// 	object.scale.y = 0.2;
		// 	object.scale.z = 0.2;
		// 	scene.add( object );

		// });
	}
}
