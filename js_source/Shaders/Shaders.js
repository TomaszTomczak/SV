/**
 * @author jbouny / https://github.com/jbouny
 *
 * Work based on :
 * @author Slayvin / http://slayvin.net : Flat mirror for three.js
 * @author Stemkoski / http://www.adelphi.edu/~stemkoski : An implementation of water shader based on the flat mirror
 * @author Jonas Wagner / http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */

THREE.ShaderLib['water'] = {

	uniforms: { "normalSampler":	{ type: "t", value: null },
				"mirrorSampler":	{ type: "t", value: null },
				"alpha":			{ type: "f", value: 1.0 },
				"time":				{ type: "f", value: 0.0 },
				"distortionScale":	{ type: "f", value: 20.0 },
				"textureMatrix" :	{ type: "m4", value: new THREE.Matrix4() },
				"sunColor":			{ type: "c", value: new THREE.Color( 0x7F7F7F ) },
				"sunDirection":		{ type: "v3", value: new THREE.Vector3( 0.70707, 0.70707, 0 ) },
				"eye":				{ type: "v3", value: new THREE.Vector3( 0, 0, 0 ) },
				"waterColor":		{ type: "c", value: new THREE.Color( 0x555555 ) }
	},

	vertexShader: [
		'uniform mat4 textureMatrix;',
		'uniform float time;',

		'varying vec4 mirrorCoord;',
		'varying vec3 worldPosition;',
		
		'void main()',
		'{',
		'	mirrorCoord = modelMatrix * vec4( position, 1.0 );',
		'	worldPosition = mirrorCoord.xyz;',
		'	mirrorCoord = textureMatrix * mirrorCoord;',
		'	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
		'}'
	].join('\n'),

	fragmentShader: [
		'precision highp float;',
		
		'uniform sampler2D mirrorSampler;',
		'uniform float alpha;',
		'uniform float time;',
		'uniform float distortionScale;',
		'uniform sampler2D normalSampler;',
		'uniform vec3 sunColor;',
		'uniform vec3 sunDirection;',
		'uniform vec3 eye;',
		'uniform vec3 waterColor;',

		'varying vec4 mirrorCoord;',
		'varying vec3 worldPosition;',
		
		'vec4 getNoise( vec2 uv )',
		'{',
		'	vec2 uv0 = ( uv / 200.0 ) + vec2(time / 17.0, time / 29.0);',
		'	vec2 uv1 = uv / 500.0-vec2( time / -190.0, time / 310.0 );',
		'	vec2 uv2 = uv / vec2( 89070.0, 98030.0 ) + vec2( time / 101.0, time / 97.0 );',
		'	vec2 uv3 = uv / vec2( 10910.0, 10270.0 ) - vec2( time / 109.0, time / -113.0 );',
		'	vec4 noise = ( texture2D( normalSampler, uv0 ) ) +',
        '		( texture2D( normalSampler, uv1 ) ) +',
        '		( texture2D( normalSampler, uv2 ) ) +',
		'		( texture2D( normalSampler, uv3 ) );',
		'	return noise * 0.5 - 1.0;',
		'}',
		
		'void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor )',
		'{',
		'	vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );',
		'	float direction = max( 0.0, dot( eyeDirection, reflection ) );',
		'	specularColor += pow( direction, shiny ) * sunColor * spec;',
		'	diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;',
		'}',
		
		'void main()',
		'{',
		'	vec4 noise = getNoise( worldPosition.xz );',
		'	vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );',

		'	vec3 diffuseLight = vec3(0.0);',
		'	vec3 specularLight = vec3(0.0);',

		'	vec3 worldToEye = eye-worldPosition;',
		'	vec3 eyeDirection = normalize( worldToEye );',
		'	sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );',
		
		'	float distance = length(worldToEye);',

		'	vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;',
		'	vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.z + distortion ) );',

		'	float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );',
		'	float rf0 = 0.3;',
		'	float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );',
		'	vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;',
		'	vec3 albedo = mix( sunColor * diffuseLight * 0.3 + scatter, ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance );',
		'	gl_FragColor = vec4( albedo, alpha );',
		'}'
	].join('\n')

};

/**
 * @author Slayvin / http://slayvin.net
 */
