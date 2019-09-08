Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = 0, len = this.length; i < len; i++) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

var host = '192.168.56.101:8888';
var socket = io.connect('192.168.56.101:8888');
var un;	

var TESTING = true;
       //console.log(io.connect);

	function sendLogMsg(eUser, ePass)
	{
                socket.emit("MsgLogIn", { type: "login", u: eUser.value, p:ePass.value });
				un=eUser.value;
				
				
	}

       

    function sendMoveToMsg(x, z, r)
	{
	
	if(TESTING)
	{
	                for(ac in actors)
					{
						
						actors[ac].moveTo(x,z);
						
					}
	}
	else
	{
	            socket.emit("MsgMoveTo", { type: "move", px: x+"", pz: z+"", r: r+"" });
				}
				
	}
	
	function createHUD(mainWindow)
	{
		hud = document.createElement( 'div' ) ;
	img = document.createElement( 'img' ) ;
	img.src = 'asset/images/hud2.png';
	hud.appendChild(img);
	hud.className='hud';
	img.addEventListener("mouseover",function(){
	   console.log("pohudzie"); // blokowanie ruchu gdy kolizja z hudem
	});
	img.addEventListener("mouseout",function(){
		   console.log("wyjscie myszy z huda"); // blokowanie ruchu gdy kolizja z hudem
		});
   // hud.innerHTML = '<img src=>';
	
	
	mainWindow.appendChild(hud);
	}
//alert("wywolano");
// request animation frame
	
/*if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element){

			window.setTimeout( callback, 1000 / 15 );

		};

	} )();

}*/

/*setInterval(logicUpdate,1000/60);
function logicUpdate()
{
for(h in mainhero)
	{
	if(mainhero[h].loadingcomplete)
	{
	mainhero[h].Update();
	}
	
	}

//p.Update();
for(a in actors)
{
	if(actors[a].loadingcomplete)
	{
		actors[a].Update();
		//stats.update();
	}
}
}*/
// end of request animation frame

// DECLARE        ======================================================
    var ge = new GameEnvironment();
	var scale = 7;
	var quality;
	var FLOOR = -250;
	var radius = 600;
	var theta = 0;
	var clock = new THREE.Clock();
	var container;
	var objects = [];
	var actors = [];
	var width=window.innerWidth-30;
	var height=window.innerHeight-30;
	var projector = new THREE.Projector();
	renderer = new THREE.WebGLRenderer( { alpha: false, antialias: false, clearColor: 0x000000, clearAlpha: 1 } );
	var cube2;
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000 );
    var loader = new THREE.JSONLoader();
    var renderModel;
	var effectBloom;
	var effectCopy;
	var p;
	var temp;
	var stats;
	var mainhero=new Array();
	var controls;
	var clickPointer;
	var plight;
	var particles;
    var particles2;
	var terrainBoundingBox; 
	var enableParticles=false;
	var plight;
	var decals=[];
	var shadowTimer=0;
	var helper;
	var runnerTexture;
	var annie;
	
	var decalMaterial;
			
