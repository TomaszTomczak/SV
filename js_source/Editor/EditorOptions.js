var EditorOptions = function()
{

	var eo = this;
	this.objectsLibrary;
	this.objectsFolder;
	this.plantsFolder;
	this.decalFolder;
	this.animatedDecal=false;
	this.gui;
	this.objectsNameList = [];//['model1', 'model2', 'model3','model4', 'model5', 'model6','model7', 'model8', 'model9','model11', 'model22', 'model33'];
	this.npcModelList = [];
	this.decalsList = [];
	this.plantsList = ['tree', 'grass', 'model3','model4', 'model5', 'model6','model7', 'model8', 'model9','model11', 'model22', 'model33'];
	this.object="";
	this.npcobject="";
	this.plantsRandomSize=true;
	this.plantsRandomPosition=true;
	this.plantsSpreadSize=500;
	this.plantsSpreadCount=25;
	this.fogIntensity=0.00012;
	this.plantObject=this.plantsList[0];
	this.plantsContinous=false;
	this.npc_name="";
	this.npcid="";
	this.decalobject="";
	this.cachedGrassAlphaMaps;
	this.cachedGrassTextures;
	this.decalSize = 500;
	this.animationHorizontal=0;
	this.animationVertical=0;
	this.animationDuration=0;
	this.animationTotal=0;

	
	this.initializeGuiOptions = function()
	{
		
		$.getJSON("objects_library.json", function(data) {
			
		 eo.objectsLibrary = data;
		 for(var i=0; i< eo.objectsLibrary.static_objects.length; i++)
			 {
			 eo.objectsNameList.push(eo.objectsLibrary.static_objects[i].name);
			 console.log("added: "+eo.objectsLibrary.static_objects[i].name);
			
			 } 
		 
		 for(var i=0; i< eo.objectsLibrary.npcs.length; i++)
		 {
		 eo.npcModelList.push(eo.objectsLibrary.npcs[i].modelName);
		 console.log("added: "+eo.objectsLibrary.npcs[i].modelName);
		
		 } 
		 for(var i=0; i< eo.objectsLibrary.decals.length; i++)
		 {
			 eo.decalsList.push(eo.objectsLibrary.decals[i].decalName);		

			 console.log("dodane do decali: "+eo.objectsLibrary.decals[i].decalName);
			 
			 if(eo.objectsLibrary.decals[0].animation!=null)
			 {
				 /*
				  * 	
				  * this.animationHorizontal=0;
			this.animationVertical=0;
			this.animationDuration=0;
			this.animationTotal=0;
				  */
				 eo.animatedDecal=true;
				 eo.animationHorizontal=eo.objectsLibrary.decals[0].animation.horizontal;
				 eo.animationVertical=eo.objectsLibrary.decals[0].animation.vertical;
				 eo.animationDuration=eo.objectsLibrary.decals[0].animation.duration;
				 eo.animationTotal=eo.objectsLibrary.decals[0].animation.total;
			 }

		 } 
		 
		 eo.cachedGrassTextures = cm.addAndLoadCachedTextures(eo.objectsLibrary.plants_grass.grass_textures);
		 eo.cachedGrassAlphaMaps = cm.addAndLoadCachedTextures(eo.objectsLibrary.plants_grass.grass_alpha);
		 cm.addAndLoadCachedGeometries(eo.objectsLibrary.plants_grass.grass);
		 console.log("EditorOptions: ");
		 console.log(eo.cachedGrassAlphaMaps);
		 
		 console.log(eo.objectsLibrary);
		 eo.objectsInfoLoaded();
		 });
		
		
	}
	
	this.objectsInfoLoaded = function()
	{
		this.gui = new dat.GUI();
		this.gui.add(this, 'edit').name("Edit");
		this.gui.add(this, 'resetCamera').name("Reset camera position");
		this.gui.add(this, 'select').name("Select");
		
		this.sceneSettings = this.gui.addFolder( "Scene settings" );
		
		this.fogChangeEvent = this.sceneSettings.add(this, 'fogIntensity', 0.00001, 0.0005).name("Fog Intensity");
		this.fogChangeEvent.onChange(function(value){scene.fog = new THREE.FogExp2( 0x967b4b, value );});
		
		this.objectsFolder = this.gui.addFolder( "Add obiects" );
		//this.objectsFolder.add(this, 'plantsFolder;', this.objectsList );
		this.objectsFolder.add( this, 'object', this.objectsNameList );
		this.objectsFolder.add( this, 'addSelectedObject').name("Add selected object");
		
		this.plantsFolder = this.gui.addFolder( "Add plants" );
		this.plantsFolder.add( this, 'plantObject', this.plantsList ).name('Select Object');
		this.plantsFolder.add( this, 'plantsRandomSize').name("Random size");
		this.plantsFolder.add( this, 'plantsRandomPosition').name("Random position");
		this.plantsFolder.add( this, 'plantsSpreadSize',100,1000).name("Spread size");
		this.plantsFolder.add( this, 'plantsSpreadCount',1,500).name("Spread count");
		this.plantsFolder.add( this, 'plantsContinous').name("Continous");
		this.plantsFolder.add( this, 'addSelectedPlant').name("Add selected plant");
		
		this.decalFolder = this.gui.addFolder( "Add decals" );
		var declist = this.decalFolder.add( this, 'decalobject', this.decalsList ).name("Decal Texture");
		this.decalFolder.add( this, 'decalSize',1,2000).name("Decal size");

				
		
		this.decalFolder.add( this, 'addDecals').name("Add Decal");
		
		
		
		
		
		this.itemFolder =   this.gui.addFolder( "Add items" );
		
		this.scenatioFolder = this.gui.addFolder( "Scenario" );
		
		this.npcFolder =   this.scenatioFolder.addFolder( "Add NPC's" );	
		
		this.npcFolder.add( this, 'npcobject', this.npcModelList );
		this.npcFolder.add( this, 'npc_name').name("NPC name");
		this.npcFolder.add( this, 'npcid').name("NPC id");
		this.npcFolder.add( this, 'addNPC').name("Add NPC");
		
		this.specialItemFolder =   this.scenatioFolder.addFolder( "Add special item" );
		this.spotFolder =   this.scenatioFolder.addFolder( "Add spot" );
	}
	
	this.addDecals = function()
	{
		var eindex=0;
		for(var i=0; i<this.objectsLibrary.decals.length; i++)
		{
			if(this.objectsLibrary.decals[i].decalName==this.decalobject)
			{
				eindex=i;

			}
		}
		beginAddDecals(this.objectsLibrary.decals[eindex], new THREE.Vector3(this.decalSize, this.decalSize, this.decalSize));
		
	}
	
	this.addNPC = function()
	{
		var eindex=0;
		for(var i=0; i<this.npcModelList.length; i++)
		{
			if(this.npcModelList[i]==this.npcobject)
			{
				eindex=i;

			}
		}
		beginAddNPC(this.objectsLibrary.npcs[eindex], this.npc_name, this.npcid);

	}
	
	this.addSelectedPlant = function()
	{
		switch(this.plantObject)
		{
		case "tree":	
					beginAddPlant(this.objectsLibrary.plants_trees,
								  this.plantObject,
								  this.plantsRandomSize,
								  this.plantsRandomPosition,
								  this.plantsContinous,
								  this.plantsSpreadSize,
								  this.plantsSpreadCount);	
			break;
		case "grass": 
					beginAddPlant(this.objectsLibrary.plants_grass, 
							  this.plantObject,
							  this.plantsRandomSize,
							  this.plantsRandomPosition,
							  this.plantsContinous,
							  this.plantsSpreadSize,
							  this.plantsSpreadCount,
							  this.cachedGrassTextures,
							  this.cachedGrassAlphaMaps);
			break;
		}
	
	}
	
	this.addSelectedObject = function()
	{
		var eindex=0;
		for(var i=0; i<this.objectsNameList.length; i++)
		{
			console.log("search element: "+this.objectsNameList[i]+"compare with: "+this.object);
			console.log(this.object);
			if(this.objectsNameList[i]==this.object)
			{
				eindex=i;
				
			}
		}

		
			beginAddObject(this.objectsLibrary.static_objects[eindex], "static");
		
		
		
	}
	this.resetCamera = function()
	{
		camera.position.set( 2260,3390,3390 );
		camera.lookAt( scene.position );
		controls.reset();
	}
	this.edit = function()
	{
		alert("edit");
	}
	
	this.select = function()
	{
		selectObject();
	}


}