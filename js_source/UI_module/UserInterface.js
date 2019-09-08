/* 
 *  file    :  UserInterface.js
 *  module  :  UI_module
 *  author  :  Tomasz Tomczak
 *  date    :  07.12.2014
 *  revision:  PA1
 *  
 *  description:  This class allows to draw and manage user interface. It also initializes intro window and progress bar.
 *  
 */

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

function UserInterface()
{
	this.introwidth;                            // parent DIV container width
	this.introheight;                           // parent DIV container height
	this.stats;
	
    
	/*
	 * createWelcomePage()
	 * 
	 * Funkcja tworzy szkielet calej strony welcomeWindow - czyli pierwszej 
	 * jaka widzi uzytkownik po wejsciu na strone
	 * 
	 */
	this.createWelcomePage = function()
	{
		
		var login_button = document.getElementById("login");
		login_button.setAttribute("onclick", "loginToGREY()"); 

	};
	
	
	/*  
	 *  createUserInfoWindow()
	 * 
	 *  Funkcja ta tworzy szkielet strony z informacjami o graczu:
	 *  - okno konfiguracji
	 *  - okno renderu postaci
	 *  - okno informacji o graczu
	 *  - przycisk do rozpoczecia gry
	 *   
	 */
	this.createUserInfoWindow = function()
	{

		document.getElementById("log_content").remove(); // usuniêcie okna logowania ktore dodane zostalo wczesniej
		
		var fp	= document.createElement( 'div' ) ;
		fp.id = "config_page";	
		fp.innerHTML =  "<div id='render_window'></div>"+
						"<div id='config_window'>config window</div>"+
						"<div id='player_info'>player info window</div>"+
						"<div id='play_button'></div>";
		document.body.appendChild(fp);
		
		var fp = document.getElementById('play_button');
		var temp_input = document.createElement('input');

	    temp_input.setAttribute("type", "button");
		temp_input.setAttribute("value", "start");
		temp_input.setAttribute("onclick", "startTheGame()");    // dodanie akcji do przycisku "start"
		temp_input.setAttribute("class", "btn");

		fp.appendChild(temp_input);
		
		var container = document.getElementById( 'render_window' ) ; // pobranie ze szkieletu obiektu div w ktorym ma byc
																	 // renderowana postac gracza
	    container.appendChild( rendererIntro.domElement );           // ustawienie renderowania w kontenerze
	    this.introwidth=container.offsetWidth;                       // pobranie szerokosci i wysokosci kontenera
	    this.introheight=container.offsetHeight;
	    rendererIntro.setSize(container.offsetWidth,container.offsetHeight); // zainicjalizowanie wielkosci obszaru rendera
	                                                                         // na podstawie wielkosci kontenera w ktorym sie znajduje
	    
	  


		

	}
	this.createStats = function()
	{
		this.stats = new Stats();
		this.stats.domElement.style.position = 'absolute';
		this.stats.domElement.style.top = '0px';
		document.body.appendChild( this.stats.domElement );
	}
	
	this.updateStats = function()
	{
		this.stats.update();
	}
	
	/*
	 * createProgressBar()
	 * 
	 * Funkcja inicjalizuje pasek postepu. Usuwa poprzednie divy ze szkieletu strony 
	 * a nastepnie za pomoca canvasu rysuje pasek postepu. Takie pasek jest gotowy do odswiezania
	 * za pomoca updateProgressBar
	 * 
	 */
	this.createProgressBar = function()
	{
		document.getElementById("config_page").remove();
		var progressbar = document.createElement('div');
		progressbar.id = "loadtext";
		var fp = document.getElementById("first_page");

		
		var canvas = document.createElement('canvas');
		canvas.id     = "loadbar";
		canvas.width  = 1;
		canvas.height = 5;
		
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, 1000, 1000);
		
		var canvasBackground = document.createElement('canvas');
		canvasBackground.id     = "loadbarbg";
		canvasBackground.width  = 402;
		canvasBackground.height = 7;
		
		var ctx2 = canvasBackground.getContext("2d");
		ctx2.fillStyle = "#010d29";
		ctx2.fillRect(0, 0, 1000, 1000);
		
		fp.appendChild(canvasBackground);
		fp.appendChild(canvas);
		fp.appendChild( progressbar);
		document.body.appendChild( fp);
		

		//<canvas id="myCanvas" width="200" height="100" style="border:1px solid #c3c3c3;">
		
	}
	
	/*
	 * updateProgressBar()
	 * 
	 * Funkcja aktualizujaca stan paska postepu. Jako parametr przekazywana jest wartosc procentowa
	 * 
	 */
	this.updateProgressBar = function(percent, lastLoaded)
	{

		document.getElementById("loadtext").innerHTML = Math.round(percent)+"\n"+lastLoaded;
		var canvas = document.getElementById("loadbar");
		canvas.width = percent*4;
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, 1000, 1000);
			
	}
	
	/*
	 * prepareRenderer()
	 * 
	 * Funkcja ktora przygotowuje zawartosc okna przegladarki do rozpoczecia renderowania
	 * gry. Dodaje akcje myszy. Usuwa cala zawartosc poprzedniego okna.
	 * 
	 */
	this.prepareRenderer = function()
	{
       

		document.getElementById("first_page").remove();
		var container = document.createElement( 'div' ) ;  // utworzenie kontenera
		container.style.position = 'relative';
		document.body.appendChild( container);             // dodanie do body
 		container.appendChild( renderer.domElement );      // dodanie renderera
		
	}
	
	this.prepareEvents = function()
	{
		renderer.domElement.addEventListener( 'mousedown', Event_mouseDown, false );
		renderer.domElement.addEventListener( 'mousewheel', Event_mousewheel, false );
		renderer.domElement.addEventListener( 'DOMMouseScroll', Event_mousewheel, false ); 
	}
	
	/*
	 * login()
	 * 
	 * Funkcja akcji przycisku login w login boxie w welcomeWindow. Gdy przycisk zostanie wcisniety, funkcja ta
	 * wywoluje metode sendLogin z obiektu ServerConnection, ktora przesyla do serwera login uzytkownika
	 * i haslo celem weryfikacji.
	 * 
	 */
	
	
	// MOVED TO Game.js
	/*this.login = function()   
	{
		//alert(document.getElementById('user').value + " " + document.getElementById('password').value);
		/*
		 * 
		 *  jesli nie ma polaczenia z serwerem powinien wyswietlic sie stosowny komunikat
		 * 
		 */
	/*	sc.sendLogin(document.getElementById('user').value, document.getElementById('password').value);
		
		
	}*/
	
	/*
	 * startAndFetch()
	 * 
	 * Funckja przycisku "start" w oknie userInfoWindow
	 * Wysyla request o dane gracza i gry: plansza, obiekty itp zapisane w serwerze
	 * 
	 */
	this.startAndFetch = function()
	{
		sc.startAndFetch();
	}
	
	
}