// end of DECLARE ======================================================

	
			
	
// INITIALIZE     ======================================================
	function StartGame()
    {

	
	init();
	animate();	
	}
	
	function init()
	{
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFShadowMap;
		renderer.sortObjects = false;
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		
		quality=document.querySelector('input[name="group1"]:checked').value;			
					
					
		
		 runnerTexture = new THREE.ImageUtils.loadTexture( 'asset/textures/'+quality+'/point2.png' );
		 annie = new TextureAnimator( runnerTexture, 12, 1, 12, 2); // texture, #horiz, #vert, #total, duration.
		
		 decalMaterial = new THREE.MeshPhongMaterial( { 
			specular: 0x333333,
			shininess: 0,
			map: runnerTexture, 
			normalMap: THREE.ImageUtils.loadTexture( 'asset/textures/'+quality+'/dirt-512_normal.jpg' ),
			normalScale: new THREE.Vector2( .15, .15 ),
			opacity: 0.85,
			transparent: true, 
			depthTest: true, 
			depthWrite: false, 
			polygonOffset: true,
			polygonOffsetFactor: -4, 
			wireframe: false 
		});
		 
	    document.getElementById("first_page").remove();
		 
		container = document.createElement( 'div' ) ;
		container.style.position = 'relative';
		document.body.appendChild( container);
		container.appendChild( renderer.domElement );
		
					stats = new Stats();
					stats.domElement.style.position = 'absolute';
					stats.domElement.style.top = '0px';
					stats.domElement.style.right = '0px';
					stats.domElement.style.zIndex = 100;
					container.appendChild( stats.domElement );
		
		scene.fog = new THREE.FogExp2( 0x967b4b, 0.0001 );
		mainWindow = document.createElement( 'div' );
		mainWindow.className = 'mainWindow';
		//mainWindow.innerHTML = 'TEST';
		
		consoleView = document.createElement('div');
		consoleView.className = 'console';
		consoleView.innerHTML = 'console';
		consoleView.id = "ConsoleContent";
		mainWindow.appendChild(consoleView);
		
		createHUD(mainWindow);
		
		document.body.appendChild( mainWindow);
		
		
	    camera.position.set( 0,1130,1160 );
						camera.lookAt( scene.position );
						
						/*controls = new THREE.TrackballControls( camera );

					controls.rotateSpeed = 1.0;
					controls.zoomSpeed = 0.5;
					controls.panSpeed = 0.8;
					
					controls.noRotate = true;
					controls.noZoom = false;
					controls.noPan = true;

					controls.staticMoving = false;
					controls.dynamicDampingFactor = 0.3;

					controls.keys = [ 65, 83, 68 ];
					//controls.addEventListener( 'change', render );*/
					
	    scene.add( camera );
		addLights();
		
		
		
		/***********************************TEST AREA FOR HEIGHTMAP *******************/
			
		THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

		ge.initialize(["asset/textures/dds/desert-texture.dds",
     													 "asset/textures/dds/dirt-512.dds",
     													 "asset/textures/dds/rock-512.dds",
     													 "asset/textures/dds/rock-512.dds",
     													 "asset/textures/dds/bsand-512.dds"
     													 ], [ "asset/textures/dds/desert-texture_normal.dds",
        													   "asset/textures/dds/dirt-512_normal.dds",
         													   "asset/textures/dds/rock-512_normal.dds",
         													   "asset/textures/dds/rock-512_normal.dds",
         													   "asset/textures/dds/bsand-512_normal_2.dds"     													
         													 ], "asset/models/podloze.js");
		ge.load();
		
		
			var bumpTexture = new THREE.ImageUtils.loadTexture( 'asset/textures/'+quality+'/heightmap.jpg' );
		bumpTexture.wrapS = bumpTexture.wrapT = THREE.RepeatWrapping; 
		// magnitude of normal displacement
		var bumpScale   = 100.0;
		
		
		/*var kamienieTexture = new THREE.ImageUtils.loadTexture( 'asset/textures/'+quality+'/kamienie.png' );
		kamienieTexture.wrapS = kamienieTexture.wrapT = THREE.RepeatWrapping; 
		
		var kamienieNormal = new THREE.ImageUtils.loadTexture( 'asset/textures/'+quality+'/kamienie_normal.png' );
		kamienieNormal.wrapS = kamienieNormal.wrapT = THREE.RepeatWrapping; 
		*/
		
		
		
		var DDSloader1 = new THREE.DDSLoader();
		
		var terrainNormalMap = DDSloader1.load( 'asset/textures/dds/desert-texture_normal.dds' );
		terrainNormalMap.anisotropy = 4;
		terrainNormalMap.wrapS = terrainNormalMap.wrapT = THREE.RepeatWrapping; 
		
		var oceanTexture =  DDSloader1.load( 'asset/textures/dds/desert-texture.dds' );
		oceanTexture.anisotropy = 4;
		oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping; 
		
		
		var sandyTexture =  DDSloader1.load( 'asset/textures/dds/dirt-512.dds');
		sandyTexture.anisotropy = 4;
		sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping; 
		
		var grassTexture =  DDSloader1.load( 'asset/textures/dds/rock-512.dds' );
		grassTexture.anisotropy = 4;
		grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping; 
		
		var rockyTexture =  DDSloader1.load( 'asset/textures/dds/rock-512.dds' );
		rockyTexture.anisotropy = 4;
		rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping; 
		
		var snowyTexture =  DDSloader1.load( 'asset/textures/dds/bsand-512.dds' );
		snowyTexture.anisotropy = 4;
		snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping; 
		//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>. Normal maps
		
		var oceanTextureNormal =  DDSloader1.load( 'asset/textures/dds/desert-texture_normal.dds' );
		oceanTextureNormal.anisotropy = 4;
		oceanTextureNormal.wrapS = oceanTextureNormal.wrapT = THREE.RepeatWrapping; 
		
		var sandyTextureNormal =  DDSloader1.load( 'asset/textures/dds/dirt-512_normal.dds' );
		sandyTextureNormal.anisotropy = 4;
		sandyTextureNormal.wrapS = sandyTextureNormal.wrapT = THREE.RepeatWrapping; 
		
		var grassTextureNormal =  DDSloader1.load( 'asset/textures/dds/rock-512_normal.dds' );
		grassTextureNormal.anisotropy = 4;
		grassTextureNormal.wrapS = grassTextureNormal.wrapT = THREE.RepeatWrapping; 
		
		var rockyTextureNormal =  DDSloader1.load( 'asset/textures/dds/rock-512_normal.dds' );
		rockyTextureNormal.anisotropy = 4;
		rockyTextureNormal.wrapS = rockyTextureNormal.wrapT = THREE.RepeatWrapping; 
		
		var snowyTextureNormal =  DDSloader1.load( 'asset/textures/dds/bsand-512_normal_2.dds' );
		snowyTextureNormal.anisotropy = 4;
		snowyTextureNormal.wrapS = snowyTextureNormal.wrapT = THREE.RepeatWrapping; 
		//<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

		//snowyTexture.anisotropy=16;

		/*
		uniform float maxY; // maxymalna wysokosc terenu
				uniform float minY;
				*/
		// use "this." to create global object


		/*this.customUniforms = {
			bumpTexture:	{ type: "t", value: bumpTexture },
			bumpScale:	    { type: "f", value: bumpScale },
			oceanTexture:	{ type: "t", value: oceanTexture },
			sandyTexture:	{ type: "t", value: sandyTexture },
			grassTexture:	{ type: "t", value: grassTexture },
			rockyTexture:	{ type: "t", value: rockyTexture },
			snowyTexture:	{ type: "t", value: snowyTexture },
			maxY:           { type: "f", value: 300.0 },
			minY:           { type: "f", value: -400 }


		};*/
		
		/*this.customUniforms = {
			bumpTexture:	{ type: "t", value: bumpTexture },
			bumpScale:	    { type: "f", value: bumpScale },
			oceanTexture:	{ type: "t", value: oceanTexture },
			sandyTexture:	{ type: "t", value: sandyTexture },
			grassTexture:	{ type: "t", value: grassTexture },
			rockyTexture:	{ type: "t", value: rockyTexture },
			snowyTexture:	{ type: "t", value: snowyTexture },
			ambientLightColor:         { type: "f", value: 0.6 },
			directionalLightColor:         { type: "f", value: 0.6 },
			directionalLightDirection:         { type: "f", value: 0.6 },
			pointLightColor:         { type: "f", value: 0.6 },
			pointLightPosition: { type: "v3", value: new THREE.Vector3(123,123,123) },
			pointLightDistance: { type: "f", value: 15 },
			spotLightColor:         { type: "f", value: 0.6 },
			spotLightPosition: { type: "v3", value: new THREE.Vector3(123,123,123) },
			spotLightDistance: { type: "f", value: 15 },
			spotLightDirection:         { type: "f", value: 0.6 },
			spotLightAngleCos: { type: "f", value: 0.6 },
			spotLightExponent: { type: "f", value: 0.6 },
			hemisphereLightSkyColor: { type: "f", value: 0.6 },
			hemisphereLightGroundColor: { type: "f", value: 0.6 },
			hemisphereLightDirection: { type: "v3", value: new THREE.Vector3(123,123,123) },
		};*/
		
	//pointLightColor
		
		
		var terrainNormalMapUniforms = THREE.UniformsUtils.clone( terrain_normal_shader.uniforms );
		
		

	    var terrainUniforms = THREE.UniformsUtils.clone( terrainShader.uniforms );

	    terrainNormalMapUniforms[ "enableAO" ].value = false;
	    terrainNormalMapUniforms[ "enableDiffuse" ].value = true;
	    terrainNormalMapUniforms[ "enableSpecular" ].value = true;
	    terrainNormalMapUniforms[ "enableReflection" ].value = false;
	    terrainNormalMapUniforms[ "enableDisplacement" ].value = false;

	    terrainNormalMapUniforms[ "tNormal" ].value = terrainNormalMap;
	    terrainNormalMapUniforms[ "tDiffuse" ].value = snowyTexture;
	    terrainNormalMapUniforms[ "tSpecular" ].value = snowyTexture;
	    //terrainNormalMapUniforms[ "tAO" ].value = THREE.ImageUtils.loadTexture( "textures/normal/ninja/ao.jpg" );

	   // terrainNormalMapUniforms[ "tDisplacement" ].value = kamienieTexture;
	    //terrainNormalMapUniforms[ "uDisplacementBias" ].value = - 0.428408;
	    //terrainNormalMapUniforms[ "uDisplacementScale" ].value = 20.436143;

	    terrainNormalMapUniforms[ "uNormalScale" ].value.y = -2;
	 //   terrainNormalMapUniforms[ "wrapRGB" ].value.set( 0.575, 0.5, 0.5 );

	    var ambient = 0x111111, diffuse = 0xbbbbbb, specular = 0x060606, shininess = 0;
	    terrainNormalMapUniforms[ "diffuse" ].value.setHex( diffuse );
	    terrainNormalMapUniforms[ "specular" ].value.setHex( specular );
	    terrainNormalMapUniforms[ "ambient" ].value.setHex( ambient );

	    terrainNormalMapUniforms[ "shininess" ].value = shininess;

	   // terrainNormalMapUniforms[ "tCube" ].value = reflectionCube;
	   // terrainNormalMapUniforms[ "reflectivity" ].value = 0.1;

	    terrainNormalMapUniforms[ "diffuse" ].value.convertGammaToLinear();
	    terrainNormalMapUniforms[ "specular" ].value.convertGammaToLinear();
	    terrainNormalMapUniforms[ "ambient" ].value.convertGammaToLinear();
	    
	       /* terrainUniforms[ "oceanTexture" ].value = THREE.ImageUtils.loadTexture( 'asset/textures/desert-texture.jpg' );
	        terrainUniforms[ "sandyTexture" ].value = THREE.ImageUtils.loadTexture( 'asset/textures/dirt-512.jpg' );
	        terrainUniforms[ "grassTexture" ].value = THREE.ImageUtils.loadTexture( 'asset/textures/rock-512.jpg' );
	        terrainUniforms[ "rockyTexture" ].value = THREE.ImageUtils.loadTexture( 'img/rock-512.jpg' );
	        terrainUniforms[ "snowyTexture" ].value = THREE.ImageUtils.loadTexture( 'img/bsand-512.jpg' );

	        */

	    terrainNormalMapUniforms[ "oceanTexture" ].value = oceanTexture;
	    terrainNormalMapUniforms[ "sandyTexture" ].value = sandyTexture;
	    terrainNormalMapUniforms[ "grassTexture" ].value = grassTexture;
	    terrainNormalMapUniforms[ "rockyTexture" ].value = rockyTexture;
	    terrainNormalMapUniforms[ "snowyTexture" ].value = snowyTexture;
	    
	    terrainNormalMapUniforms[ "oceanTextureNormal" ].value = oceanTextureNormal;
	    terrainNormalMapUniforms[ "sandyTextureNormal" ].value = sandyTextureNormal;
	    terrainNormalMapUniforms[ "grassTextureNormal" ].value = grassTextureNormal;
	    terrainNormalMapUniforms[ "rockyTextureNormal" ].value = rockyTextureNormal;
	    terrainNormalMapUniforms[ "snowyTextureNormal" ].value = snowyTextureNormal;
	       // terrainUniforms[ "texture_shadow" ].texture = terrainShadowmap;
	    terrainNormalMapUniforms[ "maxY" ].value = 410.0;
	    terrainNormalMapUniforms[ "minY" ].value = -200.0;

		
	    var customMaterial = new THREE.ShaderMaterial( 
	            {   
	                uniforms: terrainNormalMapUniforms,
	                vertexShader: terrain_normal_shader.vertexShader,
	                fragmentShader: terrain_normal_shader.fragmentShader,
	                fog: true,
	                lights: true
	            }
	        );
	    
	   /* var customMaterial = new THREE.ShaderMaterial( 
	        {   
	            uniforms: terrainUniforms,
	            vertexShader: terrainShader.vertexShader,
	            fragmentShader: terrainShader.fragmentShader,
	            fog: true,
	            lights: true
	        }
	    );*/

		
			
		/*var planeGeo = new THREE.PlaneGeometry( 1000, 1000, 100, 100 );
		var plane = new THREE.Mesh(	planeGeo, customMaterial );
		plane.rotation.x = -Math.PI / 2;
		plane.position.y = -100;
		plane.receiveShadow = true;
		scene.add( plane );
	    objects.push(plane);*/
	    var TestMaterial =  new THREE.MeshPhongMaterial( { ambient: 0x123123, color: 0xFF0000, specular: 0xFFFFFF, shininess: 30, transparent: true } );
			
			
	/***************************** EOF TEST AREA FOR HEIGHTMAP *******************/	
		
			

		//scene.fog = new THREE.FogExp2( 0xffffff, 0.0003 );
		//scene.fog.color.setHSL( 0.1, 0.10, 1 );				
	    //scene.add( cube2 );
		//objects.push(cube2);
		var loader2 = new THREE.JSONLoader();
		console.log("przed: " + scene.children.length);
	    
	    //  clickPointer.initialize();
	    console.log("po: " + scene.children.length);

			
		//******************************** test
	    

	    
	    //**********************************
	    
	    
	    
		var modelsLoader = new ModelsLoader();
		//modelsLoader.Load_wCustomShader("asset/models/podloze.js", scene, customMaterial, objects);
		//modelsLoader.Load_wCustomShader("asset/models/podloze.js", scene, TestMaterial, objects);
		
		var staticobjectslist = [ {"model_path":"asset/models/barrels-1.js", "textured" : true, "texture_path": "asset/textures/dds/oildrum_col.dds" },
		     						 {"model_path":"asset/models/truck-1.js", "textured" : true, "texture_path": "asset/textures/dds/truck_d.dds" },
		     						 {"model_path":"asset/models/truck-2.js", "textured" : true, "texture_path": "asset/textures/dds/veh_kama.dds" },
		     						/* {"model_path":"asset/models/dev_cars.js", "textured" : true, "texture_path": "asset/textures/dds/car_scrap_d.dds" },*/
		     						 {"model_path":"asset/models/tree.js", "textured" : true, "texture_path": "asset/textures/High/rock-512.jpg" },
		     						 {"model_path":"asset/models/namioty.js", "textured" : true, "texture_path": "asset/textures/dds/Tent_Defuse.dds" },
		     						 {"model_path":"asset/models/test/house.js", "textured" : false, "texture_path": "" },
		     						 {"model_path":"asset/models/test/plot_metalowy.js", "textured" : false, "texture_path": "" }
		     						];
		var ooo = [];
		
		for(var i=0; i<staticobjectslist.length; i++)
		{
			ooo.push(new StaticObject(staticobjectslist[i].model_path, staticobjectslist[i].texture_path));
		}


		for(var i=0; i<ooo.length; i++)
		{
			ooo[i].load();
		}
		
		
		/*modelsLoader.Load("asset/models/barrels-1.js", 	'asset/textures/dds/oildrum_col.dds', 	scene, null);
		modelsLoader.Load("asset/models/truck-1.js", 	'asset/textures/dds/truck_d.dds', 		scene, null);
		modelsLoader.Load("asset/models/budynek.js", 	'asset/textures/'+quality+'/concrete.jpg', 		scene, null);
		modelsLoader.Load("asset/models/truck-2.js",	'asset/textures/dds/veh_kama.dds', 		scene, null);
		modelsLoader.Load("asset/models/dev_cars.js", 	'asset/textures/dds/car_scrap_d.dds', 	scene, null);
		modelsLoader.Load("asset/models/tree.js", 		'asset/textures/'+quality+'/rock-512.jpg', 		scene, null);
		modelsLoader.Load("asset/models/namioty.js", 		'asset/textures/dds/Tent_Defuse.dds', 		scene, null);
		//modelsLoader.Load("asset/models/bud-1.js", 		'asset/textures/'+quality+'/beton.jpg', 		scene, null);

		
		modelsLoader.LoadWithoutTexPath("asset/models/test/house.js",scene, null);
		
		modelsLoader.LoadWithoutTexPath("asset/models/test/plot_metalowy.js",scene, null);*/

		var runnerMaterial = new THREE.MeshBasicMaterial( { map: runnerTexture, side:THREE.DoubleSide, transparent: true } );
		var runnerGeometry = new THREE.PlaneGeometry(50, 50, 1, 1);
		var runner = new THREE.Mesh(runnerGeometry, runnerMaterial);
		runner.position.set(-100,100,0);
		scene.add(runner);
		
		clickPointer = new ClickPointer(); //kurwa nie wiem jak to zrobic zeby bylo ladowanie w srodku obiektu... cos pewnie z domknieciami funkcji. nie wiem
		loader2.load( "asset/models/pointer.js", function (geometry) {

		  var material =  new THREE.MeshPhongMaterial( { ambient: 0x123123, color: 0xFF0000, specular: 0xFFFFFF, shininess: 30, transparent: true } );
		  
		  // create a mesh with models geometry and material
		  var mesh = new THREE.Mesh(
			geometry,
			material
		  );
		  
		  mesh.rotation.y = Math.PI/5;
		  mesh.scale.set(2, 2, 2);
		 // mesh.castShadow = true;
		 // mesh.receiveShadow = true;
		 // clickPointer.model = mesh1;

		  clickPointer.model=mesh;
		  clickPointer.exist=true;
		  clickPointer.model.visible=false;
		  
		 // console.log("przed - w klasie: " + scene.children.length);
		  scene.add(clickPointer.model);
		  //console.log("po - w klasie: " + scene.children.length);
		});
		
		
		
		
	   
	 
	 		//************************ PARTICLES **************************** //

			//TODO
		
			//**************************************************************** //
			
			
			
		
		
		
		
		
		
		
		
	 	//loadModel2('source/models/model.js', new THREE.MeshPhongMaterial( { ambient: 0x123123, color: 0xEECCFF, specular: 0xFFFFFF, shininess: 30 } ), p);
		//-------- BLOOM -----
		renderer.autoClear = false;
		
		switch(quality)
		{
		case "High":
			renderModel = new THREE.RenderPass( scene, camera );
			effectBloom = new THREE.BloomPass( 0.7, 25, 4, 256 );
			effectCopy = new THREE.ShaderPass( THREE.CopyShader );

			effectCopy.renderToScreen = true;

			composer = new THREE.EffectComposer( renderer );

			composer.addPass( renderModel );
			composer.addPass( effectBloom );
			composer.addPass( effectCopy );
			break;
			
		case "Medium":
			renderModel = new THREE.RenderPass( scene, camera );
			effectBloom = new THREE.BloomPass( 0.7, 10, 2, 256 );
			effectCopy = new THREE.ShaderPass( THREE.CopyShader );

			effectCopy.renderToScreen = true;

			composer = new THREE.EffectComposer( renderer );

			composer.addPass( renderModel );
			composer.addPass( effectBloom );
			composer.addPass( effectCopy );
			break;
		
		}
		
		/*if(quality!="Low")
		{
			renderModel = new THREE.RenderPass( scene, camera );
			effectBloom = new THREE.BloomPass( 0.7, 10, 2, 256 );
			effectCopy = new THREE.ShaderPass( THREE.CopyShader );

			effectCopy.renderToScreen = true;

			composer = new THREE.EffectComposer( renderer );

			composer.addPass( renderModel );
			composer.addPass( effectBloom );
			composer.addPass( effectCopy );
		}*/

						
		p = new PlayerGamma(un);

		p.x=0;
		p.z=0;
		//mainhero.push(p);
		actors.push(p);
		
		//loader.load( "asset/models/buffalo2.js", function( geometry,materials ) { createScene(geometry,materials,p);} );
		p.initialize("asset/models/buffalo2.js", new THREE.Vector3(0,0,0));
		p.load();	
		//p.model.receiveShadow = true;
//		console.log(" aktora zaladowalo");
		
		
		
		window.addEventListener( 'resize', onWindowResize, false );
		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mousewheel', mousewheel, false );
		document.addEventListener( 'DOMMouseScroll', mousewheel, false ); 
		
	}
	
	
	
	
	
	function mousewheel( event ) {

		event.preventDefault();
		event.stopPropagation();

		var delta = 0;

		if ( event.wheelDelta ) { // WebKit / Opera / Explorer 9

			delta = event.wheelDelta / 40;

		} else if ( event.detail ) { // Firefox

			delta = - event.detail / 3;

		}
		
		var mousezoom = new THREE.Vector3();
		var temppositionx = camera.position.x;
				mousezoom.x = camera.position.x;
				mousezoom.y = camera.position.y;
				mousezoom.z = camera.position.z;
				
				
				
		
		if(delta<0)
		{ 
		   mousezoom.addScalar(40);
		}
		else
		{
		   mousezoom.addScalar(-40);
		}
		
		camera.position.set(temppositionx,mousezoom.y,mousezoom.z);
		if(p.moveAction)
				 {

					 camera.lookAt( new THREE.Vector3(p.x,0,p.z) );

					 }
		
		
		
//console.log("krecisz mysza: "+delta);
console.log("pozycja kamery: "+camera.position.x +" "+ camera.position.y  +" "+camera.position.z);
		/*_zoomStart.y += delta * 0.01;
		_this.dispatchEvent( startEvent );
		_this.dispatchEvent( endEvent );*/

	}
	
	
	
	function LH(temp)
	{
	return function(geometry,materials) 
	               { 
				   createScene(geometry,materials,temp); 
				   actors.push(temp); 
				   temp.text.style.color="yellow";
				   }
	}
	function newUser(username,x,z,r) // function to create new user
	{
		var temp = new PlayerBeta(username);
		
		//var loader2 = new THREE.JSONLoader();
		//loader.load( "source/models/buffalo2.js", function( geometry,materials ) { createScene(geometry,materials,temp)} );
		loader.load( "asset/models/buffalo2.js", LH(temp) );
		
		
		//actors.push(temp);
		
		temp.x=x;
		temp.z=z;
		temp.r=r;
		//temp.model.rotation.y=rot;
	}