THREE.ShaderLib['mirror'] = {

	uniforms: { "mirrorColor": { type: "c", value: new THREE.Color(0x7F7F7F) },
				"mirrorSampler": { type: "t", value: null },
				"textureMatrix" : { type: "m4", value: new THREE.Matrix4() }
	},

	vertexShader: [

		"uniform mat4 textureMatrix;",

		"varying vec4 mirrorCoord;",

		"void main() {",

			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
			"mirrorCoord = textureMatrix * worldPosition;",

			"gl_Position = projectionMatrix * mvPosition;",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform vec3 mirrorColor;",
		"uniform sampler2D mirrorSampler;",

		"varying vec4 mirrorCoord;",

		"float blendOverlay(float base, float blend) {",
			"return( base < 0.5 ? ( 2.0 * base * blend ) : (1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );",
		"}",
		
		"void main() {",

			"vec4 color = texture2DProj(mirrorSampler, mirrorCoord);",
			"color = vec4(blendOverlay(mirrorColor.r, color.r), blendOverlay(mirrorColor.g, color.g), blendOverlay(mirrorColor.b, color.b), 1.0);",

			"gl_FragColor = color;",

		"}"

	].join("\n")

};

var terrain_normal_shader = {
		uniforms: THREE.UniformsUtils.merge( [
		                                      THREE.UniformsLib[ "fog" ],
		                                      THREE.UniformsLib[ "lights" ],
		                                      THREE.UniformsLib[ "shadowmap" ],
		                                      {
		                                    	  //>
		                                    	  "use_splatting" : { type: "i", value: 0 },
		                                    	  "splatting_map_count": { type: "i", value: 0 },
		                                    	  "splattingMapTexture":	{ type: "t", value: 5, texture: null },
		                                    	  
		                                    	  "rTexture":				{ type: "t", value: 6, texture: null },
		                                    	  "rTextureNormal":				{ type: "t", value: 7, texture: null },
		                                    	  
		                                    	  "gTexture":				{ type: "t", value: 6, texture: null },
		                                    	  "gTextureNormal":				{ type: "t", value: 7, texture: null },
		                                    	  
		                                    	  "bTexture":				{ type: "t", value: 6, texture: null },
		                                    	  "bTextureNormal":				{ type: "t", value: 7, texture: null },

		                                    	  "oceanTexture":	{ type: "t", value: 0, texture: null },
		                                    	  "sandyTexture":	{ type: "t", value: 1, texture: null },
		                                    	  "grassTexture":	{ type: "t", value: 2, texture: null },
		                                    	  "rockyTexture":	{ type: "t", value: 3, texture: null },
		                                    	 // "snowyTexture":	{ type: "t", value: 4, texture: null },

		                                    	  "oceanTextureNormal":	{ type: "t", value: 0, texture: null },
		                                    	  "sandyTextureNormal":	{ type: "t", value: 1, texture: null },
		                                    	  "grassTextureNormal":	{ type: "t", value: 2, texture: null },
		                                    	  "rockyTextureNormal":	{ type: "t", value: 3, texture: null },
		                                    	  //"snowyTextureNormal":	{ type: "t", value: 4, texture: null },

		                                    	  "maxY":           { type: "f", value: 300.0 },
		                                    	  "minY":           { type: "f", value: -400 },

		                                    	  "enableAO" : { type: "i", value: 0 },
		                                    	  "enableDiffuse" : { type: "i", value: 0 },
		                                    	  "enableSpecular" : { type: "i", value: 0 },
		                                    	  "enableReflection" : { type: "i", value: 0 },
		                                    	  "enableDisplacement": { type: "i", value: 0 },
		                                    	  "tDisplacement": { type: "t", value: null }, // must go first as this is vertex texture
		                                    	  
		                                    	  "tCube" : { type: "t", value: null },
		                                    	  
		                                    	  "tSpecular" : { type: "t", value: null },
		                                    	  "tAO" : { type: "t", value: null },
		                                    	  "uNormalScale": { type: "v2", value: new THREE.Vector2( 1, 1 ) },
		                                    	  "uDisplacementBias": { type: "f", value: 0.0 },
		                                    	  "uDisplacementScale": { type: "f", value: 1.0 },
		                                    	  "diffuse": { type: "c", value: new THREE.Color( 0xffffff ) },
		                                    	  "specular": { type: "c", value: new THREE.Color( 0x111111 ) },
		                                    	  "ambient": { type: "c", value: new THREE.Color( 0xffffff ) },
		                                    	  "shininess": { type: "f", value: 30 },
		                                    	  "opacity": { type: "f", value: 1 },
		                                    	  "useRefract": { type: "i", value: 0 },
		                                    	  "refractionRatio": { type: "f", value: 0.98 },
		                                    	  "reflectivity": { type: "f", value: 0.5 },
		                                    	  "uOffset" : { type: "v2", value: new THREE.Vector2( 0, 0 ) },
		                                    	  "uRepeat" : { type: "v2", value: new THREE.Vector2( 40, 40 ) },
		                                    	  "wrapRGB" : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) 
		                                    	  }
		                                      }
		                                      ] ),
