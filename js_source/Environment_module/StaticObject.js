function StaticObject(modelPath, texturePath)
{
	var so = this;
	this.model;
	this.modelPath=modelPath;
	this.texturePath=texturePath;
	this.loader = new THREE.JSONLoader();
	this.DDSloader = new THREE.DDSLoader();
	this.loaded_texture;
	this.gamemode=true;
	this.scale=new THREE.Vector3(1,1,1);
	this.rotation = new THREE.Vector3(0,0,0);
	this.position = new THREE.Vector3(0,0,0);
	this.bbcolor=Math.random() * 0xffffff;
	this.bbhelper;
	this.materialType;

	
	
	this.initialize = function()
	{

		if(this.texturePath!="")
		{
			cm.addObiectToCounter(2); //texture + 1 model
		}
		else
		{
			cm.addObiectToCounter(1); // no texture or merged with model file

		}
		console.log("added: "+this.texturePath + " and model");
	}
	
	this.initialize();
	
	var generateSOLoadedCallback = function(path)
	{
		return function() {


			cm.objectLoaded(path);


		}
	}
	
	var generateStaticObjectLoadCallback = function ( texture ) {

		return function( geometry, materials ) {
			
			
			var mesh1;
			//console.log("==loading: "+texture);
			
			if(texture!=null)
			{
				
				var material = new THREE.MeshLambertMaterial ({
					map:  texture
					

				});
				
				//material.map.wrapS=THREE.RepeatWrapping;
				//material.map.wrapT=THREE.RepeatWrapping;
				//material.side = THREE.DoubleSide;
				material.transparent = true;
				
			
				
				 mesh1 = new THREE.Mesh(
						geometry,
						material
				);
				 so.materialType="lambert";

			}
			else
			{
				for(var i=0; i<materials.length; i++)
				{
				materials[i].map.wrapS=THREE.RepeatWrapping;
				materials[i].map.wrapT=THREE.RepeatWrapping;
				materials[i].side = THREE.DoubleSide;
				materials[i].transparent = true;
				}
			
			mesh1 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			 so.materialType="faced";

			}
			
			//mesh1.doubleSided = true;
			mesh1.geometry.computeTangents();
			//mesh1.rotation.y = Math.PI/5;
			mesh1.scale.copy( so.scale);
			mesh1.rotation.set(so.rotation.x, so.rotation.y, so.rotation.z);
			mesh1.castShadow = true;
			mesh1.receiveShadow = true;
			mesh1.position.set(so.position.x, so.position.y, so.position.z);
			mesh1.updateMatrix();
			//so.model=mesh1;
			if(so.gamemode)
			{
				
			    

				//so.bb = new THREE.Box3(so.bbhelper.box.min, so.bbhelper.box.max);
				
				//console.log("gora to: "+aktor.bb.max.y+" dol to:" +aktor.bb.min.y);
				
				
				so.model=mesh1;
				scene.add(mesh1);
				
				so.bbhelper = new THREE.BoundingBoxHelper( so.model, so.bbcolor ); 
				//console.log(so.bbhelper);
			    so.bbhelper.update(); 
	
				cm.objectLoaded("static object");
				
			}
			else
			{
				sceneIntro.add(mesh1);
			}
			
		}

	}
	this.setScaleAndRotation = function(scale,rotation)
	{
		this.scale.copy(scale);
		this.rotation.copy(rotation);
	}
	this.setPicked=function()
	{
		switch( this.materialType)
		{
		case "lambert":
			this.model.material.emissive.setHex( 0x00ff00 );
			break;
		case "faced":
			for(var i=0;i<this.model.material.materials.length; i++)
				{
				this.model.material.materials[i].emissive.setHex( 0x00ff00 );
				}
			break;
		default:
			break;
		}
		this.bbhelper.material.color.setHex(0xffffff);
	}
	this.setNotPicked=function()
	{
		switch( this.materialType)
		{
		case "lambert":
			this.model.material.emissive.setHex( 0x000000 );
			break;
		case "faced":
			
			for(var i=0;i<this.model.material.materials.length; i++)
				{
				this.model.material.materials[i].emissive.setHex( 0x000000 );
				}
			break;
		default:
			break;
		}
		if(this.bbhelper!=null)
		{
			this.bbhelper.material.color.setHex(this.bbcolor);
		}
	}
	
	this.showBoundingBox = function()
	{
		so.bbhelper.update(); 
		scene.add( this.bbhelper );	
	}
	this.remove = function()
	{
		cm.removeObjectFromContentManager(this, "static");
		scene.remove(this.model);
		scene.remove(this.bbhelper);
	}
	this.rotate = function(value)
	{
		this.model.rotation.y+=value;
		console.log("changed rotation value to: "+this.model.rotation.y+" , z tej zmiennej: "+value);
		this.bbhelper.update();
	}
	this.moveY = function(value)
	{
		this.model.position.y+=value;
		this.bbhelper.update();
	}
	this.moveX = function(value)
	{
		this.model.position.x+=value;
		this.bbhelper.update();
	}
	this.moveZ = function(value)
	{
		this.model.position.z+=value;
		this.bbhelper.update();
	}
	this.load = function()
	{
		if(this.texturePath!="")
		{
			switch(this.texturePath.charAt(this.texturePath.length-3)+this.texturePath.charAt(this.texturePath.length-2)+this.texturePath.charAt(this.texturePath.length-1))
			{
			case "dds": 
				this.loaded_texture = this.DDSloader.load(this.texturePath, generateSOLoadedCallback(this.texturePath));
				break;

			default:
				this.loaded_texture = THREE.ImageUtils.loadTexture(this.texturePath, cm.objectLoaded("dupa"));
			break;

			}
			this.loaded_texture.anisotropy = 4;
			this.loaded_texture.wrapS = this.loaded_texture.wrapT = THREE.RepeatWrapping; 
			
		}

		
		this.loader.load( this.modelPath, generateStaticObjectLoadCallback(this.loaded_texture));
		
		
	}


}