// end of INITIALIZE ===================================================

// FUNCTIONS      ======================================================


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
function createScene( geometry, materials, pi) {

				ensureLoop( geometry.animation );

				geometry.computeBoundingBox();
				var bb = geometry.boundingBox;

				
				for ( var i = 0; i < materials.length; i ++ ) {

					var m = materials[ i ];
					m.skinning = true;
					//m.morphTargets = true;

					m.alphaTest = 0.75;

   				m.ambient.copy( m.color );


					m.wrapAround = true;

				}
				var s = 1; //skale
				var mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial( materials ) );
				mesh.position.set( pi.x, 0 - bb.min.y * s, pi.z );
				mesh.scale.set( s,s,s );
				scene.add( mesh );

							
				mesh.castShadow = true;
				mesh.receiveShadow = false;
				//console.log("ustawiam model" + pi);
                pi.model = mesh;
				pi.y_poczatkowy=0 - bb.min.y * s;
				//playerInstance.textPosX = mesh.position.x;
				//playerInstance.textPosY = mesh.position.;
				pi.text.style.left =  conv3DtoScreen(mesh).x + 'px';
                pi.text.style.top = -35+conv3DtoScreen(mesh).y+ 'px';
				//animation = new THREE.Animation( mesh, geometry.animations.name );
				//animation.JITCompile = false;
				//animation.interpolationType = THREE.AnimationHandler.LINEAR;
				pi.loadingcomplete=true;
				
				helper = new THREE.SkeletonHelper( mesh );
				helper.material.linewidth = 3;
				helper.visible = false;
				scene.add( helper );
				
				animation = new THREE.Animation( mesh, geometry.animation );
				animation.play();
			//	console.log("zaladowano name"+pi.username);
				

			}		
