/* 
 *  file    :  ContentManager.js
 *  module  :  Utils
 *  author  :  Tomasz Tomczak
 *  date    :  22.11.2014
 *  revision:  PA2
 *  
 *  description:  
 */
THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
Array.prototype.remove = function(value) {
	var idx = this.indexOf(value);
	if (idx != -1) {
	    return this.splice(idx, 1); // The second parameter is the number of elements to remove.
	}
	return false;
	}

function ContentManager()
{
 this.player;
 this.env;
 this.groundObjects = [];
 this.staticObjects = []; // [0] - model_path, [1] - textured (true/false), [2] - texture_path
 this.otherPlayers = [];
 this.cachedTextures = [];
 this.cachedGeometry =[];   // {path: , geometry: }
 this.decals=[];
 
 this.npcs = [];
 this.configuration = [];
 this.board;
 this.objectsLoaded=0;
 this.totalObjectsCount=0;
 this.loadingcomplete=false;
 this.loading=false;
 this.pointer;
 this.plants = [];
 this.grassCachedIndex;
 this.lastLoadedObject;
 this.mros=[]; // multiple random objects
 
 
 /*
  * objectLoaded - funkcja ktora wywolana zwieksza counter przechowujacy ilosc obiektow ktore sa juz zaladowane. Powinna byc umieszczana jako
  * callback z funkcji ladowania obiektu.
  */
 this.addAndLoadCachedTextures = function(textures)
 {
	 var textures_table = [];
	 var pointer = this.cachedTextures.length;
	 var loaded_texture;
	 //console.log("ilosc tekstur "+textures.length);
	 for(var i=0; i<textures.length; i++)
		 {
		 switch(returnExtension(textures[i].texture_path))
			{
			case "dds": 
				loaded_texture = DDSloader.load(textures[i].texture_path);
				break;

			default:
				loaded_texture = THREE.ImageUtils.loadTexture(textures[i].texture_path);
			//console.log("loading texture: "+textures[i]);
			break;

			}
			loaded_texture.anisotropy = 4;
			loaded_texture.wrapS = loaded_texture.wrapT = THREE.RepeatWrapping; 
			textures_table.push(loaded_texture);
		 }
	 this.cachedTextures.push(textures_table); 
     return textures_table;
 };
 
 this.addAndLoadCachedGeometries = function(geometries_path)
 {

	 for(var i=0; i<geometries_path.length; i++)
		 {
		 loader.load(geometries_path[i].model_path, generateMultiObjectLoadCallback(geometries_path[i].model_path));
		 }
	 
 }
 
 this.getCachedGeometryByPath = function(path)
 {
	 var rtrn;
	 console.log("search for cached geometry by path: "+path);
	 for(var i=0; i<this.cachedGeometry.length; i++)
		 {
		 if(this.cachedGeometry[i].path==path)
			 {
			 rtrn=this.cachedGeometry[i].geometry;
			 }
		 }
	 return rtrn;
 }
 
 this.getNpcByModel = function(model)
 {
	 var object=null;
	 for(var i=0; i<this.npcs.length; i++)
	 {
		 if(this.npcs[i].model == model)
			 {
			 object = this.npcs[i].model;
			 break;
			 }
		 
	 }
	 return object;
 }
 
 var generateMultiObjectLoadCallback = function (geometries_path) {

		return function( geometry, materials ) {
									
			cm.cachedGeometry.push({path: geometries_path, geometry: geometry});
			console.log("cached geometry");
			console.log(cm.cachedGeometry);
		}

	}

 this.removeObjectFromContentManager = function(object, type)
 {
	 switch(type)
	 {
	 case "static":
		 this.staticObjects.remove(object);
		 break;
	 case "grass":
		 this.mros.remove(object);
		 break;
	 case "decal":
		 this.decals.remove(object);
		 break;
	 case "npc":
		 this.npcs.remove(object);
		 break;
	 default: break;
	 }
 }
 this.add = function(object,type)
 {
	 switch(type)
	 {
	 case "static":
		 this.staticObjects.push(object);

		 break;
	 default: break;
	 }
 }
 
 this.objectLoaded = function(loadedObject) // jesli obiekt jest zarejestronwany przy inicjalizacji to przy zaladowaniu powinno sie to odpalic
 {
	 this.objectsLoaded++;
	 if(loadedObject!=null)
	 {
		 this.lastLoadedObject=loadedObject;
	 }
	 else
	 {
		 this.lastLoadedObject="object";
	 }
 }
 
 /* 
  * addObiektToCounter - wywolana z parametrem lub bez. Zwieksza counter obiektow ktore maja byc zaladowane. Powinna byc wywolana w kazdym 
  * obiekcie w trakcie metody initialize(). Wywolana z parametrem zwieksza counter o podana ilosc
  */
  
 this.addObiectToCounter = function(count) // TODO: zmienic nazwe funkcji z uwagi na blad Obiect > Object
 {
	 if(count!=null)
	 {
		 this.totalObjectsCount+=count;
	 }
	 else
	 {
		 this.totalObjectsCount++;
	 }
 }
 
 /* 
  * initialDataLoad - inicjalizuje dane obiektow tzn tworzy je i wpisuje w nie sciezki tekstur oraz modeli na podstawie przekazanego z obiektu
  * Connection_module/ServerConnection parametru ktory jest wynikiem pobrania pliku w formacie JSON zawierajacego wszystkie informacje o danej planszy
  * i ustawieniach gracza
  */
 
 this.createProgressBar = function()
 {
	 ui.createProgressBar();
 }
 
 
 
 this.initialDataLoad = function(data)
 {

	
	 //this.player = new PlayerGamma(data.player_info.name);
	// this.player.initialize(data.player_info.model_path, new THREE.Vector(data.player_info.position.x, data.player_info.position.y, data.player_info.position.z));
	//console.log(data.place_info.static_objects.length);
	 
	 // dlaczego wykomentowane? Bo nie m asensu sie rozpierdalac na drobnice. Wszystkie dane zostana zassane z pliku data i tyle.
	 // bez zbednego pierdolenia. Bo w tym przypadku umieszczany tylko sciezki w jakiejs tablicy. W tej tablicy mozemy umiescic gotowe juz obiekty ktore
	 // zaladujemy ich metoda "load"
	/* for(var i=0; i<data.place_info.static_objects.length;i++)
	 {
		 this.staticObjects.push(data.place_info.static_objects[i]);
		// console.log(this.staticObjects[i].model_path);
	 }
	 
	 for(var i=0; i<data.place_info.ground_objects.length;i++)
	 {
		 this.groundObjects.push(data.place_info.ground_objects[i]);
		// console.log(this.staticObjects[i].model_path);
	 }*/ 
	 
	 // ground initialization
	 //	this.initialize = function(diffuseTextures, normalTextures,modelPath)
	 this.pointer = new ClickPointer();
	 this.pointer.initialize("asset/models/pointer.js");
	 
	 this.env = new GameEnvironment();
	 this.env.initialize( 	 data.place_info.terrain.terrain_model,
			 				 data.place_info.terrain.terrain_diffuse_textures, 
			                 data.place_info.terrain.terrain_normal_textures,			                
			                 data.place_info.terrain.sMap,
			                 data.place_info.terrain.sTextures,
			                 data.place_info.terrain.sNormalMaps);
	 
	 for(var i=0; i<data.place_info.static_objects.length; i++)
	 {
		 this.staticObjects.push(new StaticObject(data.place_info.static_objects[i].model_path, 
				 data.place_info.static_objects[i].texture_path));
	 }
	 
	 for(var i=0; i<data.place_info.static_objects.length; i++)
	 {
		 this.staticObjects.push(new StaticObject(data.place_info.static_objects[i].model_path, 
				 data.place_info.static_objects[i].texture_path));
	 }
	 for(var i=0; i<data.place_info.npcs.length; i++)
	 {
		 this.npcs.push(new NPC());

		 // (model_path, texture_path, position, name, npcid)
		 this.npcs[this.npcs.length-1].initialize(data.place_info.npcs[i].model_path, 
				 data.place_info.npcs[i].texture_path,
				 data.place_info.npcs[i].position,
				 data.place_info.npcs[i].name,
				 data.place_info.npcs[i].npcid,
				 data.place_info.npcs[i].category);
	 }
	 for(var i=0; i<data.place_info.decals.length; i++)
	 {
		 
		 //this.initialize = function(texturePath, position, size, rotation, animationInfo )
		 this.decals.push(new Decal());
		 this.decals[this.decals.length-1].initialize(data.place_info.decals[i].texture,
					data.place_info.decals[i].position,
 					data.place_info.decals[i].size,
 					data.place_info.decals[i].rotation,
 					data.place_info.decals[i].animation);

		
	 }
	 /*
	 "player_info": {
	        "name": "Tomek",
	        "model_path": "asset/models/buffalo2.js",
	        "position": { "x": "0",
	                      "y": "0",
	                      "z": "0"}        		
	            
	        },*/
	 
	 this.player = new PlayerGamma();
	 this.player.initialize(data.player_info.model_path, 
			                data.player_info.position, 
					        data.player_info.name,
					        data.player_info.model_type,
					        data.player_info.texture_path);
	 //this.plants.push(new PlantObject("asset/maps/stacja_paliw/models/trawa.js", "asset/textures/other/Blades-of-Grass3.jpg", "asset/textures/other/trawa1.jpg"));
	 
	 
	 
	 initializeGame();
	 
 }
 
 /* 
  * loadData - funkcja bezparametrowa sluzaca do zaladowania zainicjowanych wartosci przez finkcje initializeDataLoad
  */
 this.loadDecals=function()
 {
	 for(var i=0; i<this.decals.length; i++)
	 {
		 this.decals[i].load();
	 }
	 
 }
 this.loadData = function()
 {
	 this.loading = true;
	 
	 this.pointer.load();
	 this.env.load();

	 for(var i=0; i<this.staticObjects.length; i++)
	 {
		 this.staticObjects[i].load();

	 }
	 
	 for(var i=0; i<this.plants.length; i++)
	 {
		 this.plants[i].load();
	 }
	 
	 for(var i=0; i<this.npcs.length; i++)
	 {
		 this.npcs[i].load();
	 }
	 

	 this.player.load();
	 
 }
this.updateProgressBar = function()
{
	 ui.updateProgressBar((this.objectsLoaded*100)/this.totalObjectsCount, this.lastLoadedObject);
	 
	 if(this.objectsLoaded==this.totalObjectsCount )
	 {
		 this.loadingcomplete=true;
		 ui.prepareRenderer();
		 changeGameState("loadingComplete");
		// this.env.loadGrassMap();
		 for(var i=0; i<this.staticObjects.length; i++)
		 {

			 this.staticObjects[i].showBoundingBox();
		 }

	 }
	
	}
 this.update = function(delta)
 {
	 
	 // content manager przesyla informacje o stanie zaladowania do progress badu ktory tutaj bedzie
	 //console.log ("update content managera");
	 /*if(this.loading)
		 {
		 ui.updateProgressBar((this.objectsLoaded*100)/this.totalObjectsCount, this.lastLoadedObject);
		 }*/
	 
	/* if(this.objectsLoaded==this.totalObjectsCount && this.loading )
	 {
		 this.loading=false;
		 this.loadingcomplete=true;

		 ui.prepareRenderer();
		// this.env.loadGrassMap();

	 }*/



		 this.player.Update(delta);	
		 for(var i=0; i<this.npcs.length; i++)
		 {
			 this.npcs[i].update();
		 }
		 
		 for(var i=0; i<this.decals.length; i++)
		 {
			 this.decals[i].update();
		 }
		for(var i=0; i<this.mros.length; i++)
			 {
			 this.mros[i].update();
			 
			 }
	 
	 
	 this.env.update();
	 

 }


}



//var cm = new ContentManager();