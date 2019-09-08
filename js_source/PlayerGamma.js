function PlayerGamma(username)
		{
		/*======================================================================================================================*/
		/*                                                        ATRYBUTY                                                      */
		/*======================================================================================================================*/
	        var aktor = this;	
	
			this.model;
			this.speed = 10; // im wieksza tym wolniej sie porusza model. 
			this.moveVector = new THREE.Vector3();
			this.moveAction = false;
			this.iterations = 0;
			this.nativeAngle=0; //bylo 90
			this.x=0;
			this.z=0;
			this.y=0;
			this.gamemode=true;
			this.firstUpdateLoop=true;
			this.username=username;
			this.modelType;
			this.animationFPS = 6; // fps for morph mesh
			this.texture; // morph mesh texture
			this.texture_path;
			this.loader = new THREE.JSONLoader();		
			this.path6;
			this.bb; //bounding box
			this.bbhelper;

           
			this.loadingcomplete=false;
			this.r=0;
			this.y_poczatkowy;
			this.animation;
			this.scale=8;
			this.showBB = false;
            // this.text.style.left =  conv3DtoScreen(this.model).x + 'px';
            // this.text.style.top = conv3DtoScreen(this.model).y+ 'px';
			
		   
		
		
		
		/*======================================================================================================================*/
		/*                                                        METODY                                                        */
		/*======================================================================================================================*/

			
	
			this.initialize = function(model_path, position, username, modelType, texture_path)
			{
				this.username=username;
				this.path6=model_path;
				this.x = position.x;
				this.y = position.y;
				this.z = position.z;
				this.modelType = modelType;
				this.texture_path = texture_path;
			}
			// laduje model
			this.load = function()
			{
				
				if(this.modelType=="meshmorph")
				{
					//console.log("weszlo tu. "+ this.texture_path);
					this.texture = THREE.ImageUtils.loadTexture( this.texture_path );
					this.loader.load( this.path6, generateCallbackMorphMesh(this.texture) );
				}
				else
				{
					this.loader.load( this.path6, generateLoadCallbackSkinned() );
				}
				
				//TODO: to fajnie jakby zrobil modul UserInterface
				
				
			}
			
			var generateCallbackMorphMesh = function (texture)
			{
				
				return function(geometry)
				{
					
					
					geometry.computeMorphNormals();
					geometry.computeBoundingBox();
					aktor.bb = geometry.boundingBox;
					
					
					var whiteMap = THREE.ImageUtils.generateDataTexture( 1, 1, new THREE.Color( 0xffffff ) );
					var materialWireframe = new THREE.MeshPhongMaterial( { color: 0xffaa00, specular: 0x111111, shininess: 50, wireframe: true, shading: THREE.SmoothShading, map: whiteMap, morphTargets: true, morphNormals: true, metal: false } );

					
					var materialTexture = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 50, wireframe: false, shading: THREE.SmoothShading, map: texture, morphTargets: true, morphNormals: true, metal: false } );
					materialTexture.wrapAround = true;

					//

					var mesh = new THREE.MorphAnimMesh( geometry, materialTexture );
					
					
					

					mesh.castShadow = true;
					mesh.receiveShadow = true;
					
					mesh.scale.set( aktor.scale,aktor.scale,aktor.scale );
					mesh.position.set( aktor.x, aktor.y, aktor.z );
					aktor.y_poczatkowy=- aktor.scale * aktor.bb.min.y;
					
					//console.log( "skala: "+aktor.scale);
					
					mesh.materialTexture = materialTexture;
					mesh.materialWireframe = materialWireframe;

					//

					mesh.parseAnimations();

					mesh.playAnimation( geometry.firstAnimation, aktor.animationFPS );
					mesh.baseDuration = mesh.duration;
					//aktor.activeAnimation = geometry.firstAnimation;
					aktor.model=mesh;
					aktor.r = Math.PI;
					aktor.model.rotation.y=aktor.r;
					
					
					//mesh5.position.set( aktor.x, 0 - bb.min.y , aktor.z );

					aktor.bbhelper = new THREE.BoundingBoxHelper( aktor.model, 0x00ff00 ); 
				    aktor.bbhelper.update(); 
				    

					aktor.bb = new THREE.Box3(aktor.bbhelper.box.min, aktor.bbhelper.box.max);
					
					//console.log("gora to: "+aktor.bb.max.y+" dol to:" +aktor.bb.min.y);
					
					if(aktor.showBB)
					{
						
						scene.add( aktor.bbhelper );	
						//console.log("gora helpera to: "+aktor.bbhelper.box.max.y+" dol helpera to:" +aktor.bbhelper.box.min.y);
					}
					
				
					
					if(aktor.gamemode)
						{
						scene.add(aktor.model);
						}
					else
						{
						//console.log("intro scene player load complete");
						sceneIntro.add(aktor.model);
						//updateIntroScene();
						changeGameState("intro");
						}
					//console.log(mesh);
					//console.log("update "+aktor.model.position.x +" "+ aktor.model.position.z+" "+ aktor.model.position.y+ " move vector: "+aktor.moveVector);
				}
				
			}
			
			var generateLoadCallbackSkinned = function (model , text) {

				return function( geometry, materials ) {
				
					ensureLoop( geometry.animation );
					
					geometry.computeBoundingBox();
					aktor.bb = geometry.boundingBox;
					
					for ( var i = 0; i < materials.length; i ++ ) {

						var m = materials[ i ];
						m.skinning = true;
						//m.morphTargets = true;

						m.alphaTest = 0.75;

	   				m.ambient.copy( m.color );


						m.wrapAround = true;

					}
					


					var mesh5 = new THREE.SkinnedMesh( geometry, new THREE.MeshFaceMaterial( materials ) );
					mesh5.position.set( aktor.x, 0 - aktor.bb.min.y , aktor.z );
					mesh5.scale.set( 1,1,1 );
					scene.add( mesh5 );
					mesh5.castShadow = true;
					mesh5.receiveShadow = false;
					
					aktor.y_poczatkowy=0 - aktor.bb.min.y;

					var converted_ = conv3DtoScreen(mesh5);
					aktor.text.style.left =  converted_.x + 'px';
					aktor.text.style.top = -35+converted_.y+ 'px';

					
                    aktor.model=mesh5;
                  
                    
                    helper = new THREE.SkeletonHelper( mesh5 );
    				helper.material.linewidth = 3;
    				helper.visible = false;
    				scene.add( helper );
    				
    				aktor.animation = new THREE.Animation( mesh5, geometry.animation );

    				aktor.animation.stop();
    				
    				  aktor.loadingcomplete=true;
                   // console.log( aktor.model.position);
                    
				

				}

			}
			
			//ustawia model na danej pozycji
			this.setOnPosition = function(xx,zz)
			{
				this.x=xx;
				this.z=zz;
				//this.moveAction=false;
				this.model.position.x=xx;
				this.model.position.z=zz;
			console.log(this.model.position.y);

			};

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
			   
			   
			   
			   
			};
			/* to ponizej jest dobrze ale... ale wymaga poprawek ktore uzyje w funkcji moveTo2 */
		    this.moveTo = function(bx,bz)
			{
			
			//socket.emit("MsgMove", {id:"mymove"});
			//console.log(socket.handshake.address.address +" : "+socket.handshake.address.port);
		    	this.model.playAnimation( "run", this.animationFPS );
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
			   
				if(this.modelType=="meshmorph")
				{
				 // tu bedzie sterowana animacja typka
				}
				else
					{ 
					this.animation.play();
					}
					

			 /*console.log("Username: "+this.username+"\n"+
			             "  move vector: "+v1+" "+v2+"\n"+
						 "  speed: "+this.speed+"\n"+
						 "  distance: "+_zdistance+"\n"+
						 "  loading complete: "+this.loadingcomplete);*/
			   
			};
			
			
			// TODO: zmienic nazwe z Update na update
			this.Update = function(delta)
			{
				if(this.gamemode)
				{

					if(this.modelType=="meshmorph")
					{
						this.model.updateAnimation( 1000 * delta );
					
						if(this.showBB)
						{
							
							this.bbhelper.update(); 
							
						}
					}
					if(this.firstUpdateLoop)
					{
						this.text = document.createElement( 'div' );
						this.text.style.position = 'absolute';
						this.text.innerHTML = this.username;
						this.text.style.zIndex =1;
						this.text.style.color="white";
						this.text.style.fontFamily="Verdana";
						//this.text.style.fontWeight="bold";
						this.text.style.backgroundColor = "brown";
						this.text.style.borderRadius ="0.1em";
						this.text.style.border="2px solid #330000";

						this.text.style.opacity = .6; //For real browsers;
						this.text.style.filter = "alpha(opacity=60)"; //For IE;
						this.text.style.padding = "3px";
						// this.moveInterval;
						this.textPosX=-50;
						this.textPosY=-50;
						this.text.style.fontSize="small";
						this.text.style.left=50+"px";
						this.text.style.top= 50+"px";
						this.text.id="playerNameText";
						$('body').prepend(this.text);
						this.firstUpdateLoop=false;
					}
					else
					{
						this.text.style.left =  conv3DtoScreen(this.model,camera).x + 'px';
						this.text.style.top = -135+conv3DtoScreen(this.model,camera).y+ 'px';
					}

					cm.pointer.update(this.moveAction);
					this.model.rotation.y = this.r;

					if(this.iterations>this.speed)
					{

						this.moveAction = false;
						this.iterations = 0;
						console.log("ruch stop at: "+this.x+" "+this.z+" kat:"+this.r);
						if(this.modelType=="meshmorph")
						{
							this.model.playAnimation( "stand", this.animationFPS );
						}
						else
						{ 
							this.animation.stop();
						}
					}
					if(this.moveAction)
					{
						//console.log("=========== update ==============");
						//console.log("   model pos: "+ this.model.position.x +" "+ this.model.position.z);


						this.model.position.x += this.moveVector.x;
						this.model.position.z += this.moveVector.z;
						//this.model.position.x = Math.round(this.model.position.x);
						//this.model.position.z = Math.round(this.model.position.z);
						//	console.log("moveVector:"+ this.moveVector.x + " "+this.moveVector.z);

						this.x = this.model.position.x;
						this.z = this.model.position.z;
						// console.log("update "+this.model.position.x +" "+ this.model.position.z+" "+ this.model.position.y+ " move vector: "+this.moveVector);
						/*var raycaster = new THREE.Raycaster( new THREE.Vector3( this.x, this.y+100, this.z ), new THREE.Vector3( 0, -1, 0 ) );               


						var intersects = raycaster.intersectObject( cm.env.model );

						//console.log(intersects.length);
						if ( intersects.length > 0 ) {
							//console.log(intersects.length+" "+JSON.stringify(intersects[ 0 ].object.position));
							this.y = Math.round(intersects[0].point.y*10)/10;
							this.model.position.y = this.y+this.y_poczatkowy;
							//console.log("policzony y: "+this.y+" yminimalny modelu: "+this.y_poczatkowy+" pozycja y modelu: "+this.model.position.y);
						}

*/
						this.iterations++;
						//console.log(conv3DtoScreen(this.model).x,conv3DtoScreen(this.model).y);


					}




				}
				else
					{
					this.model.updateAnimation( 1000 * delta );
	
					
					}
			}
			this.remove = function()
			{
				document.getElementById("playerNameText").remove();
				
			}
		}