function PlayerBeta(username)
		{
			this.model;
			this.speed = 100; // im wieksza tym wolniej sie porusza model. 
			this.moveVector = new THREE.Vector3();
			this.moveAction = false;
			this.iterations = 0;
			this.nativeAngle=90;
			this.x=0;
			this.z=0;
			this.y_poczatkowy=0;
			this.username=username;
			// Tu koniecznie trzeba dac ladowanie modelu bo kurwa inaczej nie da rady zeby bylo dobrze
            this.text = document.createElement( 'div' );
            this.text.style.position = 'absolute';
            this.text.innerHTML = username;
			this.text.style.zIndex =1;
			this.text.style.color="red";
            this.text.style.fontWeight="bold";
           // this.moveInterval;
            this.textPosX=-50;
			this.textPosY=-50;
			this.text.style.left=50+"px";
			this.text.style.top= 50+"px";
			this.loadingcomplete=false;
			this.r=0;
            // this.text.style.left =  conv3DtoScreen(this.model).x + 'px';
            // this.text.style.top = conv3DtoScreen(this.model).y+ 'px';
			document.body.appendChild( this.text);
			this.setOnPosition = function(xx,zz)
			{
				this.x=xx;
				this.z=zz;
				//this.moveAction=false;
				this.model.position.x=xx;
				this.model.position.z=zz;
			}
			this.sendMoveMsg= function(bx,bz)
			{
				sendMoveToMsg(bx,bz, this.r);
			}
			//---------------------------------------------------------------------
			var distancesteps=0;
			var step=60;
			var moveAngle=0;
			//---------------------------------------------------------------------
			this.moveTo2 = function(bx,bz)
			{
			
			   moveAngle=Math.atan2(bz-this.model.position.z, bx-this.model.position.x)*180/Math.PI;
			   var angle = moveAngle - this.nativeAngle;
			   this.r=(-angle*Math.PI)/180;
			   this.model.rotation.y = this.r;
			   var _xdistance = Math.sqrt(Math.pow(this.model.position.x-bx,2));
			   var _zdistance = Math.sqrt(Math.pow(this.model.position.z-bz,2));
			   distancesteps = Math.sqrt(Math.pow(_xdistance,2)+Math.pow(_zdistance,2))/step; //ilosc krokow na danej odleglosci
			   
			   
			   
			   
			}
			/* to ponizej jest dobrze ale... ale wymaga poprawek ktore uzyje w funkcji moveTo2 */
		    this.moveTo = function(bx,bz)
			{
			
			//socket.emit("MsgMove", {id:"mymove"});
			//console.log(socket.handshake.address.address +" : "+socket.handshake.address.port);
			   this.iterations = 0;
			   var v1 = 0;
			   var v2 = 0;
			   var angle = Math.atan2(bz-this.model.position.z, bx-this.model.position.x)*180/Math.PI - this.nativeAngle;
			   //console.log("kat to: "+angle);
			   //console.log("kat rzeczywisty to: "+Math.atan2(bz-this.model.position.z, bx-this.model.position.x)*180/Math.PI)
			   this.r=(-angle*Math.PI)/180;
			   this.model.rotation.y = this.r;
			   //sendMoveToMsg(bx,bz, this.r);
			   var _xdistance = Math.sqrt(Math.pow(this.model.position.x-bx,2));
			   var _zdistance = Math.sqrt(Math.pow(this.model.position.z-bz,2));
			   
			   //var intervx=_xdistance/speed;
			   //var intervy=_zdistance/speed;
			   
			   
			   v1 = (this.model.position.x<bx) ? (_xdistance)/this.speed : (_xdistance*-1)/this.speed;
			   v2 = (this.model.position.z<bz) ? (_zdistance)/this.speed : (_zdistance*-1)/this.speed;
			   v1 = Math.round(v1 * 10) / 10;
			   v2 = Math.round(v2 * 10) / 10;

			   this.moveVector = new THREE.Vector3(v1,0,v2);
			   this.moveAction = true;
			   
			 /*console.log("Username: "+this.username+"\n"+
			             "  move vector: "+v1+" "+v2+"\n"+
						 "  speed: "+this.speed+"\n"+
						 "  distance: "+_zdistance+"\n"+
						 "  loading complete: "+this.loadingcomplete);*/
			   
			}
			
			this.Update = function(ground_objects)
			{
				this.model.rotation.y = this.r;
				
			    if(this.iterations>this.speed)
				{
				this.moveAction = false;
				this.iterations = 0;
				//console.log("ruch stop at: "+this.x+" "+this.z+" kat:"+this.r);
				}
				if(this.moveAction)
					{
					//console.log("=========== update ==============");
					//console.log("   model pos: "+ this.model.position.x +" "+ this.model.position.z);
					
					
					this.model.position.x += this.moveVector.x;
					this.model.position.z += this.moveVector.z;
					//this.model.position.x = Math.round(this.model.position.x);
					//this.model.position.z = Math.round(this.model.position.z);
					
					this.x = this.model.position.x;
					this.z = this.model.position.z;
					this.iterations++;
					//console.log(conv3DtoScreen(this.model).x,conv3DtoScreen(this.model).y);
					
					 
					}
					this.text.style.left =  conv3DtoScreen(this.model).x + 'px';
                    this.text.style.top = -35+conv3DtoScreen(this.model).y+ 'px';
					
				
			
			}
		}

