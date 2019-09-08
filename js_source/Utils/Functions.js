function ensureLoop( animation ) {

				for ( var i = 0; i < animation.hierarchy.length; i ++ ) {

					var bone = animation.hierarchy[ i ];

					var first = bone.keys[ 0 ];
					var last = bone.keys[ bone.keys.length - 1 ];

					last.pos = first.pos;
					last.rot = first.rot;
					last.scl = first.scl;

				}

			}

function conv3DtoScreen(_model,camera)
{
	var p, v, percX, percY, left, top;
	//p = _model.matrixWorld.getPosition().clone();
	var vector = new THREE.Vector3();
	//p = vector.getPositionFromMatrix(_model.matrixWorld);
	p = vector.setFromMatrixPosition(_model.matrixWorld);
	
  //  v = projector.projectVector(p, camera);
//	v = vector.project(p, camera);
	v = vector.project(camera);
	
	percX = (v.x + 1) / 2;
	percY = (-v.y + 1) / 2;


	left = percX * width;
	top = percY * height;
	
	return new THREE.Vector2(left,top);
}
function float2int (value) {
    return value | 0;
}
function returnExtension(path)
{
	
	var extension="";
	var currentChar;
	var i=1;
	
	

while (path.charAt(path.length-i)!=".")
	{
	currentChar=path.charAt(path.length-i);
	extension=currentChar+extension;
	i++;
	}

return extension;

}

var getSide = function ( x, y,image ) {

	var size = 1024;

	var canvas = document.createElement( 'canvas' );
	canvas.width = size;
	canvas.height = size;

	var context = canvas.getContext( '2d' );
	context.drawImage( image, - x * size, - y * size );

	return canvas;

};


function getIntersectionWithGround(event)
{
	event.preventDefault();
	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );

	vector.unproject( camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	var intersectss = raycaster.intersectObject( cm.env.model ); // sprawdzenie przeciecia sie kursora z podlozem


	if ( intersectss.length > 0 ) {                              // sprawdzanie ilosci miejsc przeciecia

		var tx = Math.round(intersectss[0].point.x*10)/10;
		var ty = Math.round(intersectss[0].point.y*10)/10;
		var tz = Math.round(intersectss[0].point.z*10)/10;	
	}
	return new THREE.Vector3(tx,ty,tz);
}

function getRandomTree()
{
	
}

function setAllObjectsAsNotPicked()
{
	for(var i=0; i<cm.staticObjects.length; i++)
	{				
		cm.staticObjects[i].setNotPicked();						
	}
	
	for(var i=0; i<cm.mros.length; i++)
	{				
		cm.mros[i].setNotPicked();						
	}
	
	for(var i=0; i<cm.npcs.length; i++)
	{				
		cm.npcs[i].setNotPicked();						
	}
	
	// TODO: zrobic ne tylko dla statycznych
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getIntersectionsWithStaticObjects(event)
{	
	event.preventDefault();

	var pickedObject=null;
	var intersections;
	var intersectss;
	
	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	vector.unproject( camera );
	
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	

	
 console.log("start of intersection");
/*for(var i=0; i<cm.staticMeshesForIntersection.length; i++)
	{
	console.log(cm.staticMeshesForIntersection[i]);
	}*/
 var found = false;
 
 // new shit
	 for(var i=0; i<cm.staticObjects.length; i++)	
	 {
		 intersections = raycaster.intersectObject( cm.staticObjects[i].model);
		 if(intersections.length > 0)
		 {
			 pickedObject=cm.staticObjects[i];
			 cm.staticObjects[i].setPicked();
			 found = true;
			 break;
		 }
	 }
	
	 if(!found)
	 {
		 for(var i=0; i<cm.npcs.length; i++)	
		 {
			 intersections = raycaster.intersectObject( cm.npcs[i].model);
			 if(intersections.length > 0)
			 {
				 pickedObject=cm.npcs[i];
				 cm.npcs[i].setPicked();
				 found = true;
				 break;
			 }
		 }
	 }
	 
	 if(!found)
	 {
		 for(var i=0; i<cm.mros.length; i++)	
		 {
			 intersections = raycaster.intersectObject( cm.mros[i].model);
			 if(intersections.length > 0)
			 {
				 pickedObject=cm.mros[i];
				 cm.mros[i].setPicked();
				 found = true;
				 break;
			 }
		 }
	 }
  
		return pickedObject;
}

function getIntersectionsWithObjects(event)
{	
	event.preventDefault();

	var pickedObject=null;
	var intersections;

	
	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
	vector.unproject( camera );
	
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	

	
 console.log("start of intersection");
/*for(var i=0; i<cm.staticMeshesForIntersection.length; i++)
	{
	console.log(cm.staticMeshesForIntersection[i]);
	}*/
 var found = false;
 var pickedObjectType="none";
 var intersectionPoint = new THREE.Vector3();
 var eindex;
 
 // new shit
	 for(var i=0; i<cm.staticObjects.length; i++)	
	 {
		 intersections = raycaster.intersectObject( cm.staticObjects[i].model);
		 if(intersections.length > 0)
		 {
			 pickedObject=cm.staticObjects[i];
			 
			 found = true;
			 pickedObjectType="static";
			 intersectionPoint.copy(pickedObject.position);
			 break;
		 }
	 }
	
	 if(!found)
	 {
		 for(var i=0; i<cm.npcs.length; i++)	
		 {
			 intersections = raycaster.intersectObject( cm.npcs[i].model);
			 if(intersections.length > 0)
			 {
				 pickedObject=cm.npcs[i];
				 
				 found = true;
				 pickedObjectType="npc";
				 intersectionPoint.copy(pickedObject.position);
				 break;
			 }
		 }
	 }

	 
	 if(!found)
	 {
		 intersections = raycaster.intersectObject( cm.env.model);
		 if(intersections.length > 0)
		 {
			 pickedObject=cm.env.model;
			 found = true;
			 pickedObjectType="ground";
			 intersectionPoint.x=Math.round(intersections[0].point.x*10)/10;
			 intersectionPoint.y=Math.round(intersections[0].point.y*10)/10;
			 intersectionPoint.z=Math.round(intersections[0].point.z*10)/10;
		 }
	 }
	 
  
		return {
			    type: pickedObjectType, 
			    object : pickedObject,  
			    position : intersectionPoint
			    };
}











