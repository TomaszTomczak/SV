/**
 * 
 */

function ModelsLoader()
{
	var scope = this;
	this.loader = new THREE.JSONLoader();
	this.DDSloader1 = new THREE.DDSLoader();
    this.loaded_texture;
	this.texture;

	// callback aby domknac zmienne -> google: variable closures
	var generateCallback = function ( loaded_texture, container ) {

		return function( geometry ) {


			var material = new THREE.MeshLambertMaterial ({
				map:  loaded_texture

			});

			
			var mesh1 = new THREE.Mesh(
					geometry,
					material
			);
			mesh1.geometry.computeTangents();
			//mesh1.rotation.y = Math.PI/5;
			mesh1.scale.set(1, 1, 1);
			mesh1.castShadow = true;
			mesh1.receiveShadow = true;

			scene.add(mesh1);
			
				if(container!=null)
				{
					container.push(mesh1);
				}

		

		}

	}
	
	// loading models with texture from path
	this.Load = function(model_path, texture_path, scene, container)
	{
	
		
		//var texture_path_extension = 
		
		switch(texture_path.charAt(texture_path.length-3)+texture_path.charAt(texture_path.length-2)+texture_path.charAt(texture_path.length-1))
		{
		case "dds": 
			this.loaded_texture = this.DDSloader1.load(texture_path);
			break;
		
		default:
			this.loaded_texture = THREE.ImageUtils.loadTexture(texture_path);
			break;
		
		}
		
		
		this.loader.load( model_path, generateCallback(this.loaded_texture,container));

	};
	// loading models with textures from model js file
	this.LoadWithoutTexPath = function(model_path, scene, container)
	{
		
		this.loader.load( model_path, function (geometry, materials) {
			
			//console.log(materials);
			for(var i=0; i<materials.length; i++)
				{
				materials[i].map.wrapS=THREE.RepeatWrapping;
				materials[i].map.wrapT=THREE.RepeatWrapping;
				materials[i].side = THREE.DoubleSide;
				materials[i].transparent = true;
				}

			
			mesh1 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			mesh1.doubleSided = true;
			mesh1.geometry.computeTangents();
			//mesh1.rotation.y = Math.PI/5;
			mesh1.scale.set(1, 1, 1);
			mesh1.castShadow = true;
			mesh1.receiveShadow = true;
			mesh1.updateMatrix();
			scene.add(mesh1);
			
				if(container!=null)
				{
					container.push(mesh1);
				}

		});

	};
	
	
	
	this.Load_wCustomShader = function(model_path, scene, material01, container)
	{
	    
	
		this.loader.load( model_path, function (geometry) {
			
			var wireframep=false;
	    	geometry.verticesNeedUpdate = true;
			geometry.elementsNeedUpdate = true;
			geometry.morphTargetsNeedUpdate = true;
			geometry.uvsNeedUpdate = true;
			geometry.normalsNeedUpdate = true;
			geometry.colorsNeedUpdate = true;
			geometry.tangentsNeedUpdate = true;
			var mesh1;
			
			
				mesh1 = new THREE.Mesh(
						geometry,
						material01
				);
			

		
			
			//mesh1.rotation.y = Math.PI/5;
			mesh1.scale.set(1, 1, 1);
			mesh1.castShadow = true;
			mesh1.receiveShadow = true;
			mesh1.geometry.computeTangents();
			scene.add(mesh1);
			
				if(container!=null)
				{
					container.push(mesh1);
				}

		});

	};
	
	this.Load_wCustomShaderToObject = function(model_path, scene, material, object)
	{
	
		this.loader.load( model_path, function (geometry) {
			

			var mesh1 = new THREE.Mesh(
					geometry,
					material
			);

			//mesh1.rotation.y = Math.PI/5;
			mesh1.scale.set(1, 1, 1);
			mesh1.castShadow = true;
			mesh1.receiveShadow = true;
			mesh1.geometry.computeTangents();
			scene.add(mesh1);

					object=mesh1;
				

		});

	};
}