function animate() {

	requestAnimationFrame( animate );
   
	annie.update();
	render();
	console.log( "Loaded objects: "+cm.objectsLoaded + ", objects total: "+cm.totalObjectsCount);
	stats.update();
}

function render()
{
		

		//renderer.clear();
				 
		var delta = 0.75 * clock.getDelta();
		
		var time = Date.now() * 0.00005;
		theta += 0.1;
					
		
				if(p.moveAction)
				 {
				     camera.position.x += p.moveVector.x;
					 camera.position.z += p.moveVector.z;
					 camera.up = new THREE.Vector3(0,1,0);
					 camera.lookAt( new THREE.Vector3(p.x,0,p.z) );
					  
					// dirLight.position.set( p.model.position.x+2000, 2000, p.model.position.z );
					// dirLight.target.position.set( p.model.position.x, 0, p.model.position.z );
					 
					 
					 plight.position.set(p.model.position.x, p.model.position.y+100, p.model.position.z);

				}
					
				
				
				
			    if(clickPointer.exist)
			    {

					clickPointer.Update(p.moveAction);
		 		}					 

				THREE.AnimationHandler.update( delta );	

				
				if(quality!="Low")
				{
					composer.render( 0.6 );
				}
				else
				{
					renderer.render( scene, camera );
				}

		

			for (var i=0; i<actors.length; i++) {
			
					if(actors[i].loadingcomplete)
					{

					actors[i].Update(objects);			

					}
				}

				
				 
				 
				


		}

		function returnActorUpdate(x)
		{		
		(function(){
		x.Update();
		}
		)();
		/*console.log("weszlo");
		return function()
			{
				(functioactors[x].Update();)();
			// return console.log("ale zajebiscie");
			}*/
		}

		
	
	 