fragmentShader: [
               
   "varying float vAmount;",
   "uniform sampler2D oceanTexture;",
   "uniform sampler2D sandyTexture;",
   "uniform sampler2D grassTexture;",
   "uniform sampler2D rockyTexture;",
 //  "uniform sampler2D snowyTexture;",
   "uniform sampler2D splattingMapTexture;",
   
   "uniform sampler2D rTexture;",
   "uniform sampler2D rTextureNormal;",
   
   "uniform sampler2D gTexture;",
   "uniform sampler2D gTextureNormal;",
   
   "uniform sampler2D bTexture;",
   "uniform sampler2D bTextureNormal;",
   
   "uniform int splatting_map_count;",

   "uniform sampler2D oceanTextureNormal;",
   "uniform sampler2D sandyTextureNormal;",
   "uniform sampler2D grassTextureNormal;",
   "uniform sampler2D rockyTextureNormal;",
  // "uniform sampler2D snowyTextureNormal;",

   "uniform vec3 ambient;",
   "uniform vec3 diffuse;",
   "uniform vec3 specular;",
   "uniform float shininess;",
   "uniform float opacity;",
   "uniform bool enableDiffuse;",
   "uniform bool enableSpecular;",
   "uniform bool enableAO;",
   "uniform bool use_splatting;",
   "uniform bool enableReflection;",

 
   //"uniform sampler2D tSpecular;",
   "uniform sampler2D tAO;",
   "uniform samplerCube tCube;",
   "uniform vec2 uNormalScale;",
   "uniform bool useRefract;",
   "uniform float refractionRatio;",
   "uniform float reflectivity;",
   "varying vec3 vTangent;",
   "varying vec3 vBinormal;",
   "varying vec3 vNormal;",
   "varying vec2 vUv;",
   "varying vec2 vUv_org;",
   "uniform vec3 ambientLightColor;",
                 
	"#if MAX_DIR_LIGHTS > 0",
	" uniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];",
	" uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];",
	"#endif",
	
	"#if MAX_HEMI_LIGHTS > 0",
	" uniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];",
	" uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];",
	" uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];",
	"#endif",
	
	"#if MAX_POINT_LIGHTS > 0",
	" uniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];",
	" uniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];",
	" uniform float pointLightDistance[ MAX_POINT_LIGHTS ];",
	"#endif",
	
	"#if MAX_SPOT_LIGHTS > 0",
	" uniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];",
	" uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];",
	" uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];",
	" uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];",
	" uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];",
	" uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];",
	"#endif",
	
	"#ifdef WRAP_AROUND",
	" uniform vec3 wrapRGB;",
	"#endif",
	
	"varying vec3 vWorldPosition;",
	"varying vec3 vViewPosition;",
	THREE.ShaderChunk[ "shadowmap_pars_fragment" ],
	THREE.ShaderChunk[ "fog_pars_fragment" ],
	THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ],


	"vec3 blendTextures(vec4 texture1, float a1, vec4 texture2, float a2)",
	"{",
	    "float depth = 0.75;",
	    "float ma = max(texture1.a + a1, texture2.a + a2) - depth;",

	    "float b1 = max(texture1.a + a1 - ma, 0.0);",
	    "float b2 = max(texture2.a + a2 - ma, 0.0);",

	    "return (texture1.rgb * b1 + texture2.rgb * b2) / (b1 + b2);",
	"}",	
