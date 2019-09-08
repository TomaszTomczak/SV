function Decal()
{
	this.size=null;
	this.position=null;
	this.texturePath=null;
	this.decalAnimator=null;
	this.texture;
	this.animationInfo=null;
	this.decal_check= new THREE.Vector3(1,1,1);
	this.rotation;
	this.model;
	this.dummyMode=false;
	

	this.initializeAsDummy = function(texturePath, position, size, rotation, animationInfo)
	{
		this.dummyMode=true;
		
		console.log("inicjalizacja: ");
		this.texturePath= texturePath;
		this.position=new THREE.Vector3(position.x, position.y,position.z);
		this.size=new THREE.Vector3(size.x,size.y,size.z);
		this.animationInfo=animationInfo;
		this.rotation = new THREE.Vector3(rotation.x,rotation.y,rotation.z);
		
	}
	this.initialize = function(texturePath, position, size, rotation, animationInfo )
	{
		console.log("inicjalizacja: ");
		this.texturePath= texturePath;
		this.position=new THREE.Vector3(position.x, position.y,position.z);
		this.size=new THREE.Vector3(size.x,size.y,size.z);
		this.animationInfo=animationInfo;
		this.rotation = new THREE.Vector3(rotation.x,rotation.y,rotation.z);
		
		console.log("size" + this.size + " "+ this.texturePath+" "+this.position+" "+this.animationInfo+" "+this.rotation);
	};
	
	this.load = function()
	{
		 this.texture = new THREE.ImageUtils.loadTexture( this.texturePath );
		 if(this.animationInfo!=null)
		 {
			 this.decalAnimator = new TextureAnimator( this.texture, 
					 this.animationInfo.horizontal, 
					 this.animationInfo.vertical, 
					 this.animationInfo.total, 
					 this.animationInfo.duration); // texture, #horiz, #vert, #total, duration.
		 }
		 
		 if(this.dummyMode)
		 {
			 
			 var geometry = new THREE.BoxGeometry( this.size.x, this.size.y, this.size.z );
			 var material = new THREE.MeshBasicMaterial( { map: this.texture } );

				this.model = new THREE.Mesh( geometry, material );
				scene.add( this.model );
				
				
			 
		 }
		 else
		 {
			
			 if(this.model!=null)
				 {
				 
				 scene.remove(this.model);
				 }
			 var decalMaterial
			 console.log("przy loadzie decala wlasciwego pozycja: "+this.position.x+" "+this.position.y+" "+this.position.z);
			 //THREE.DecalGeometry = function( mesh, position, rotation, dimensions, check ) 
			 this.model = new THREE.Mesh( new THREE.DecalGeometry( cm.env.model,this.position,this.rotation,this.size,this.decal_check), 
					 new THREE.MeshPhongMaterial( { 
						 specular: 0x333333,
						 shininess: 0,
						 map: this.texture, 
						 //normalMap: THREE.ImageUtils.loadTexture( 'asset/textures/'+quality+'/dirt-512_normal.jpg' ),
						 //normalScale: new THREE.Vector2( .15, .15 ),
						 opacity: 0.85,
						 transparent: true, 
						 depthTest: true, 
						 depthWrite: false, 
						 polygonOffset: true,
						 polygonOffsetFactor: -4, 
						 wireframe: false 
					 }));
		 }
		 scene.add( this.model );
	}
	
	this.remove = function()
	{
		cm.removeObjectFromContentManager(this, "decal");
		scene.remove(this.model);
	}
	this.rotate = function(value)
	{
		this.model.rotation.y+=value;
		
	}
	this.moveY = function(value)
	{
		this.model.position.y+=value;
		this.position.y+=value;
		
	}
	this.moveX = function(value)
	{
		this.model.position.x+=value;
		this.position.x+=value;
		
	}
	this.moveZ = function(value)
	{
		this.model.position.z+=value;
		this.position.z+=value;
	
	}
	this.update = function()
	{
		if(this.decalAnimator!=null)
		{
			this.decalAnimator.update();
		}
	}
	
}