function addLights()
					{
							
							
							plight= new THREE.PointLight();// = function ( color, intensity, distance ) 
							plight = new THREE.PointLight(0xFFFFFF, 1.3, 2400);
							plight.position.set( 0, 100, 0);
							scene.add(plight);
							/*var spotLight = new THREE.SpotLight();
							spotLight.angle =  Math.PI / 2;
							spotLight.position.set( 0, 100, 0);
							spotLight.castShadow = false;
							spotLight.intensity = 10;
							spotLight.exponent = 10;
							scene.add(spotLight);*/
	
							
							
							
									var hemiLight =  new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
							        hemiLight.color.setHSL( 0.6, 1, 0.6 );
									hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
									hemiLight.position.set( 15000, 500, 0 );
									scene.add( hemiLight );

									//

									dirLight = new THREE.DirectionalLight( 0xffffff, 1);
									dirLight.shadowCameraVisible = false;
									//dirLight.position.multiplyScalar( 50 );
									//dirLight.shadowCameraVisible = true;
									
									scene.add( dirLight );

									var shadowmapsize;

									dirLight.castShadow = true;	
									
									switch(quality) {
									case "High":
										shadowmapsize=2048;
										break;
									case "Medium":
										shadowmapsize=1024;
										break;
									case "Low":
										shadowmapsize=256;
										dirLight = new THREE.DirectionalLight( 0xffffff, 3);
										dirLight.castShadow = false;	
										break;

									} 
																	
									dirLight.color.setHSL( 0.1, 1, 0.95 );
									dirLight.position.set( 2500, 2000, 0 );
									dirLight.shadowMapWidth = shadowmapsize;
									dirLight.shadowMapHeight = shadowmapsize;

									var d = 4096;

									dirLight.shadowCameraLeft = -d;
									dirLight.shadowCameraRight = d;
									dirLight.shadowCameraTop = d;
									dirLight.shadowCameraBottom = -d;

									dirLight.shadowCameraFar = 10000;
									//dirLight.shadowBias = -0.0001;
									dirLight.shadowBias = -0.00001;
									dirLight.shadowDarkness = 0.6;
							
					}
	
