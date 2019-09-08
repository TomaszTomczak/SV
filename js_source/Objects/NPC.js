	/*
	 * 
	 * 	"NpcID2" : {
			    "onTalk" : {},
			    "onArea" : {},
			    "onSteal": {},
			    "onFight": {},
			    "onDeal" : {}
	            }
	 */

function NPC()
{

	var this_refrence = this;
	this.name="";
	this.model=null;
	this.texture=null;
	this.npcid = "";
	
	this.texture_path;
	this.model_path;
	this.position = new THREE.Vector3();
	this.text;
	
	this.loader = new THREE.JSONLoader();	
	this.objectCategory;
	
	
	/*
	 * 
	 * Object methods Object methods Object methods Object methods Object methods Object methods  Object methods
	 * 
	 */
	
	this.initialize = function(model_path, texture_path, position, name, npcid, objectCategory ) // data like model path, textures path, position etc
	{
	
		this.model_path = model_path;
		this.texture_path = texture_path;
		this.position.x = position.x;
		this.position.y = position.y;
		this.position.z = position.z;
		this.name = name;
		this.npcid=npcid;
		this.firstUpdateLoop = true;
		this.objectCategory = objectCategory || {talk: false, area: false, steal: false, fight: false, deal: false};
		
	}
	
	
	
	this.load = function()
	{
		if(this.texture_path!="")
		{
			this.texture = THREE.ImageUtils.loadTexture( this.texture_path );
		}
				
		this.loader.load( this.model_path, generateCallbackModelLoad(this.texture) );
		
		
	}
	
	var generateCallbackModelLoad = function ( texture ) {

		return function( geometry, materials ) {
			
			
			var mesh1;
			//console.log("==loading: "+texture);
			
			if(texture!=null)
			{
				
				var material = new THREE.MeshLambertMaterial ({
					map:  texture
					

				});
				
				//material.map.wrapS=THREE.RepeatWrapping;
				//material.map.wrapT=THREE.RepeatWrapping;
				//material.side = THREE.DoubleSide;
				material.transparent = true;
				
			
				
				 mesh1 = new THREE.Mesh(
						geometry,
						material
				);
				 this_refrence.materialType="lambert";

			}
			else
			{
				for(var i=0; i<materials.length; i++)
				{
					console.log(i);
					if(materials[i].map!=null)
					{
						materials[i].map.wrapS=THREE.RepeatWrapping;
						materials[i].map.wrapT=THREE.RepeatWrapping;
						materials[i].side = THREE.DoubleSide;
						materials[i].transparent = true;
					}
				}
			
				this_refrence.materialType="faced";
			mesh1 = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
			console.log(mesh1);

			}
			
			//mesh1.doubleSided = true;
			mesh1.geometry.computeTangents();
			//mesh1.rotation.y = Math.PI/5;

			mesh1.castShadow = true;
			mesh1.receiveShadow = true;
			mesh1.position.set(this_refrence.position.x, this_refrence.position.y, this_refrence.position.z);
			mesh1.updateMatrix();
			//so.model=mesh1;
				
			    

				//so.bb = new THREE.Box3(so.bbhelper.box.min, so.bbhelper.box.max);
				
				//console.log("gora to: "+aktor.bb.max.y+" dol to:" +aktor.bb.min.y);
				
				
			    this_refrence.model=mesh1;
				scene.add(mesh1);
				
				//so.bbhelper = new THREE.BoundingBoxHelper( so.model, so.bbcolor ); 
				//console.log(so.bbhelper);
			   // so.bbhelper.update(); 

				

			
		}

	}
	
	this.update = function()
	{
		if(this.firstUpdateLoop)
			{
			this.text = document.createElement( 'div' );
	        this.text.style.position = 'absolute';
	        this.text.innerHTML = this.name;
			this.text.style.zIndex =1;
			this.text.style.color="white";
			this.text.style.fontFamily="Verdana";
	        //this.text.style.fontWeight="bold";
			this.text.style.backgroundColor = "#529fff";
			this.text.style.borderRadius ="0.1em";
			this.text.style.border="2px solid #086fed";
			
			this.text.style.opacity = .6; //For real browsers;
			this.text.style.filter = "alpha(opacity=60)"; //For IE;
			this.text.style.padding = "3px";
	       // this.moveInterval;
			
			this.text.style.fontSize="small";
	        this.textPosX=-50;
			this.textPosY=-50;
			this.text.style.left=50+"px";
			
			this.text.style.top= 50+"px";
			this.text.id=this.npcid+"NpcNameText";
			//document.body.appendChild( this.text);
			$('body').prepend(this.text);
			this.firstUpdateLoop=false;
			}
		else
			{
				this.text.style.left =  conv3DtoScreen(this.model,camera).x + 'px';
				this.text.style.top = -135+conv3DtoScreen(this.model,camera).y+ 'px';
			}
		
		
	}
	
	this.remove = function()
	{
		cm.removeObjectFromContentManager(this, "npc");
		scene.remove(this.model);
		document.getElementById(this.npcid+"NpcNameText").remove();
		
		//delete this;
	    //scene.remove(this.bbhelper);
	}
	
	
	this.showArea = function()
	{
		
	}
	this.setNotPicked=function()
	{
		switch( this.materialType)
		{
		case "lambert":
			this.model.material.emissive.setHex( 0x000000 );
			break;
		case "faced":
			
			for(var i=0;i<this.model.material.materials.length; i++)
				{
				this.model.material.materials[i].emissive.setHex( 0x000000 );
				}
			break;
		default:
			break;
		}
		
	}
	
	this.setPicked=function()
	{
		switch( this.materialType)
		{
		case "lambert":
			this.model.material.emissive.setHex( 0x00ff00 );
			break;
		case "faced":
			for(var i=0;i<this.model.material.materials.length; i++)
				{
				this.model.material.materials[i].emissive.setHex( 0x00ff00 );
				}
			break;
		default:
			break;
		}
		
	}
	
	this.rotate = function(value)
	{
		this.model.rotation.y+=value;
		
	}
	this.moveY = function(value)
	{
		this.model.position.y+=value;
		
	}
	this.moveX = function(value)
	{
		this.model.position.x+=value;
		
	}
	this.moveZ = function(value)
	{
		this.model.position.z+=value;
	
	}
	/*
	 * 
	 * Scenario methods Scenario methods Scenario methods Scenario methods Scenario methods Scenario methods
	 * 
	 */ 
	this.showMenu = function(posx, posy)
	{
		if(this.objectCategory.talk)
		{
			windows.showObjectMenu(this, posx, posy);
		}

	}
	
	this.showInfo = function()
	{
		console.log("informacje o obiekcie ktory widzi gracz");
	}
	
	this.onTalk = function()
	{
		
		scenario.actionRequest(this.npcid, "onTalk");
		windows.closeObjectMenu();
		
	}
	
	this.onArea = function()
	{
		console.log("i can see you");
	}
	
	this.onSteal = function()
	{
		console.log("do not steal");
	}
	
	this.onFight =  function()
	{
		console.log("you poor moron...");
	}
	
	this.onDeal = function()
	{
		console.log("lets deal");
	}
	
	
}