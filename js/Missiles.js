
function MissileGenerator(scene) {
	this.scene = scene;
	this.missiles = [];
	this.max = 5;
	this.total_max = 10;

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

	this.getMissiles = function() {
		return this.missiles;
	}

	this.createMissile = function () {
		var geometry = new THREE.CylinderGeometry( 0.5, 0.5, 5, 32 );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );
		var material = new THREE.MeshBasicMaterial( {color: 'green'} );
		var cylinder = new THREE.Mesh( geometry, material );
		return cylinder;
	}
}