function conv3DtoScreen(_model)
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
function onDocumentMouseDown( event ) {

				event.preventDefault();


//console.log(window.innerWidth+" "+window.innerHeight+" "+event.clientX +" " +event.clientY);
				var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
				
				//projector.unprojectVector( vector, camera ); //
				vector.unproject( camera ); // vector.unproject()?

				var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

               


				var intersects = raycaster.intersectObjects( objects );

				//console.log(intersects.length+" "+JSON.stringify(intersects[ 0 ].object.position));
				if ( intersects.length > 0 ) {
				//console.log(JSON.stringify(socket));
				var tx = Math.round(intersects[0].point.x*10)/10;
				var tz = Math.round(intersects[0].point.z*10)/10;
				
				
				p.sendMoveMsg(tx,tz);
				
				//socket.emit("MsgMoveTo", { type: "move", x: ""+intersects[0].point.x , y: ""+intersects[0].point.y });
				
				
				/*var PI2 = Math.PI * 2;
				var particleMaterial = new THREE.ParticleCanvasMaterial( {

					color: 0xffff22,
					program: function ( context ) {

						context.beginPath();
						context.arc( 0, 0, 1, 0, PI2, true );
						context.closePath();
						context.fill();

					}
					
				} );

					var radius,segments,rings;
					radius = 10;
					segments = 16;
					rings=16;
					var sphereMaterial = new THREE.MeshPhongMaterial( { ambient: 0x123123, color: 0xFF0000, specular: 0xFFFFFF, shininess: 30 } );
					var sphere = new THREE.Mesh(
					                            new THREE.SphereGeometry(radius,segments,rings),
					sphereMaterial);*/
					//sphere.position = intersects[0].point;
					//clickPointer.position = intersects[0].point;
					clickPointer.setPosition(intersects[0].point);
					
									

					scene.remove(clickPointer.pointerDecal);
					
					var decal_position = new THREE.Vector3(clickPointer.position.x,clickPointer.position.y,clickPointer.position.z);
					var decal_rotation = new THREE.Vector3(1.570796,0,0);
					var decal_scale = new THREE.Vector3(200,200,200);
					var decal_check = new THREE.Vector3(1,1,1);
					
					clickPointer.pointerDecal = new THREE.Mesh( new THREE.DecalGeometry( objects[0], decal_position, decal_rotation, decal_scale, decal_check), decalMaterial );
					clickPointer.decalExist=true;

					//clickPointer.pointerDecal=m;
					
					scene.add( clickPointer.pointerDecal );
					
					console.log("ilosc obiektow: "+scene.children.length);
				//	decals.push( m );
					//scene.add(sphere);
					
					
					
				//socket.emit("MsgMove", {id:"mymove"});
				//console.log(socket.handshake.address.address +" : "+socket.handshake.address.port);
				
				//alert(sendMoveToMsg);
				}
				}
				
		function loadModel2(_model, _mat, _typek)
		{
			var mesh;	
			
			var material = _mat || new THREE.MeshBasicMaterial({
						    color: '0x' + Math.floor(Math.random() * 16777215).toString(16),
						    wireframe: true
						});
			var jsonLoader = new THREE.JSONLoader();
				jsonLoader.load( _model, 
										function( geometry ) { 
										mesh = new THREE.Mesh( geometry, material);
										mesh.scale = new THREE.Vector3( 1, 1, 1 );
										mesh.castShadow = true;
										_typek.model=mesh;
										scene.add(mesh);
															},null )
		}

	  function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}