"void main() {",

		THREE.ShaderChunk[ "logdepthbuf_fragment" ],
		"gl_FragColor = vec4( vec3( 1.0 ), opacity );",
		"vec3 specularTex = vec3( 1.0 );",
		// >>>>>>>>>>
		"vec4 splatting = texture2D(splattingMapTexture , vUv*0.025);",
		// <<<<<<<<<
		"vec4 waterNormal = (smoothstep(0.01, 0.25, vAmount) - smoothstep(0.24, 0.50, vAmount)) * texture2D( oceanTextureNormal, vUv );",
		"vec4 sandyNormal = (smoothstep(0.24, 0.50, vAmount) - smoothstep(0.50, 0.75, vAmount)) * texture2D( sandyTextureNormal, vUv );",
		"vec4 grassNormal = (smoothstep(0.50, 0.75, vAmount) - smoothstep(0.75, 1.0, vAmount)) * texture2D( grassTextureNormal, vUv );",
		"vec4 rockyNormal = (smoothstep(0.75, 1.0, vAmount) )                                  * texture2D( rockyTextureNormal, vUv );",

		"vec3 normalTex =   (waterNormal.xyz + sandyNormal.xyz + grassNormal.xyz + rockyNormal.xyz)*2.0-1.0;",
		"if(use_splatting){",
		
			"if(splatting_map_count>=1)",
			"{",
				"vec4 normaltemp = texture2D( rTextureNormal, vUv );",
				" normalTex = mix(normalTex, normaltemp.xyz, (splatting.r) );",
			"}",
			
			"if(splatting_map_count>=2)",
			"{",
				"normalTex = mix(normalTex, texture2D( gTextureNormal, vUv ).xyz, (splatting.g) );",
			"}",
			
			// Brakuje wolnych tekstur
/*			"if(splatting_map_count==3)",
			"{",
				"normalTex = mix(normalTex, texture2D( bTextureNormal, vUv ).xyz, (splatting.b) );",
			"}",*/  
			
        "}",
		"normalTex.xy *= uNormalScale;",
		"normalTex = normalize( normalTex );",
		
		"if( enableDiffuse ) {",
			
			"#ifdef GAMMA_INPUT",
			/* zastapione
			" vec4 texelColor = texture2D( tDiffuse, vUv );",
			" texelColor.xyz *= texelColor.xyz;",
			" gl_FragColor = gl_FragColor * texelColor;",
			" #else",
			" gl_FragColor = gl_FragColor * texture2D( tDiffuse, vUv );",
			*/
			"vec4 water = (smoothstep(0.01, 0.25, vAmount) - smoothstep(0.24, 0.50, vAmount)) * texture2D( oceanTexture, vUv );",
			"vec4 sandy = (smoothstep(0.24, 0.50, vAmount) - smoothstep(0.50, 0.75, vAmount)) * texture2D( sandyTexture, vUv );",
			"vec4 grass = (smoothstep(0.50, 0.75, vAmount) - smoothstep(0.75, 1.0, vAmount)) * texture2D( grassTexture, vUv );",
			"vec4 rocky = (smoothstep(0.75, 1.0, vAmount))                                   * texture2D( rockyTexture, vUv );",

			"gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0) + water + sandy + grass + rocky;",
			
			//"vac4 ttt = splatting.r * snowy;",
			
			"if(use_splatting){",
				"if(splatting_map_count>=1)",
				"{",
					"gl_FragColor = mix(gl_FragColor, texture2D( rTexture, vUv ), (splatting.r) );",
				//"gl_FragColor.xyz = blendTextures(gl_FragColor, 1.0 - splatting.r, texture2D( rTexture, vUv ), splatting.r); ",
				"}",
				
				"if(splatting_map_count>=2)",
				"{",
					"gl_FragColor = mix(gl_FragColor, texture2D( gTexture, vUv ), (splatting.g) );",
				//"vec3 blendTextures(vec4 texture1, float a1, vec4 texture2, float a2)",
				      //"gl_FragColor.xyz = blendTextures(gl_FragColor, 1.0 - splatting.g, texture2D( gTexture, vUv ), splatting.g); ",
				"}",
				// Brakuje wolnych tekstur
				/*
				"if(splatting_map_count==3)",
				"{",
					"gl_FragColor = mix(gl_FragColor, texture2D( bTexture, vUv ), (splatting.b) );",
				"}",*/
			"}",
			" #endif",
		" }",


	/*	" if( enableAO ) {",
			" #ifdef GAMMA_INPUT",
			" vec4 aoColor = texture2D( tAO, vUv );",
			" aoColor.xyz *= aoColor.xyz;",
			" gl_FragColor.xyz = gl_FragColor.xyz * aoColor.xyz;",
			" #else",
			" gl_FragColor.xyz = gl_FragColor.xyz * texture2D( tAO, vUv ).xyz;",
			" #endif",
		" }",*/
		
		THREE.ShaderChunk[ "alphatest_fragment" ],

		/*" if( enableSpecular )",
		" specularTex = texture2D( tSpecular, vUv ).xyz;",*/
		" mat3 tsb = mat3( normalize( vTangent ), normalize( vBinormal ), normalize( vNormal ) );",
		" vec3 finalNormal = tsb * normalTex;",
		" #ifdef FLIP_SIDED",
		" finalNormal = -finalNormal;",
		" #endif",

		" vec3 normal = normalize( finalNormal );",
		" vec3 viewPosition = normalize( vViewPosition );",