/*
 * Event_mouseDown()
 * 
 * Akcja klikniecia myszy. Miejsce klikniecia zostaje przerzutowane z 2D (ekran) do 3D (plansza)
 * a nastepnie do obiektow zostaje przekazana informacja o punkcie przeciecia z podlozem
 * 
 */
function Event_mouseDown( event ) {

	switch(event.button){
	
	case 0:  // left button
			switch(gameState)
			{
			case "intro" :
			case "preload":
			case "loading":
			case "loadingComplete":
				break;
			case "game":
		
				/*
				 * 		return {
			    type: pickedObjectType, 
			    object : pickedObject,  
			    position : intersectionPoint
			    };
				 */
				var clicked = getIntersectionsWithObjects(event);
					switch (clicked.type)
					{
					case "ground":
						
							windows.closeObjectMenu();
						
						if(!windows.anyBlockingWindowActive)
						{
							cm.pointer.setPosition(clicked.position);
							cm.player.moveTo(clicked.position.x,clicked.position.z); 
						}
						
						break;
					case "npc" : 
						if(windows.objectMenuActive)
						{
							
							windows.closeObjectMenu();
						}
						
						if(!windows.anyBlockingWindowActive)
						{
						clicked.object.showMenu(event.pageX, event.pageY);
						}
						break;
					case "static" : 
						break;
					}
					break;
		
		
			default: break;
		
			}
			break;
	case 1: // middle button
		   break;
	case 2: // right button
		break;
	}
	
	/*event.preventDefault();

	var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );

	vector.unproject( camera );

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
   
	var intersectss = raycaster.intersectObject( cm.env.model ); // sprawdzenie przeciecia sie kursora z podlozem


	if ( intersectss.length > 0 ) {                              // sprawdzanie ilosci miejsc przeciecia

	var tx = Math.round(intersectss[0].point.x*10)/10;
	var ty = Math.round(intersectss[0].point.y*10)/10;
	var tz = Math.round(intersectss[0].point.z*10)/10;
	
	//console.log(tx+" "+tz);
	cm.pointer.setPosition(intersectss[0].point);
	cm.player.moveTo(tx,tz);                                      // rozpoczecie ruchu gracza w kierunku klikniecia
	
	
	}*/
}


/*
 * Event_mousewheel()
 * 
 * Akcja krecenia kulka w myszy. Glownie do oddalania i przyblizania w grze
 * 
 */
function Event_mousewheel( event ) {

	console.log("kreci mysza");
	
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
	
	camera.position.set(/*temppositionx*/ mousezoom.x,mousezoom.y,mousezoom.z);
	if(cm.player.moveAction)
			 {

				 camera.lookAt( new THREE.Vector3(cm.player.x,0,cm.player.z) );

				 }


}

//  Utworzenie globalnej zmiennej bedacej referencja do tej klasy
//var ui = new UserInterface();