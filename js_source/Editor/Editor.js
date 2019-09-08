var gameState; // into, game
var clock = new THREE.Clock();
var width = window.innerWidth-30;
var height = window.innerHeight-30;
var projector = new THREE.Projector();
var renderer = new THREE.WebGLRenderer( { alpha: false, antialias: true,  devicePixelRatio: 1.0 ,clearColor: 0x000000, clearAlpha: 1 } );
var rendererIntro = new THREE.WebGLRenderer( { alpha: true, antialias: true, clearColor: 0x000000, clearAlpha: 1 } );
var scene = new THREE.Scene();
var sceneIntro = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000000 );
var controls;
var currentObject=null;
var editorState; // state of editor. Poruszanie elementem, dodawanie elementu itp
var loader = new THREE.JSONLoader();
var DDSloader = new THREE.DDSLoader();
// globalne scierwo
var sc;  // Server Connection
var cm; // Content Manager
var ui; // User Interface
var is; // Intro Scene
var decalDummy=null;
var gui; // controllers
var editorOptions = new EditorOptions();
var cameraIntro = new THREE.PerspectiveCamera(45, width / height, 1, 10000 );
var loader = new THREE.JSONLoader();
animate();



	function start()
	{
		sc = new ServerConnection();
		cm = new ContentManager();
		ui = new UserInterface();
		is = new IntroScene();	
		
		//ui.createWelcomePage();	
		sc.startAndFetch("szatanJeJelito");
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
		console.log("game state changed from: "+gameState)
		gameState=state;
		console.log("to: "+state);
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
		renderer.shadowMapSoft = true;
		renderer.gammaOutput = true;
		//renderer.shadowMapSlopeDepthBias = true;
		//renderer.shadowMapCullFace = THREE.CullFaceBack;
		
		camera.position.set( 2260,3390,3390 );
		camera.lookAt( scene.position );
		scene.fog = new THREE.FogExp2( 0x967b4b, 0.00012 );
		scene.add(camera);
		
		window.addEventListener( 'resize', onWindowResize, false );
		renderer.domElement.addEventListener("mousemove", onMouseMove);
		renderer.domElement.addEventListener("mousedown", onMouseDown);
		document.addEventListener("keydown", onKeyDown);
		

		gameState="loading";
		cm.loadData();
		ui.createStats();
		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.damping = 0.2;
	//	controls.addEventListener( 'change', render );
		
		
		
		
		//gui.add(options, 'wireframe');

		
		
		
	
	}

	function createOptionsGui()
	{
		/*gui = new dat.GUI();
		gui.add(options, 'wireframe');
		var folder = gui.addFolder( "Edit terrain" );
		folder.add( options,"rysujzedrzewa"  ).name( "rysuj drzewa"  );
		folder.add( options,"rysujzetrawe"  ).name( "rysuj trawe" );*/
		
		editorOptions.initializeGuiOptions();
	}
	
	function selectObject()
	{
		editorState = "selectObj";
	}
	
	function beginAddPlant(selected_object, plantObject, plantsRandomSize, plantsRandomPosition, plantsContinous, spreadSize, spreadCount, cached_textures, cached_alpha_maps)
	{
		switch(plantObject)
		{
		case "tree": 
			
			console.log(selected_object);
				var s_xyz=getRandomArbitrary(0.4,0.8);
				var scale=new THREE.Vector3(s_xyz,s_xyz,s_xyz);
				var rotation=new THREE.Vector3(0,(Math.PI*getRandomInt(0,360))/180,0);
				var texture_path = selected_object.trees_textures[getRandomInt(0,selected_object.trees_textures.length-1)].texture_path;
				var model_path = selected_object.trees[getRandomInt(0,selected_object.trees.length-1)].model_path ;
				console.log(model_path);
				console.log(texture_path);
				
				currentObject = new StaticObject(model_path, texture_path);
				currentObject.setScaleAndRotation(scale,rotation);
				currentObject.load();
				cm.staticObjects.push(currentObject);
				//renderer.domElement.style.cursor = 'move';
		
				editorState = "addTree";
				setAllObjectsAsNotPicked();
			break;
			
		case "grass": 
			
			console.log(cached_textures);
			console.log(cached_alpha_maps);

			
			currentObject = new MultipleRandomObject(selected_object.grass, 
													 spreadCount, 
													 THREE.Vector3(0,0,0), 
													 spreadSize,
													 cached_textures,
													 cached_alpha_maps);
			cm.mros.push(currentObject);
			currentObject.initialize();
			currentObject.load();
			editorState = "addGrass";
			
			break;
		
		
		}
		
	}
	
	function beginAddObject(objectProperties)
	{
		currentObject = new StaticObject(objectProperties.model_path, objectProperties.texture_path);
		currentObject.load();
		cm.staticObjects.push(currentObject);
		renderer.domElement.style.cursor = 'move';

		editorState = "addObj";
		setAllObjectsAsNotPicked();
		
		
	}
	
	//function(texturePath, position, size, rotation, animationInfo )
	function beginAddDecals(decalData, size)
	{
		currentObject = new Decal();
		currentObject.initializeAsDummy(decalData.texture, new THREE.Vector3(0,0,0), size, new THREE.Vector3(-1.570796,0,0), decalData.animation );
		console.log(decalData.texture+" "+ size +" "+ decalData.animation)
		currentObject.load();
		cm.decals.push(currentObject);
		editorState = "addDecal";
	}
	
	function beginAddNPC(npcdata, name, npcid)
	{
		currentObject = new NPC();
		currentObject.initialize(npcdata.model_path, npcdata.texture_path, new THREE.Vector3(0,0,0), name, npcid);
		currentObject.load();
		cm.npcs.push(currentObject);
		editorState = "addNPC";
		setAllObjectsAsNotPicked();
	}
	
	function onMouseMove(event)
	{
		var eposition ;

		switch(editorState)
		{
		case "addObj":
			eposition = getIntersectionWithGround(event);
			if(currentObject.model!=null)
			{
				currentObject.model.position.x=eposition.x;
				currentObject.model.position.y=eposition.y;
				currentObject.model.position.z=eposition.z;
			}
			

			break;
		case "addTree":
			eposition = getIntersectionWithGround(event);
			if(currentObject.model!=null)
			{
				currentObject.model.position.x=eposition.x;
				currentObject.model.position.y=eposition.y;
				currentObject.model.position.z=eposition.z;
			}
			

			break;
		case "addGrass" :
			eposition = getIntersectionWithGround(event);
			currentObject.setOnPosition(eposition);
			break;
		case "addDecal":
			eposition = getIntersectionWithGround(event);
			if(currentObject.model!=null)
			{
				currentObject.model.position.x=eposition.x;
				currentObject.model.position.y=eposition.y;
				currentObject.model.position.z=eposition.z;
				currentObject.position.x=eposition.x;
				currentObject.position.y=eposition.y;
				currentObject.position.z=eposition.z;
				
			}
			break;
		case "addNPC" :
			eposition = getIntersectionWithGround(event);
			if(currentObject.model!=null)
			{
				currentObject.model.position.x=eposition.x;
				currentObject.model.position.y=eposition.y;
				currentObject.model.position.z=eposition.z;
			}
			break;
			
		case "selectObj":
			
			break;
			
		default: break;
		}
	}
	
	function onMouseDown( event ) {

		switch(event.button){
		
		case 0:  // left button
				switch(editorState)
				{
				case "addObj":					
					currentObject.showBoundingBox();
					currentObject=null;				
					editorState="";	
					renderer.domElement.style.cursor = 'auto';
					break;
				case "addGrass":					
				case "addTree":					
					//currentObject.showBoundingBox();
					currentObject=null;				
					editorState="";	
					renderer.domElement.style.cursor = 'auto';
					if(editorOptions.plantsContinous)
						{
						editorOptions.addSelectedPlant();
						}

					break;

				case "selectObj":	
					setAllObjectsAsNotPicked();
					currentObject=getIntersectionsWithStaticObjects(event);		
					/*if(currentObject==null)
						{
						setAllObjectsAsNotPicked();
						}*/
					
					break;	
				case "addDecal" :
						
						currentObject.dummyMode=false;
						currentObject.load();
						currentObject=null;				
						editorState="";	
						
						break;
				case "addNPC" :
					currentObject=null;				
					editorState="";	
					break;
					
				default: break;
				}
			break;
		case 1:  // middle button
			break;
		case 2:  // right button
			switch(editorState)
				{
			    case "addDecal":
			    case "addGrass":
			    case "addTree":
				case "addObj":	
				case "addNPC":
					currentObject.remove();
					currentObject=null;				
					editorState="";		
					renderer.domElement.style.cursor = 'auto';
					break;
				case "selectObj":		
					setAllObjectsAsNotPicked();
					currentObject=null;
					//getIntersectionsWithStaticObjects(event);					
					break;		
				
					
				default: break;
				}
			break;
		
		}
		
		
	}
	
	function onKeyDown(event)
	{
		switch(editorState)
		{
		case "addObj":	
		case "selectObj":		
			if(currentObject!=null)
			{
				switch (event.which)
				{
				case 100: //numpad 4					
					currentObject.moveX(-50);
					break;
				case 102: //numpad 6
					currentObject.moveX(50);
					break;
				case 104: //numpad 8
					currentObject.moveZ(-50);
					break;
				case 101:  //numpad 5
					currentObject.moveZ(50);
					break;
				
				case 107://numpad+
				case 87: //w
					currentObject.moveY(50);
					break;
				case 109://numpad-
				case 83: //s
					currentObject.moveY(-50);
					break;
				case 103: // numpad 7
				case 65: //a
					currentObject.rotate(0.2);
					break;
				case 105: // numpad 9
				case 68: //d
					currentObject.rotate(-0.2);
					break;
				case 46: // delete
					currentObject.remove();
					currentObject=null;
					//editorState="";
				    break;
				default:
					break;
				}
			}
			
			
			break;				
			
		default: 
			break;
		}
	//	alert("key down"+event.which);
	}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
	width = window.innerWidth-30;
	height = window.innerHeight-30;
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
			createOptionsGui();			
			
			break;
		case "game":
			ui.updateStats();
			THREE.AnimationHandler.update( delta );	
			camera.updateProjectionMatrix();
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