//point lights
		" #if MAX_POINT_LIGHTS > 0",
		" vec3 pointDiffuse = vec3( 0.0 );",
		" vec3 pointSpecular = vec3( 0.0 );",
		" for ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {",
		" vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );",
		" vec3 pointVector = lPosition.xyz + vViewPosition.xyz;",
		" float pointDistance = 1.0;",
		" if ( pointLightDistance[ i ] > 0.0 )",
		" pointDistance = 1.0 - min( ( length( pointVector ) / pointLightDistance[ i ] ), 1.0 );",
		" pointVector = normalize( pointVector );",
//diffuse
		" #ifdef WRAP_AROUND",
		" float pointDiffuseWeightFull = max( dot( normal, pointVector ), 0.0 );",
		" float pointDiffuseWeightHalf = max( 0.5 * dot( normal, pointVector ) + 0.5, 0.0 );",
		" vec3 pointDiffuseWeight = mix( vec3( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );",
		" #else",
		" float pointDiffuseWeight = max( dot( normal, pointVector ), 0.0 );",
		" #endif",
		" pointDiffuse += pointDistance * pointLightColor[ i ] * diffuse * pointDiffuseWeight;",
//specular
		" vec3 pointHalfVector = normalize( pointVector + viewPosition );",
		" float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );",
		" float pointSpecularWeight = specularTex.r * max( pow( pointDotNormalHalf, shininess ), 0.0 );",
		" float specularNormalization = ( shininess + 2.0 ) / 8.0;",
		" vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( pointVector, pointHalfVector ), 0.0 ), 5.0 );",
		" pointSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * pointDistance * specularNormalization;",
		" }",
		" #endif",
//spot lights
		" #if MAX_SPOT_LIGHTS > 0",
		" vec3 spotDiffuse = vec3( 0.0 );",
		" vec3 spotSpecular = vec3( 0.0 );",
		" for ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {",
		" vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );",
		" vec3 spotVector = lPosition.xyz + vViewPosition.xyz;",
		" float spotDistance = 1.0;",
		" if ( spotLightDistance[ i ] > 0.0 )",
		" spotDistance = 1.0 - min( ( length( spotVector ) / spotLightDistance[ i ] ), 1.0 );",
		" spotVector = normalize( spotVector );",
		" float spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );",
		" if ( spotEffect > spotLightAngleCos[ i ] ) {",
		" spotEffect = max( pow( max( spotEffect, 0.0 ), spotLightExponent[ i ] ), 0.0 );",
//diffuse
		" #ifdef WRAP_AROUND",
		" float spotDiffuseWeightFull = max( dot( normal, spotVector ), 0.0 );",
		" float spotDiffuseWeightHalf = max( 0.5 * dot( normal, spotVector ) + 0.5, 0.0 );",
		" vec3 spotDiffuseWeight = mix( vec3( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );",
		" #else",
		" float spotDiffuseWeight = max( dot( normal, spotVector ), 0.0 );",
		" #endif",
		" spotDiffuse += spotDistance * spotLightColor[ i ] * diffuse * spotDiffuseWeight * spotEffect;",
//specular
		" vec3 spotHalfVector = normalize( spotVector + viewPosition );",
		" float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );",
		" float spotSpecularWeight = specularTex.r * max( pow( spotDotNormalHalf, shininess ), 0.0 );",
		" float specularNormalization = ( shininess + 2.0 ) / 8.0;",
		" vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( spotVector, spotHalfVector ), 0.0 ), 5.0 );",
		" spotSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * spotDistance * specularNormalization * spotEffect;",
		" }",
		" }",
		" #endif",
