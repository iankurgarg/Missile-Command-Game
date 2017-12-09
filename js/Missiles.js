
function MissileGenerator(scene) {
	this.scene = scene;
	this.missiles = [];
	this.defense = [];
	this.max = 5;
	this.total_max = 10;
	this.ammo = 20;

	this.addMissiles = function() {
		if ((this.missiles.length) < this.max) {
			var m = this.createMissile();
			m.position.z = Math.random()*40 - 20;
			m.position.y = 70;
			m.position.x = Math.random()*40 - 20;
			m.rotation.z = Math.random()-0.5;

			this.missiles.push(m);
			this.scene.add(m);
			this.total_max -= 1;
		}
	}

	this.fire = function(x, y) {
		if (this.ammo > 0) {
			var m = this.createMissile();
			m.position.x = 0;
			m.position.y = 0;
			m.position.z = 10;

			var raycaster = new THREE.Raycaster();

			var vector = new THREE.Vector3(
		        ( event.clientX / window.innerWidth ) * 2 - 1,
		      - ( event.clientY / window.innerHeight ) * 2 + 1,
		      	0
		    );

		    var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 100000 );
		    camera.position = m.position;

		    raycaster.setFromCamera(vector, camera);

		    var intersects = raycaster.intersectObjects( this.scene.children );

		    alert(intersects);
		    intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
			intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
		    // alert( window.innerWidth + " " +  window.innerHeight);
		    // var dir = raycaster.ray.direction;
			// m.rotation.z = ray.y/ray.x;
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

	this.createMissile = function () {
		var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 5, 32 );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );
		var material = new THREE.MeshBasicMaterial( {color: 'red'} );
		var cylinder = new THREE.Mesh( geometry, material );
		return cylinder;
	}
}