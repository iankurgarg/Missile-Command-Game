
function Environment(scene) {
	this.buildings = [];
	this.gound = null;
	this.missiles = [];
	this.scene = scene;

	this.fillBuildings = function () {
		for (var i = 0; i < 5; i++) {
			var b1 = this.createBuilding();
			b1.position.x = (Math.random() * 50) - 20;
			b1.position.z = (Math.random() * 20) - 10;
			b1.scale.x = (Math.random() * 5) + 5;
			b1.scale.y = (Math.random() * 15) + 10;
			b1.scale.z = (Math.random() * 5) + 5;

			this.buildings.push(b1);
			this.scene.add(b1);
		}
	}

	this.addMissiles = function () {

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
	this.createGround = function () {
		var grass = "https://iankurgarg.github.io/Missile-Command-Game/assets/grass.jpg";

		var texture = new THREE.TextureLoader().load(grass);
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set( 4, 4 );

		var geometry = new THREE.PlaneGeometry( 100, 50, 32 );
		var material = new THREE.MeshBasicMaterial( {map: texture, side: THREE.DoubleSide} );
		var ground = new THREE.Mesh( geometry, material );

		ground.rotation.x = -1.5;
		this.ground = ground;
		this.scene.add(ground);
		// return ground;
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
		    objLoader.load( 'weapon1.obj', 
		    function ( object ) {

		        object.position.x = -35;
				object.position.z = 20;
				object.rotation.y = 1.57;
				// object.rotation.x = 1.17;
				object.scale.x = 0.15;
				object.scale.y = 0.15;
				object.scale.z = 0.15;
				this.scene.add( object );

		    });

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








