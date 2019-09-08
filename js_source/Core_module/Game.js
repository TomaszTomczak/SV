var gameState; // into, game
var subGameState;
var clock = new THREE.Clock();
var width = window.innerWidth-30;
var height = window.innerHeight-30;
var projector = new THREE.Projector();
var renderer = new THREE.WebGLRenderer( { alpha: false, antialias: true, clearColor: 0x000000, clearAlpha: 1 } );
var rendererIntro = new THREE.WebGLRenderer( { alpha: true, antialias: true, clearColor: 0x000000, clearAlpha: 1 } );
var scene = new THREE.Scene();
var sceneIntro = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000 );


// globalne scierwo
var sc;  // Server Connection
var cm; // Content Manager
var ui; // User Interface
var is; // Intro Scene



var cameraIntro = new THREE.PerspectiveCamera(45, width / height, 1, 10000 );
var loader = new THREE.JSONLoader();
animate();

	function start()
	{
		sc = new ServerConnection();
		cm = new ContentManager();
		ui = new UserInterface();
		is = new IntroScene();	
		
		ui.createWelcomePage();	
		
	}
	
	function loginToGREY()
	{
		sc.sendLogin(document.getElementById('user').value, document.getElementById('password').value);
		
	}
	
	function loginComplete(data) // inicjalizacja pierwszej planszy z widokiem na bohatera i jego parametry
	{
		is.initialize(data);
	}
	
	function startTheGame()
	{
		sc.startAndFetch("szatanJeJelito");
	}
	
	function initialDataLoad(data)
	{
		cm.createProgressBar();
		cm.initialDataLoad(data);
	}
	
	function changeGameState(state)
	{
		gameState=state;
	}
	
	function initializeGame()
	{
		gameState="preload";
		console.log("initialize game start");
		//renderer = new THREE.WebGLDeferredRenderer( { antialias: true, tonemapping: THREE.UnchartedOperator, brightness: 2, scale: 1 } );
		console.log("renderer set");
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFShadowMap;
		renderer.sortObjects = true;
		renderer.gammaInput = true;
		//renderer.shadowMapSoft = true;
		renderer.gammaOutput = true;
		//renderer.shadowMapSlopeDepthBias = true;
		//renderer.shadowMapCullFace = THREE.CullFaceBack;
		
		camera.position.set( 2260,3390,3390 );
		camera.lookAt( scene.position );
		scene.fog = new THREE.FogExp2( 0x967b4b, 0.00012 );
		scene.add(camera);
		
		
		
		/*// SSAO
		console.log("add ssao");
		var effectSSAO = new THREE.ShaderPass( THREE.SSAOShader );
		console.log("ssao defined");
		effectSSAO.uniforms[ 'size' ].value.set( window.innerWidth, window.innerHeight );
		effectSSAO.uniforms[ 'cameraNear' ].value = camera.near;
		effectSSAO.uniforms[ 'cameraFar' ].value = camera.far;
		//effectSSAO.uniforms[ 'fogEnabled' ].value = 0;
		effectSSAO.uniforms[ 'aoClamp' ].value = 0.5;
		effectSSAO.uniforms[ 'lumInfluence' ].value = 0.59;
		//effectSSAO.uniforms[ 'onlyAO' ].value = 1;

		effectSSAO.material.defines = { "FLOAT_DEPTH": true };
		
		//effectSSAO.renderToScreen = true;
		//composer.addPass( effectSSAO );
		
		renderer.addEffect( effectSSAO, "tDepth" );
		// end of SSAO*/
		
		//animate();
		gameState="loading";
		cm.loadData();
		ui.prepareEvents();
		ui.createStats();
	
	}

	function render()
	{		
			renderer.render( scene, camera );		
	}

	
	// main loop
	function animate() {
	
		requestAnimationFrame( animate );
		var delta = 0.75 * clock.getDelta();
		
		switch(gameState)
		{
		case "intro" :
			is.player.Update(delta);
			rendererIntro.clear();
			rendererIntro.render( sceneIntro, cameraIntro );
			break;
		case "preload":
			break;
		case "loading":
			cm.updateProgressBar();
			break;
		case "loadingComplete":
			changeGameState("game");
			break;
		case "game":
		//case "objectMenuShowed":
			
			THREE.AnimationHandler.update( delta );	
			camera.updateProjectionMatrix();
			ui.updateStats();
			windows.update();
			if(cm.player.moveAction)
			{
				camera.position.x += cm.player.moveVector.x;
				camera.position.z += cm.player.moveVector.z;
				camera.up = new THREE.Vector3(0,1,0);
				camera.lookAt( new THREE.Vector3(cm.player.x,0,cm.player.z) );	  

			}


			cm.update(delta); // update content managera
			render();	
			break;

		default: break;

		}
		
		
	
	}

