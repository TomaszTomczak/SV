/*
 * 
 * modul odpowiedzialny za ladowanie podloza i zarzadzanie czasem i pogoda (? :D)
 * 
 */
var stepUpLoadCounter = function( loadedname)
{
	console.log("loaded: "+loadedname);
}
function GameEnvironment()
{

	var env=this;
	this.terrainWidth=60000;
	this.terrainHeight=60000;
	this.groundDiffuseTexturePaths;
	this.groundNormalTexturePaths;
	this.mapsPaths;
	this.textures = []; // diffuse textures
	this.texturesNormal = [];
	this.splattingMapTexturePath; // sciezka
	this.splattingMapTexture;
	
	this.renderWater = true;
	this.waterNormalPath;
	this.waterNormalMap;
	this.water;
	this.waterModel;
	
	this.renderSkyBox=true;
	this.skyboxTexture;
	this.cubeMap;
	this.cubeShader;
	this.skyBoxMaterial;
	this.skyBox;  // model
	
	
	/*
	 *  splatting textures

	 *  [0] - map for r canal
	 *  [1] - map for g canal
	 *  [2] - map for b canal
	 */
	this.sMap;
	this.sMapPath;
	this.sTextures = [];            // splatting textures - dodatkowe tekstury 
	this.sTexturesPaths = [];       // sciezki do tekstur
	
	this.sNormalMaps = [];      // normal mapy
	this.sNormalMapsPaths = []; // sciezki do normalmap
	
	this.grassMapPath="asset/textures/grassmap_texture.png";
	this.grassTexturePaths=["asset/textures/other/Blades-of-Grass3.jpg","asset/textures/other/Blades-of-Grass2.jpg"];
	this.grassAlphaMapPaths=["asset/textures/other/trawa3.jpg","asset/textures/other/trawa2.jpg"];
	this.grassModelPath="asset/maps/stacja_paliw/models/trawa.js";
	this.grassMap;
	this.grassModels=[];
	this.grassTextures=[];
	this.grassAlphaMaps=[];

	this.grass=[];
	
	this.rTexture;
	this.rTexturePath;
	this.rTextureNormalPath;
	this.rTextureNormal;
	this.material;
	this.modelPath;
	this.model;
	this.DDSloader1 = new THREE.DDSLoader();
	this.loader = new THREE.JSONLoader();
	this.shadowmapsize;
	this.hemiLight;
	this.dirLight;
	this.playerLight;
	
	
	
	this.initialize = function(modelPath, diffuseTextures, normalTextures, sMapPath, sTexturesPaths, sNormalMapsPaths)
	{
		this.groundDiffuseTexturePaths = diffuseTextures;
		this.groundNormalTexturePaths = normalTextures;
		this.sTexturesPaths = sTexturesPaths;
		this.sNormalMapsPaths = sNormalMapsPaths;
		this.sMapPath = sMapPath;

		this.modelPath = modelPath;
		
		cm.addObiectToCounter((this.groundDiffuseTexturePaths.length*2) + 1); //textures + 1 model
		cm.addObiectToCounter(this.sTexturesPaths.length*2);
		if(sMapPath!="")
		{
			cm.addObiectToCounter();
		}
		
		this.shadowmapsize=1024;
		
		this.hemiLight =  new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.9);
        this.hemiLight.color.setHSL( 0.6, 1, 0.6 );
		this.hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		this.hemiLight.position.set( 15000, 500, 0 );


		this.dirLight = new THREE.DirectionalLight( 0xffffff, 2);
		this.dirLight.shadowCameraVisible = false;
		this.dirLight.castShadow = true;	
		this.dirLight.color.setHSL( 0.1, 1, 0.95 );
		this.dirLight.position.set( 2000, 2000, 0 );
		this.dirLight.shadowMapWidth = this.shadowmapsize;
		this.dirLight.shadowMapHeight = this.shadowmapsize;
		
		var d = 4096;

		this.dirLight.shadowCameraLeft = -d;
		this.dirLight.shadowCameraRight = d;
		this.dirLight.shadowCameraTop = d;
		this.dirLight.shadowCameraBottom = -d;
		
		this.dirLight.shadowCameraFar = 10000;
		this.dirLight.shadowBias = -0.00001;
		this.dirLight.shadowDarkness = 0.6;
		
		this.playerLight = new THREE.PointLight( 0xFFFFFF, 2.5, 500 );
		this.playerLight.castShadow = false;	
		
        if(this.renderWater)
        {
        	this.waterNormalPath = "asset/textures/waternormals.jpg";
        	
        	
        }
        
		

	}

	var generateWaterCallback = function(material)
	{
		return function(geometry)
		{
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
						material
				);
				mesh1.scale.set(1, 1, 1);
				mesh1.castShadow = true;
				mesh1.receiveShadow = true;
				mesh1.geometry.computeTangents();
				scene.add(mesh1);
		}
	}
	var generateEnvCallback = function ( textures, normalstextures, sMap,sTextures, sNormalMaps ) {

		return function( geometry ) {
			
			
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
						getTerrainMaterial(textures, normalstextures, sMap,  sTextures, sNormalMaps)
				);
			

		
			
			//mesh1.rotation.y = Math.PI/5;
			mesh1.scale.set(1, 1, 1);
			mesh1.castShadow = true;
			mesh1.receiveShadow = true;
			mesh1.geometry.computeTangents();
			scene.add(mesh1);
			env.model=mesh1;
			cm.objectLoaded("terrain");
			cm.loadDecals();
			console.log(mesh1);
			//env.loadGrassMap();


		}

	}
	
	/*
	  	
	this.grassMapPath="asset/textures/grassmap_texture.jpg";
	this.grassTexturePaths=["asset/textures/other/Blades-of-Grass3.jpg"];
	this.grassAlphaMapPaths=["asset/textures/other/trawa1.jpg"];
	this.grassModelPath="asset/maps/stacja_paliw/models/trawa.js";
    this.grassMap;
	this.grassTextures=[];
	this.grassAlphaMaps=[];
 
	 */
	
	var generateGrassLoadCallback = function () {

		return function( geometry ) {
			
			

			var material = new THREE.MeshLambertMaterial ({
				map:  env.grassTextures[0],
				//transparent: true,
				alphaMap: env.grassAlphaMaps[0],
				alphaTest: 0.2

			});
			
			var material2 = new THREE.MeshLambertMaterial ({
				map:  env.grassTextures[1],
				//transparent: true,
				alphaMap: env.grassAlphaMaps[1]//,
				//alphaTest: 0.3

			});

			material.map.wrapS=THREE.RepeatWrapping;
			material.map.wrapT=THREE.RepeatWrapping;
			material.side = THREE.DoubleSide;
			material.transparent = true;
			
			var pixelData = env.grassMap.getContext('2d').getImageData(0, 0, env.grassMap.width, env.grassMap.height).data;
			console.log("pixel data to :"+pixelData[0]);
			console.log(pixelData);
			var x=-1;
			var scaleSize;
			var raycaster;
			var intersects;
			for(var i=0; i<pixelData.length; i=i+4)
				{
				x++;
				
				
				 if(pixelData[i]!=0)
					 {
					 var mesh1;
					
						 mesh1 = new THREE.Mesh(geometry,material);
					
					 
					 mesh1.geometry.computeTangents();
		    			mesh1.castShadow = false;
		    			mesh1.receiveShadow = true;
		    			
		    			//mesh1.position.x=(((x)%env.grassMap.width)*(env.terrainWidth/env.grassMap.width))-(env.terrainWidth/2);
		    			//mesh1.position.z=((float2int((x)/env.grassMap.height))*(env.terrainHeight/env.grassMap.height))-(env.terrainHeight/2);
		    			
		    			
		    			mesh1.position.x=(((x)%env.grassMap.width)*env.terrainWidth/env.grassMap.width)-(env.terrainWidth/2);
		    			mesh1.position.z=((float2int((x)/env.grassMap.height))*env.terrainHeight/env.grassMap.height)-(env.terrainHeight/2);
		    			mesh1.scale.set((pixelData[i]/255)+Math.random(), (pixelData[i]/255)+Math.random(), (pixelData[i]/255)+Math.random());
		    			mesh1.scale.set(0.7 + Math.random(),Math.random(),0.7 + Math.random() );
		    			mesh1.position.x+=Math.random()*env.terrainWidth/env.grassMap.width;
		    			mesh1.position.z+=Math.random()*env.terrainHeight/env.grassMap.height;
		    			mesh1.rotation.y+=Math.random()/180;
		    			mesh1.position.y=500;
		    			
		    			 raycaster = new THREE.Raycaster( new THREE.Vector3( mesh1.position.x, mesh1.position.y+500, mesh1.position.x ), new THREE.Vector3( 0, -1, 0 ) );               

						 intersects = raycaster.intersectObject( env.model );


						 if ( intersects.length > 0 ) {							
							 mesh1.position.y = intersects[0].point.y;						
						 }
		    			
		    			
		    			
		    			scene.add(mesh1);
		    			env.grassModels.push(mesh1);
		    			//console.log("wielkosc sceny to: "+scene.length);
					 }
				
				/* for(var i=0; i<env.grassModels.length; i++)
				 {
					 var raycaster = new THREE.Raycaster( new THREE.Vector3( mesh1.position.x, mesh1.position.y+500, mesh1.position.x ), new THREE.Vector3( 0, -1, 0 ) );               

					 var intersects = raycaster.intersectObject( env.model );


					 if ( intersects.length > 0 ) {							
						 mesh1.position.y = intersects[0].point.y;						
					 }



				 }*/
				
				}
			
			
		}

	}

	
	this.loadGrassMap = function() {
		  var img = new Image();
		  console.log("tworzymy tworzomy");
		  img.src = this.grassMapPath;
		  
		  img.onload = function() {

		    //var xyCoords = convertVector3ToXY(point);
		    // create a canvas to manipulate the image
			env.grassMap = document.createElement('canvas');
		    env.grassMap.width = img.width;
		    env.grassMap.height = img.height;
		    env.grassMap.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
		   
		    env.loadGrass();
		    
		    
		    
		    //callback(pixelData);
		  };
		};

	this.loadGrass = function()
	{
		console.log("halo halo ladujemy trawe na pociag");
		console.log(this.grassMap.width + " <w  h> " +  env.grassMap.height);
		this.loader.load( this.grassModelPath, generateGrassLoadCallback());
		/*for(var y=0; y<canvas.height; y++)
	    {
	    	for(var x=0; x<canvas.width; x++)
	    	{
	    		var pixelData = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
	    		if(pixelData[0]!=0)
	    		{
	    			

	    		}
	    	}
	    }*/
		
	}
	
	this.load = function()
	{
		
		scene.add( this.hemiLight );
		scene.add( this.dirLight );
		scene.add( this.playerLight );
		
		
		// ladowanie tekstur gruntu zaleznych od wysokosci podloza
        for(var i=0; i<this.groundDiffuseTexturePaths.length; i++)
        {
        	switch(returnExtension(this.groundDiffuseTexturePaths[i]))
        	{
        	case "dds": 
        				this.textures.push( this.DDSloader1.load( this.groundDiffuseTexturePaths[i], cm.objectLoaded()));
        				break;
        	default: 
        				this.textures.push( THREE.ImageUtils.loadTexture( this.groundDiffuseTexturePaths[i], cm.objectLoaded()));
        				break;
        	}
        	
        	switch(returnExtension(this.groundNormalTexturePaths[i]))
        	{
        	case "dds": 
        				this.texturesNormal.push( this.DDSloader1.load( this.groundNormalTexturePaths[i], cm.objectLoaded()));
        				break;
        	default: 
        				this.texturesNormal.push( THREE.ImageUtils.loadTexture( this.groundNormalTexturePaths[i],cm.objectLoaded()));
        				break;
        	}
        	
        	        	
        	this.textures[i].anisotropy = 4;
        	this.textures[i].wrapS = this.textures[i].wrapT = THREE.RepeatWrapping; 
        	
        	this.texturesNormal[i].anisotropy = 4;
        	this.texturesNormal[i].wrapS = this.texturesNormal[i].wrapT = THREE.RepeatWrapping; 
        	        	
        }
        
        
        // ladowanie tekstur dodatkowych, zaleznych od splatting mapy
        for(var i=0; i<this.sTexturesPaths.length; i++)
        {
        	switch(returnExtension(this.sTexturesPaths[i]))
        	{
        	case "dds": 
        				this.sTextures.push( this.DDSloader1.load( this.sTexturesPaths[i], cm.objectLoaded()));
        				break;
        	default: 
        				this.sTextures.push( THREE.ImageUtils.loadTexture( this.sTexturesPaths[i],cm.objectLoaded()));
        				break;
        	}
        	
        	switch(returnExtension(this.sNormalMapsPaths[i]))
        	{
        	case "dds": 
        				this.sNormalMaps.push( this.DDSloader1.load( this.sNormalMapsPaths[i],cm.objectLoaded()));
        				break;
        	default: 
        				this.sNormalMaps.push( THREE.ImageUtils.loadTexture( this.sNormalMapsPaths[i], cm.objectLoaded()));
        				break;
        	}
        	
        	this.sTextures[i].anisotropy = 4;
        	this.sTextures[i].wrapS = this.sTextures[i].wrapT = THREE.RepeatWrapping;         	
        	
        	this.sNormalMaps[i].anisotropy = 4;
        	this.sNormalMaps[i].wrapS = this.sNormalMaps[i].wrapT = THREE.RepeatWrapping; 
        	        	
        }
        
        for(var i=0; i<this.grassTexturePaths.length; i++)
        {
        	switch(returnExtension(this.grassTexturePaths[i]))
        	{
        	case "dds": 
        				this.grassTextures.push( this.DDSloader1.load( this.grassTexturePaths[i]));
        				break;
        	default: 
        				this.grassTextures.push( THREE.ImageUtils.loadTexture( this.grassTexturePaths[i]));
        				break;
        	}
        	       	
        	
        	this.grassTextures.anisotropy = 4;
        	this.grassTextures.wrapS = this.grassTextures.wrapT = THREE.RepeatWrapping;     
        }
        
        for(var i=0; i<this.grassAlphaMapPaths.length; i++)
        {
        	switch(returnExtension(this.grassAlphaMapPaths[i]))
        	{
        	case "dds": 
        				this.grassAlphaMaps.push( this.DDSloader1.load( this.grassAlphaMapPaths[i]));
        				break;
        	default: 
        				this.grassAlphaMaps.push( THREE.ImageUtils.loadTexture( this.grassAlphaMapPaths[i]));
        				break;
        	}
        	       	
        	
        	this.grassAlphaMaps.anisotropy = 4;
        	this.grassAlphaMaps.wrapS = this.grassAlphaMaps.wrapT = THREE.RepeatWrapping;     
        }
        
        
        // ladowanie splatting mapy
        if(this.sMapPath!="")
        {
        	switch(returnExtension(this.sMapPath))
        	{
        	case "dds": 
		        		this.sMap = this.DDSloader1.load(this.sMapPath, cm.objectLoaded());
		        		break;
		        		
        	default: 	this.sMap = THREE.ImageUtils.loadTexture(this.sMapPath, cm.objectLoaded());
    					break;
        	}
        	
        	this.sMap.anisotropy = 4;
        	this.sMap.wrapS = this.sMap.wrapT = THREE.RepeatWrapping; 
        }
        
      
    	

        
        this.loader.load( this.modelPath, generateEnvCallback(this.textures, this.texturesNormal, this.sMap, this.sTextures, this.sNormalMaps ));
        
     /*   if(this.renderWater)
        {
        	this.waterNormalMap = THREE.ImageUtils.loadTexture( this.waterNormalPath );
    		this.waterNormalMap.wrapS = this.waterNormalMap.wrapT = THREE.RepeatWrapping; 
    		
        	this.water = new THREE.Water( renderer, camera, scene, {
    			textureWidth: 1024, 
    			textureHeight: 1024,
    			waterNormals: this.waterNormalMap,
    			alpha: 	0.7,
    			sunDirection: this.hemiLight.position.clone().normalize(),
    			sunColor: 0xffffff,
    			waterColor: 0xa2661f, //0x001e0f
    			distortionScale: 1200.0,
    		} );
        	
        	//TODO: To bedzie ladowane z modelu JSON
        	this.waterModel = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 60000, 60000 ),
					this.water.material
				);
        	
        	//this.waterModel = this.loader.load("asset/maps/stacja_paliw/models/water.js", generateWaterCallback(this.water.material));
        	
        	this.waterModel.add(this.water);
        	this.waterModel.rotation.x = - Math.PI * 0.5;
        	this.waterModel.position.y = -300;
        	scene.add(this.waterModel);
        	
        }*/
        
        if(this.renderSkyBox)
        {
        	this.cubeMap = new THREE.CubeTexture( [] );
        	this.cubeMap.format = THREE.RGBFormat;
        	this.cubeMap.flipY = false;

        	var imageLoader = new THREE.ImageLoader();

        	imageLoader.load( 'asset/textures/skyboxsun25degtest.png', function ( image ) {



        		env.cubeMap.images[ 0 ] = getSide( 2, 1, image ); // px
        		env.cubeMap.images[ 1 ] = getSide( 0, 1, image ); // nx
        		env.cubeMap.images[ 2 ] = getSide( 1, 0, image ); // py
        		env.cubeMap.images[ 3 ] = getSide( 1, 2, image ); // ny
        		env.cubeMap.images[ 4 ] = getSide( 1, 1, image ); // pz
        		env.cubeMap.images[ 5 ] = getSide( 3, 1, image ); // nz
        		env.cubeMap.needsUpdate = true;

        	} );

        	this.cubeShader = THREE.ShaderLib['cube'];
        	this.cubeShader.uniforms['tCube'].value = this.cubeMap;

        	this.skyBoxMaterial = new THREE.ShaderMaterial( {
        		fragmentShader: this.cubeShader.fragmentShader,
        		vertexShader: this.cubeShader.vertexShader,
        		uniforms: this.cubeShader.uniforms,
        		depthWrite: false,
        		side: THREE.BackSide
        	});

        	this.skyBox = new THREE.Mesh(
        			new THREE.BoxGeometry( 60000, 60000, 60000),
        			this.skyBoxMaterial
        	);

        	scene.add( this.skyBox );

        }

				
    }
	
	this.update = function()
	{
		if(cm.player!=null)
			{
			this.playerLight.position.set(cm.player.model.position.x, cm.player.model.position.y+100, cm.player.model.position.z);
			}
		
		//this.water.material.uniforms.time.value += 1.0 / 60.0;
		//this.water.render();
	}
	
	
	

}