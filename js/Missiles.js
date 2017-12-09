
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
			m.position.x = -35;
			m.position.y = 0;
			m.position.z = 10;

			m.rotation.z = 0.5;
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