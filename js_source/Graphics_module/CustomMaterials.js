/*
 * 
 * 
 * Tu bed¹ siê znajdowaly definicje materialow
 * 
 * 
 * */

	var getDecalPointerMaterial = function(texture)
	{
		return new THREE.MeshPhongMaterial( { 
				specular: 0x333333,
				shininess: 0,
				map: texture, 
				//normalMap: THREE.ImageUtils.loadTexture( 'asset/textures/'+quality+'/dirt-512_normal.jpg' ),
				//normalScale: new THREE.Vector2( .15, .15 ),
				opacity: 0.85,
				transparent: true, 
				depthTest: true, 
				depthWrite: false, 
				polygonOffset: true,
				polygonOffsetFactor: -4, 
				wireframe: false 
			});
	}
	var getPointerMaterial = function()
	{
		return new THREE.MeshPhongMaterial( { ambient: 0x123123, 
											  color: 0xFF0000, 
											  specular: 0xFFFFFF, 
											  shininess: 30, 
											  transparent: true } );
		
	}
	var getTerrainMaterial=function(textures, normaltextures, sMap,sTextures,sNormalMaps)
	{
		
        var terrainNormalMapUniforms = THREE.UniformsUtils.clone( terrain_normal_shader.uniforms );
				
	    terrainNormalMapUniforms[ "enableAO" ].value = false;
	    terrainNormalMapUniforms[ "enableDiffuse" ].value = true;
	    terrainNormalMapUniforms[ "enableSpecular" ].value = true;
	    terrainNormalMapUniforms[ "enableReflection" ].value = false;
	    terrainNormalMapUniforms[ "enableDisplacement" ].value = false;


	    terrainNormalMapUniforms[ "tSpecular" ].value = textures[4];

	    terrainNormalMapUniforms[ "uNormalScale" ].value.y = -2;
	   // var ambient = 0x111111, diffuse = 0xbbbbbb, specular = 0x060606, shininess = 0;
	    terrainNormalMapUniforms[ "diffuse" ].value.setHex( 0xbbbbbb);
	    terrainNormalMapUniforms[ "specular" ].value.setHex( 0x060606 );
	    terrainNormalMapUniforms[ "ambient" ].value.setHex( 0x111111);

	    terrainNormalMapUniforms[ "shininess" ].value = 0.1;

	    terrainNormalMapUniforms[ "diffuse" ].value.convertGammaToLinear();
	    terrainNormalMapUniforms[ "specular" ].value.convertGammaToLinear();
	    terrainNormalMapUniforms[ "ambient" ].value.convertGammaToLinear();
	    
	    terrainNormalMapUniforms[ "splatting_map_count" ].value = sTextures.length;
	    
	    if(sMap!=null)
	    {
	    terrainNormalMapUniforms[ "splattingMapTexture" ].value = sMap;
	    terrainNormalMapUniforms[ "use_splatting" ].value = true;
	    }
	    
	    if(sTextures.length>=1)
	    {
	    	terrainNormalMapUniforms[ "rTexture" ].value = sTextures[0];
	    	terrainNormalMapUniforms[ "rTextureNormal" ].value = sNormalMaps[0];
	    }
	    if(sTextures.length>=2)
	    {
	    	terrainNormalMapUniforms[ "gTexture" ].value = sTextures[1];
	    	terrainNormalMapUniforms[ "gTextureNormal" ].value = sNormalMaps[1];
	    }
	    if(sTextures.length==3)
	    {
	    	terrainNormalMapUniforms[ "bTexture" ].value = sTextures[2];
	    	terrainNormalMapUniforms[ "bTextureNormal" ].value = sNormalMaps[2];
	    }
	    
	    
	    terrainNormalMapUniforms[ "oceanTexture" ].value = textures[0];
	    terrainNormalMapUniforms[ "sandyTexture" ].value = textures[1];
	    terrainNormalMapUniforms[ "grassTexture" ].value = textures[2];
	    terrainNormalMapUniforms[ "rockyTexture" ].value = textures[3];

	    
	    terrainNormalMapUniforms[ "oceanTextureNormal" ].value = normaltextures[0];
	    terrainNormalMapUniforms[ "sandyTextureNormal" ].value = normaltextures[1];
	    terrainNormalMapUniforms[ "grassTextureNormal" ].value = normaltextures[2];
	    terrainNormalMapUniforms[ "rockyTextureNormal" ].value = normaltextures[3];

	    terrainNormalMapUniforms[ "maxY" ].value = 840.0;
	    terrainNormalMapUniforms[ "minY" ].value = -900.0;

	    
	 // return new THREE.MeshPhongMaterial( { ambient: 0x123123, color: 0xFF0000, specular: 0xFFFFFF, shininess: 30, transparent: false } );
		
	    return new THREE.ShaderMaterial( 
	            {   
	                uniforms: terrainNormalMapUniforms,
	                vertexShader: terrain_normal_shader.vertexShader,
	                fragmentShader: terrain_normal_shader.fragmentShader,
	                fog: true,
	                lights: true
	            }
	        );
	}

