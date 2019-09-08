
function IntroScene()
{
	this.player;
	this.ground;
	
	
	this.initialize = function(data)
	{
		ui.createUserInfoWindow();
		//console.log();
		
		rendererIntro.shadowMapEnabled = true;
		rendererIntro.shadowMapType = THREE.PCFShadowMap;
		rendererIntro.sortObjects = false;
		rendererIntro.gammaInput = true;
		rendererIntro.shadowMapSoft = true;
		rendererIntro.gammaOutput = true;
		cameraIntro = new THREE.PerspectiveCamera(45, ui.introwidth/ ui.introheight, 1, 10000 );
		//cameraIntro = new THREE.PerspectiveCamera(45, 5/ 4, 1, 10000 );
		cameraIntro.position.set( -700,50,600);
		cameraIntro.lookAt( sceneIntro.position );
		sceneIntro.add(cameraIntro);
		
		var hemiLight =  new THREE.HemisphereLight(0x0000ff, 0xd8e1ff, 0.8);
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
		//hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 15000, 500, 0 );
		
		
		
		var dirLight = new THREE.DirectionalLight( 0xffffff, 0.5);
		dirLight.shadowCameraVisible = false;
		dirLight.castShadow = true;	
		//dirLight.color.setHSL( 0.1, 1, 0.95 );
		//dirLight.position.set( 2500, 2000, 0 );
		dirLight.position.set( -200, 200, 100 );
		
		var d = 512;

		dirLight.shadowCameraLeft = -d;
		dirLight.shadowCameraRight = d;
		dirLight.shadowCameraTop = d;
		dirLight.shadowCameraBottom = -d;
		
		dirLight.shadowCameraFar = 10000;
		dirLight.shadowBias = -0.00001;
		dirLight.shadowDarkness = 0.6;

		sceneIntro.add(dirLight);
		sceneIntro.add(hemiLight);
		scene.fog = new THREE.FogExp2( 0x967b4b, 0.00025 );
		
		this.ground = new StaticObject("asset/models/gora_debris.js","asset/textures/dds/intro_debris_texture.dds");
		this.ground.gamemode=false;
		this.ground.scale=20;
		this.ground.position = new THREE.Vector3(0,-180,0);
		this.ground.load();

		
		this.player = new PlayerGamma();
		this.player.gamemode=false;
		this.player.initialize(data.login_info.model_path, 
	                new THREE.Vector3(0,0,0), 
			        data.login_info.name,
			        data.login_info.model_type,
			        data.login_info.texture_path);
		this.player.load();

	}
	

	
}

//var is = new IntroScene();	
