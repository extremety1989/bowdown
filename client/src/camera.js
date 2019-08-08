import {PerspectiveCamera, Vector3, Raycaster} from 'three'
import {collidableEnvironment} from './scene'
import {player1} from './player1'

var distance = 3.5;

var camera = new PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 5;
var cameraTarget = new Vector3( 0, 1, 0 );
var cameraAnchor = camera.position.clone()
var theta = 0
var phi = 0

camera.nextPosition = function(dist) {
    if (player1!=null) {
        var nextPos = new Vector3();
        nextPos.x = cameraTarget.x + dist * Math.sin(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        nextPos.y = cameraTarget.y + dist * Math.sin(phi * Math.PI / 360);
        nextPos.z = cameraTarget.z + dist * Math.cos(theta * Math.PI / 360) * Math.cos(phi * Math.PI / 360);
        return nextPos
    }
}

camera.setPosition = function(nextPos) {
    camera.position.copy(nextPos)
}

camera.updateCamera = function() {
    if (player1!=null) {
        var p1 = player1
        var v = player1.scene.position.clone().sub(camera.position.clone())
        var v2 = new Vector3(-v.z, 0, v.x).normalize()
        console.log(v)
        cameraTarget.copy(player1.scene.position.clone().add(v2)).setY(player1.scene.position.y+1)
        
        var nextPos = camera.nextPosition(distance)

        // this ensures the camera doesn't go behind any meshes
        var ray = new Raycaster(cameraTarget, nextPos.clone().sub(cameraTarget).normalize(), 0, 5);
        var collisions = ray.intersectObjects(collidableEnvironment, true);
        if(collisions.length>0){
            nextPos = collisions[0].point
        }
        camera.setPosition(nextPos)
    }
    camera.lookAt(cameraTarget);
    camera.updateMatrix();
}

camera.moveCamera = function(movementX, movementY) {
    theta -= movementX * 0.2
    var x = phi + movementY * 0.2
    // this simply ensures the camera cannot go over the top/bottom
    // I have it set 10 135 and 80 because otherwise the camera gets all fucky but it's not the best solution
    if (135 >= x && x >= -80) {
        phi = x
    }
    camera.updateCamera();
}

export { camera, cameraTarget };