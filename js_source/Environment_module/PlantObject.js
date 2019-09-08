// TODO: ten obiekt chyba nie jest wykorzystywany

function PlantObiect(modelPath, texturePath, alphaMapPath)
{
	var po = this;
	this.model;
	
	this.modelPath=modelPath;
	this.texturePath=texturePath;
	this.alphaMapPath=alphaMapPath;
	
	this.loader = new THREE.JSONLoader();
	this.DDSloader = new THREE.DDSLoader();
	this.loaded_texture;
    this.alphaMapTexture;
	this.scale=1;
	this.position = new THREE.Vector3(0,0,0);
	this.objectsToLoad=0;

	
	
	this.initialize = function()
	{

		if(this.modelPath!="")
		{
			this.objectsToLoad++;
		}

		if(this.texturePath!="")
		{
			this.objectsToLoad++;
		}

		if(this.alphaMapPath!="")
		{
			this.objectsToLoad++;
		}

		cm.addObiectToCounter(this.objectsToLoad); // no texture or merged with model file

		
	}
	
	this.initialize();
	
	var generatePlantObjectLoadCallback = function ( texture, alphaMap ) {

		return function( geometry, materials ) {


			var mesh1;


				var material = new THREE.MeshLambertMaterial ({
					map:  texture,
					alphaMap: alphaMap,
					alphaTest: 0.01

				});

				material.map.wrapS=THREE.RepeatWrapping;
				material.map.wrapT=THREE.RepeatWrapping;
				material.side = THREE.DoubleSide;
				material.transparent = true;

				mesh1 = new THREE.Mesh(
						geometry,
						material
				);



			//mesh1.doubleSided = true;
			mesh1.geometry.computeTangents();
			//mesh1.rotation.y = Math.PI/5;
			mesh1.scale.set(po.scale, po.scale, po.scale);
			mesh1.castShadow = false;
			mesh1.receiveShadow = true;
			mesh1.position.set(po.position.x, po.position.y, po.position.z);
			mesh1.updateMatrixWorld( true );
			po.model=mesh1;
			scene.add(mesh1);		
			cm.objectLoaded();
			console.log(mesh1);
			getColor(558,479);


		}

	}
	
	var getColor = function(x,y) {
		  var img = new Image();
		  console.log("tworzymy tworzomy");
		  img.src = 'asset/textures/grassmap_texture.jpg';
		  img.onload = function() {

		    //var xyCoords = convertVector3ToXY(point);
		    // create a canvas to manipulate the image
		    var canvas = document.createElement('canvas');
		    canvas.width = img.width;
		    canvas.height = img.height;
		    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
		    // get the pixel data and callback
		    var pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
		    console.log("tpixel data to:");
		    console.log("R: "+pixelData[0]+" G: "+pixelData[1]+" B: "+pixelData[2]);
		    //callback(pixelData);
		  }
		};
	
	this.update = function()
	{
		if(this.model!=null){
		//this.model.rotation.y += 0.003;
			//console.log(this.model.rotation);
			
			 //  var angle = Math.atan2(camera.position.z-this.model.position.z, camera.position.x-this.model.position.x)*180/Math.PI - 90;

			   //console.log("kat to: "+angle);
			   //console.log("kat rzeczywisty to: "+Math.atan2(bz-this.model.position.z, bx-this.model.position.x)*180/Math.PI)
			  // this.model.rotation.y=(-angle*Math.PI)/180;
			
			//this.model.rotation.setFromRotationMatrix( camera.matrix );
		}
		
		
	}
	this.load = function()
	{
		
			switch(returnExtension(this.texturePath))
			{
			case "dds": 
				this.loaded_texture = this.DDSloader.load(this.texturePath, cm.objectLoaded());
				break;

			default:
				this.loaded_texture = THREE.ImageUtils.loadTexture(this.texturePath, cm.objectLoaded());
			break;

			}
			
			if(this.alphaMapPath!="")
			{
				switch(returnExtension(this.alphaMapPath))
				{
				case "dds": 
					this.alphaMapTexture = this.DDSloader.load(this.alphaMapPath, cm.objectLoaded());
					break;

				default:
					this.alphaMapTexture = THREE.ImageUtils.loadTexture(this.alphaMapPath, cm.objectLoaded());
				break;

				}
			}
				
		this.loader.load( this.modelPath, generatePlantObjectLoadCallback(this.loaded_texture, this.alphaMapTexture));
		
		
	}


}