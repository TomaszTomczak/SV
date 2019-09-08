function MultipleRandomObject(modelsPaths, count, start_position, radius, cached_textures, cached_alpha_maps)
{
	
	var mro = this;
	this.count = count;
	this.radius = radius;
	this.modelsPaths = modelsPaths;
	this.textures = cached_textures;
	this.alphaMaps = cached_alpha_maps;
	this.position = start_position || new  THREE.Vector3(0,0,0);

	//this.models = [];
	this.model;
	this.i=0;
	this.step=0;
	// new shit
	this.objectsProperties = [];
	
	
	this.initialize = function()
	{
		for(var i=0; i<this.count; i++)
			{
			    var min_size = 0.35;
			    var max_size = 1.0;
				
				var x = getRandomInt(Math.round(this.position.x-this.radius),Math.round(this.position.x+this.radius)); 
				var z = getRandomInt(Math.round(this.position.z-this.radius),Math.round(this.position.z+this.radius)); 
							
				
				
				var temp_pos = new THREE.Vector3(x,0,z);
				
				//console.log("losowy x: "+x+" losowy z: "+z);
				var s = max_size - ( (temp_pos.length()*(1-min_size))/Math.sqrt(this.radius*this.radius)); // moja wlasna funkcja pisana po pijaku
				s = getRandomArbitrary(s,s+0.4);
				this.objectsProperties.push({ model_path : this.modelsPaths[getRandomInt(0,this.modelsPaths.length-1)].model_path,
											  texture    : this.textures[getRandomInt(0, this.textures.length-1)],
											  alpha_map  : this.alphaMaps[getRandomInt(0,this.alphaMaps.length-1)],
											  position   : new THREE.Vector3(x,0,z),
											  scale      : s
					
				});
				//console.log("no wiec. temp pos: "+temp_pos.length()+" max this.radius "+this.radius);
				//console.log("x: "+x+" z: "+z+" ");

				
				
				
				
			
			}
		
	}

	this.setPicked=function()	
	{
		for(var i=0;i<this.model.material.materials.length; i++)
		{
			this.model.material.materials[i].emissive.setHex( 0x00ff00 );
		}
	}
	this.setNotPicked=function()
	{
		for(var i=0;i<this.model.material.materials.length; i++)
		{
			this.model.material.materials[i].emissive.setHex( 0x000000 );
		}
	}
	
	this.sort = function()
	{
		this.objectsProperties.sort(function(object1, object2){
		    return object1.position.z < object2.position.z ;
		});
	}
	this.rotate = function(value)
	{
		this.model.rotation.y+=value;

	}
	this.moveY = function(value)
	{
		this.model.position.y+=value;

	}
	this.moveX = function(value)
	{
		this.model.position.x+=value;

	}
	this.moveZ = function(value)
	{
		this.model.position.z+=value;

	}
	this.remove = function()
	{
			cm.removeObjectFromContentManager(this.model, "grass");
			scene.remove(this.model);

	}
	this.load = function()
	{
		var materials = [];
		var totalGeometry = new THREE.Geometry();
		var tmpMat;
		
		for(var i=0; i<this.count; i++)
			{
			
			var mesh1;
			var geometry = cm.getCachedGeometryByPath(this.objectsProperties[i].model_path);
			
			tmpMat = new THREE.MeshLambertMaterial ({
					map:  this.objectsProperties[i].texture,
					alphaMap: this.objectsProperties[i].alpha_map,
					alphaTest: 0.2
				});
			//tmpMat.depthTest=false;
			tmpMat.depthWrite=false;
			//console.log(this.preparedTextures[i]);

			tmpMat.transparent = true;
			materials.push(tmpMat);
			
			mesh1 = new THREE.Mesh(
					geometry,
					tmpMat
				);
			mesh1.geometry.computeTangents();
			mesh1.doubleSided=true;
			mesh1.position.set(this.objectsProperties[i].position.x, this.objectsProperties[i].position.y, this.objectsProperties[i].position.z);
			mesh1.scale.set(this.objectsProperties[i].scale,this.objectsProperties[i].scale,this.objectsProperties[i].scale);
			mesh1.updateMatrix();	
			totalGeometry.merge( mesh1.geometry, mesh1.matrix, i );
			//THREE.GeometryUtils.merge(this.mergedGeometry, mesh1);
			//
			
			}
		
		
		this.model = new THREE.Mesh(totalGeometry, new THREE.MeshFaceMaterial(materials));
		
		console.log(this.model);
		this.model.doubleSided = true;
		this.model.geometry.computeTangents();
		scene.add(this.model);
		/*
		for(var i=0; i<this.count; i++)
		{			 
			loader.load(this.preparedModelsPath[i],
					    generateMultiObjectLoadCallback(this.preparedTextures[i],
					    		                        this.modelsPositions[i], 
					    		                        this.modelsScales[i], 
					    		                        this.preparedAlphaMaps[i] ));
			
		}

		;*/
		cm.mros.push(this);
	}
	
	this.setOnPosition=function(position)
	{
		/*for(var i=0; i<this.models.length; i++)
			{
			this.models[i].position.x = position.x+this.modelsPositions[i].x;
			this.models[i].position.z = position.z+this.modelsPositions[i].z;
			}
			*/
		this.model.position.x=position.x;
		this.model.position.z=position.z;
		this.position.x = position.x;
		this.position.z = position.z;
		
	}
	
	this.update = function()
	{
		this.step++;

			this.i+=0.03;
			this.model.position.x+=Math.sin(this.i)/8;

		
		/*var angle = Math.atan2(camera.position.z-this.position.z, camera.position.x-this.position.x)*180/Math.PI - 90;
		
		for(var i=0; i<this.models.length; i++)
			{
			

			   //console.log("kat to: "+angle);
			   //console.log("kat rzeczywisty to: "+Math.atan2(bz-this.model.position.z, bx-this.model.position.x)*180/Math.PI)
			  this.models[i].rotation.y=(-angle*Math.PI)/180;
			
			//this.model.rotation.setFromRotationMatrix( camera.matrix );
			}*/
	}
	
	
	var generateMultiObjectLoadCallback = function ( texture, position, scale, alpha_map ) {console.log("OLD");}

}