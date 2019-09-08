function ClickPointer()
{
	var cpointer = this;
	this.model;
	this.modelPath;
    this.position = new THREE.Vector3(0,0,0);
    this.loader = new THREE.JSONLoader();
	this.t=0;
	this.decalAnimator;
	this.decalTexture;	
	this.pointerDecal=null;
	

	this.setPosition = function(point)
	{

	this.model.material.opacity=1;
	this.position = point;
	this.t=0;
	
	
	scene.remove(this.pointerDecal);
	
	var decal_position = this.position;
	var decal_rotation = new THREE.Vector3(1.570796,0,0);
	var decal_scale = new THREE.Vector3(200,200,200);
	var decal_check = new THREE.Vector3(1,1,1);
	
	this.pointerDecal = new THREE.Mesh( new THREE.DecalGeometry( cm.env.model,decal_position,decal_rotation,decal_scale,decal_check), 
			                            getDecalPointerMaterial(this.decalTexture) );

	//clickPointer.pointerDecal=m;
	
	scene.add( this.pointerDecal );
	
	
	}


	this.initialize = function(modelPath)
	{
		
		this.modelPath=modelPath;
		cm.addObiectToCounter(1);
	}
	
	var generatePointerLoadCallback = function () {

		return function( geometry) {

			  var material =  getPointerMaterial();
			  var mesh = new THREE.Mesh(
				geometry,
				material
			  );
			  
			  mesh.rotation.y = Math.PI/5;
			  mesh.scale.set(2, 2, 2);
			  cpointer.model=mesh;
			  cpointer.model.visible=false;
			  scene.add(mesh);
			  cm.objectLoaded();

			}

	}
	
	this.load = function()
	{
		 this.decalTexture = new THREE.ImageUtils.loadTexture( 'asset/textures/High/point2.png' );
		 this.decalAnimator = new TextureAnimator( this.decalTexture, 12, 1, 12, 2); // texture, #horiz, #vert, #total, duration.
		 
		 this.loader.load( this.modelPath, generatePointerLoadCallback());
		
	}
	
	this.update = function(move)
	{
		this.decalAnimator.update();
		if(move)
		{
			if(this.pointerDecal!=null)
			{
				this.pointerDecal.visible=true;
			}

			this.model.visible=true;
			this.t+=0.1;
			this.model.position.x =this.position.x;
			this.model.position.y =this.position.y + (Math.sin(this.t)*40);
			this.model.position.z =this.position.z;

			if(this.model.material.opacity>0)
			{
				this.model.material.opacity-=0.03;
			}
			else
			{
				this.model.visible=false;
			}
			

			this.model.rotation.y += 0.15;
		}
		else
		{

			this.model.visible=false;
			
			if(this.pointerDecal!=null)
	    	{
			this.pointerDecal.visible=false;
	    	}
			
		}
	
	}
	

}