// end of FUNCTIONS ======================================================

//==================================== sockets events =======

 socket.on("MsgLogInAck", function(data)
				{
					//alert(data);
					var element = document.getElementById("log_content");
                    element.parentNode.removeChild(element);
				    document.body.style.background = "black";
					
					StartGame();
					
				}
                );
socket.on("MsgUserGoesTo", function(data)
				{
					for(ac in actors)
					{
						if(data.u==actors[ac].username)
						{
						actors[ac].moveTo(data.x,data.z);
						}
					}
					
				}
                );
				
socket.on("MsgNewUser", function(data)
				{
					$('<p>'+data.user+' logged</p>').appendTo('#ConsoleContent');
					newUser(data.user, data.x, data.z, data.r);
					//alert(data.user);
				}				
				);
				
				function LoadHelper(username,x,z)
				{
				//console.log("start return");
				return function()
					{
						//console.log("start");
						var temp2 = new PlayerBeta(username);
						//console.log("load start: "+ username+" "+x+" "+z);
						var loader2 = new THREE.JSONLoader();
						loader2.load( "asset/models/buffalo2.js", function( geometry,materials ) { createScene(geometry,materials,temp2); 
																									actors.push(temp2);	} );
						
						temp2.x=x;
						temp2.z=z;
						console.log("load end: "+ username+" "+x+" "+z);
					};
				}
				
socket.on("MsgOldUsers", function(data)
				{
					//newUser(data.username, data.x, data.z);
					//console.log("received array length: "+data.length);
					
					for(c in data)
					{
					//console.log("przetwarzany model: "+c);
						newUser(data[c].username, data[c].x, data[c].z, data[c].r);		
						//LoadHelper(data[c].username, data[c].x, data[c].z);						
					}
					
					// newUser(data[x].username, data[x].x, data[x].z);
					
					
				}
				);
socket.on("MsgMoveCue", function(data) // to chyba nie bedzie potrzebne. Patrz nizej do notki 1.0
				{
					p.moveTo(data.x,data.z);
				}
);
		





/* Notatki
1.0 - w momencie wystapienia ruchu wysylany jest do serwera message MsgMoveTo ktory przekazuje informacje ze chcemy sie poruszyc do pewnego punktu x,z. Informacja
ta zostaje rozpropagowana do wszsytkich klientow lacznie z klientem ktory wyslal ta wiadomosc. Pierwotny pomysl byl taki aby do klienta wywolujacego zdarzenie szedl
osobmy msg. Niestety nie wiem nadal dlaczego wystepuja pewnego rodzaju opoznienia w ruchu pomiedzy uzytkownikami a glownym aktorem. tzn aktor porusza sie szybciej niz wtedy kiedy jest on 
glownym aktorem.



*/
		
/*var start = new Date().getTime(),
    time = 0,
    elapsed = '0.0',
	timeinterval = 1000/60;

function instance()
{
for(h in mainhero)
	{
	mainhero[h].Update();
	
	}
    time += timeinterval;
    elapsed = Math.floor(time / timeinterval) / 10;	
    if(Math.round(elapsed) == elapsed) { elapsed += '.0'; }
    var diff = (new Date().getTime() - start) - time;
console.log("odswiezane co 60 ms:"+elapsed+" time:"+time+" diff:"+diff);
    window.setTimeout(instance, (timeinterval - diff));
}

window.setTimeout(instance, timeinterval);*/
		//timer demo function with normal/self-adjusting argument
		
		

		
		
		
		
		