//directional lights
		" #if MAX_DIR_LIGHTS > 0",
		" vec3 dirDiffuse = vec3( 0.0 );",
		" vec3 dirSpecular = vec3( 0.0 );",
		" for( int i = 0; i < MAX_DIR_LIGHTS; i++ ) {",
		" vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );",
		" vec3 dirVector = normalize( lDirection.xyz );",
//diffuse
		" #ifdef WRAP_AROUND",
		" float directionalLightWeightingFull = max( dot( normal, dirVector ), 0.0 );",
		" float directionalLightWeightingHalf = max( 0.5 * dot( normal, dirVector ) + 0.5, 0.0 );",
		" vec3 dirDiffuseWeight = mix( vec3( directionalLightWeightingFull ), vec3( directionalLightWeightingHalf ), wrapRGB );",
		" #else",
		" float dirDiffuseWeight = max( dot( normal, dirVector ), 0.0 );",
		" #endif",
		" dirDiffuse += directionalLightColor[ i ] * diffuse * dirDiffuseWeight;",
//specular
		" vec3 dirHalfVector = normalize( dirVector + viewPosition );",
		" float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );",
		" float dirSpecularWeight = specularTex.r * max( pow( dirDotNormalHalf, shininess ), 0.0 );",
		" float specularNormalization = ( shininess + 2.0 ) / 8.0;",
		" vec3 schlick = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( dirVector, dirHalfVector ), 0.0 ), 5.0 );",
		" dirSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;",
		" }",
		" #endif",
//hemisphere lights
		" #if MAX_HEMI_LIGHTS > 0",
		" vec3 hemiDiffuse = vec3( 0.0 );",
		" vec3 hemiSpecular = vec3( 0.0 );" ,
		" for( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {",
		" vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );",
		" vec3 lVector = normalize( lDirection.xyz );",
//diffuse
		" float dotProduct = dot( normal, lVector );",
		" float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;",
		" vec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );",
		" hemiDiffuse += diffuse * hemiColor;",
//specular (sky light)
		" vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );",
		" float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;",
		" float hemiSpecularWeightSky = specularTex.r * max( pow( max( hemiDotNormalHalfSky, 0.0 ), shininess ), 0.0 );",
//specular (ground light)
		" vec3 lVectorGround = -lVector;",
		" vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );",
		" float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;",
		" float hemiSpecularWeightGround = specularTex.r * max( pow( max( hemiDotNormalHalfGround, 0.0 ), shininess ), 0.0 );",
		" float dotProductGround = dot( normal, lVectorGround );",
		" float specularNormalization = ( shininess + 2.0 ) / 8.0;",
		" vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVector, hemiHalfVectorSky ), 0.0 ), 5.0 );",
		" vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( max( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 0.0 ), 5.0 );",
		" hemiSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );",
		" }",
		" #endif",
//all lights contribution summation
		" vec3 totalDiffuse = vec3( 0.0 );",
		" vec3 totalSpecular = vec3( 0.0 );",
		" #if MAX_DIR_LIGHTS > 0",
		" totalDiffuse += dirDiffuse;",
		" totalSpecular += dirSpecular;",
		" #endif",
		" #if MAX_HEMI_LIGHTS > 0",
		" totalDiffuse += hemiDiffuse;",
		" totalSpecular += hemiSpecular;",
		" #endif",
		" #if MAX_POINT_LIGHTS > 0",
		" totalDiffuse += pointDiffuse;",
		" totalSpecular += pointSpecular;",
		" #endif",
		" #if MAX_SPOT_LIGHTS > 0",
		" totalDiffuse += spotDiffuse;",
		" totalSpecular += spotSpecular;",
		" #endif",
		" #ifdef METAL",
		" gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient + totalSpecular );",
		" #else",
		" gl_FragColor.xyz = gl_FragColor.xyz * ( totalDiffuse + ambientLightColor * ambient ) + totalSpecular;",
		" #endif",
		" if ( enableReflection ) {",
		" vec3 vReflect;",
		" vec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );",
		" if ( useRefract ) {",
		" vReflect = refract( cameraToVertex, normal, refractionRatio );",
		" } else {",
		" vReflect = reflect( cameraToVertex, normal );",
		" }",
		" vec4 cubeColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
		" #ifdef GAMMA_INPUT",
		" cubeColor.xyz *= cubeColor.xyz;",
		" #endif",
		" gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularTex.r * reflectivity );",
		" }",
		
		THREE.ShaderChunk[ "shadowmap_fragment" ],
		THREE.ShaderChunk[ "linear_to_gamma_fragment" ],
		THREE.ShaderChunk[ "fog_fragment" ],
