

function ServerConnection()
{
	this.host = '192.168.56.101:8888';
	this.socket = io.connect('192.168.56.101:8888');
	
	this.sendLogin = function(user, password)
	{
		
		
		 console.log("receive player login data with uid");
		$.getJSON("login_data.json", function(data) {
		
			console.log(data.login_info.result);
			if(data.login_info.result=="ok")
			{
				
				//is.initialize(data);
				loginComplete(data);
			}
			else
			{
				//TODO: wyswietl komunikat bledu ze cos sie zjebalo. np nie ma takiego typka albo jest juz zalogowany itp.
			}
		 });

		
		
	}
	
	
	this.startAndFetch = function (playeruid)
	{
		console.log("fetching data");
		$.getJSON("game_data.json", function(data) {

			
			//console.log(data.place_info.static_objects[1]);
			//console.log(data.player_info.model_path);
			//console.log(data);
			
			//tu zapakuje dane do content managera
			cm = new ContentManager();
			
			initialDataLoad(data);
			//cm.initialDataLoad(data);
			
		    });
	}
	
	this.socket.on("MsgLogInAck", function(data)
			{
		
		      /*
		       * 
		       * odpowiedz z servera.
		       *  

		       * 
		       */
	/*	console.log("fetching data");
		$.getJSON("game_data.json", function(data) {
		    console.log(data);
		    });*/

			}
	);
	this.socket.on("MsgUserGoesTo", function(data)
			{
		for(ac in actors)
		{
			if(data.u==actors[ac].username)
			{
				actors[ac].moveTo(data.x,data.z);
			}
		}

			}
	);

	this.socket.on("MsgNewUser", function(data)
			{
		$('<p>'+data.user+' logged</p>').appendTo('#ConsoleContent');
		newUser(data.user, data.x, data.z, data.r);
		//alert(data.user);
			}				
	);
	

	this.socket.on("MsgOldUsers", function(data)
			{
		//newUser(data.username, data.x, data.z);
		//console.log("received array length: "+data.length);

		for(c in data)
		{
			//console.log("przetwarzany model: "+c);
			newUser(data[c].username, data[c].x, data[c].z, data[c].r);		
			//LoadHelper(data[c].username, data[c].x, data[c].z);						
		}

		// newUser(data[x].username, data[x].x, data[x].z);


			}
	);
	this.socket.on("MsgMoveCue", function(data) // to chyba nie bedzie potrzebne. Patrz nizej do notki 1.0
			{
		p.moveTo(data.x,data.z);
			}
	);
	
}

//var sc = new ServerConnection();