"}"
].join("\n"),


vertexShader: [
               //>
               "varying float vAmount;",
               //"varying vec2 vUV;",
               //<
"attribute vec4 tangent;",
"uniform vec2 uOffset;",
"uniform vec2 uRepeat;",
"uniform bool enableDisplacement;",
"#ifdef VERTEX_TEXTURES",
" uniform sampler2D tDisplacement;",
" uniform float uDisplacementScale;",
" uniform float uDisplacementBias;",
				//>
				"uniform float maxY; // maxymalna wysokosc terenu",
				"uniform float minY; // minimalna wysokosc terenu",
				//<
"#endif",
"varying vec3 vTangent;",
"varying vec3 vBinormal;",
"varying vec3 vNormal;",
"varying vec2 vUv;",
"varying vec2 vUv_org;",
"varying vec3 vWorldPosition;",
"varying vec3 vViewPosition;",
THREE.ShaderChunk[ "skinning_pars_vertex" ],
THREE.ShaderChunk[ "shadowmap_pars_vertex" ],
THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ],
"void main() {",
THREE.ShaderChunk[ "skinbase_vertex" ],
THREE.ShaderChunk[ "skinnormal_vertex" ],

				//>
				"vAmount = (position.y+abs(minY))/(abs(maxY)+abs(minY));",
				//<


//normal, tangent and binormal vectors
" #ifdef USE_SKINNING",
" vNormal = normalize( normalMatrix * skinnedNormal.xyz );",
" vec4 skinnedTangent = skinMatrix * vec4( tangent.xyz, 0.0 );",
" vTangent = normalize( normalMatrix * skinnedTangent.xyz );",
" #else",
" vNormal = normalize( normalMatrix * normal );",
" vTangent = normalize( normalMatrix * tangent.xyz );",
" #endif",
" vBinormal = normalize( cross( vNormal, vTangent ) * tangent.w );",
 "vUv_org = uv;",
" vUv = uv * uRepeat + uOffset;",
//" vUv = uv;",
//displacement mapping
" vec3 displacedPosition;",
" #ifdef VERTEX_TEXTURES",
//" if ( enableDisplacement ) {", // never ever ever ever enable displacement!!
//" vec3 dv = texture2D( tDisplacement, uv ).xyz;",
//" vec3 dv = null",
//" float df = uDisplacementScale * dv.x + uDisplacementBias;",
//" displacedPosition = position + normalize( normal ) * df;",
//" } else {",
" #ifdef USE_SKINNING",
" vec4 skinVertex = bindMatrix * vec4( position, 1.0 );",
" vec4 skinned = vec4( 0.0 );",
" skinned += boneMatX * skinVertex * skinWeight.x;",
" skinned += boneMatY * skinVertex * skinWeight.y;",
" skinned += boneMatZ * skinVertex * skinWeight.z;",
" skinned += boneMatW * skinVertex * skinWeight.w;",
" skinned = bindMatrixInverse * skinned;",
" displacedPosition = skinned.xyz;",
" #else",
" displacedPosition = position;",
" #endif",
//" }",
" #else",
" #ifdef USE_SKINNING",
" vec4 skinVertex = bindMatrix * vec4( position, 1.0 );",
" vec4 skinned = vec4( 0.0 );",
" skinned += boneMatX * skinVertex * skinWeight.x;",
" skinned += boneMatY * skinVertex * skinWeight.y;",
" skinned += boneMatZ * skinVertex * skinWeight.z;",
" skinned += boneMatW * skinVertex * skinWeight.w;",
" skinned = bindMatrixInverse * skinned;",
" displacedPosition = skinned.xyz;",
" #else",
" displacedPosition = position;",
" #endif",
" #endif",

" vec4 mvPosition = modelViewMatrix * vec4( displacedPosition, 1.0 );",
" vec4 worldPosition = modelMatrix * vec4( displacedPosition, 1.0 );",
" gl_Position = projectionMatrix * mvPosition;",
THREE.ShaderChunk[ "logdepthbuf_vertex" ],

" vWorldPosition = worldPosition.xyz;",
" vViewPosition = -mvPosition.xyz;",
//shadows
" #ifdef USE_SHADOWMAP",
" for( int i = 0; i < MAX_SHADOWS; i ++ ) {",
" vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;",
" }",
" #endif",
"}"
].join("\n")
}