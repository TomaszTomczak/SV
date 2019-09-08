function ServSimulation()
{
	var serv = this;
	this.player = new ServPlayer();
	
	
	this.npcsScenarioData = null;
	this.specialItems     = null;
	this.dialogues        = null;
	this.actions		  = null;
	
	this.npcsScenarioPath = "scenario/npcStory.json";
	this.specialItemsPath = "scenario/special_items.json";
	this.dialoguesPath    = "scenario/dialogues.json";
	this.actionsPath      = "scenario/actions.json";
	
	this.npcsScenarioLoaded        = false;
	this.specialItemsLoaded = false;
	this.dialoguesLoaded    = false;
	this.actionsLoaded      = false;
	
	
	this.allDataLoaded = false;
	
	/*
	 * Tutaj bedzie jeszcze area, przeciwnicy jesli trzeba bedzie
	 * itp. istoty z ktorymi mozna wchodzic w interakcje
	 *   
	 */
	
	this.loadObjectsData = function()
	{
		console.log("loading begin");
		$.getJSON(this.npcsScenarioPath, function(data) {
			
			serv.npcsScenarioData = data;
			serv.npcsScenarioLoaded = true;
			serv.dataLoaded();
			
		 });
		
		$.getJSON(this.specialItemsPath, function(data) {
			
			serv.specialItems = data;
			serv.specialItemsLoaded = true;
			serv.dataLoaded();
			
		 });
		
		$.getJSON(this.dialoguesPath, function(data) {
			
			serv.dialogues = data;
			serv.dialoguesLoaded = true;
			serv.dataLoaded();
			
		 });
		
		$.getJSON(this.actionsPath, function(data) {
			
			serv.actions = data;
			serv.actionsLoaded = true;
			serv.dataLoaded();
			
		 });
		console.log("loading end");
	}
	
	this.dataLoaded = function()
	{
		console.log("loaded");
		if(this.npcsScenarioLoaded && this.dialoguesLoaded && this.specialItemsLoaded && this.actionsLoaded) 
			{
			console.log("all loaded");
			this.allDataLoaded=true;
		//	this.actionRequest("NpcID3","onTalk","123");
			}
						
	}
	
	this.actionResponse = function(response)
	{
		/*
		 * 
		 * odpowiedz ze strony clienta 
		 * 
		 */
		
		console.log(this.actions[this.player.currentNpcid][this.player.currentUUID].actions[response]);
		this.player.currentUUID = this.actions[this.player.currentNpcid][this.player.currentUUID].actions[response];
		this.actionRequest(this.player.currentNpcid, this.player.trigger, this.player.currentGridNo);
		
		
	}
	this.actionRequest = function(npcid, trigger, gridno) 
	{
		this.player.currentGridNo = gridno;
		this.player.trigger = trigger;
		this.player.currentNpcid=npcid;
		
		//check if npc exist 
		console.log("check if npcid exist: "+this.npcsScenarioData[npcid]);
		if(this.npcsScenarioData[npcid]!=null)
		{
			console.log("give me: "+npcid+" "+trigger);
			var action = this.getAction(npcid, trigger);
			console.log(action);
			if(action == undefined)
				{
					console.log("nie udalo sie pobrac akcji dla: "+npcid+ " "+trigger+ " "+this.player.currentUUID);
				}
			console.log("fetched action: "+action.type);
			switch(action.type)
			{
				case "showDialog"     : this.showDialog(action, npcid); break;
				case "checkStats"     : this.checkStats(); break;
				case "modifyStats"    : this.modifyStats(); break;
				case "sayOutLoud"     : this.sayOutLoud(); break;
				case "checkQT"        : this.checkQT(); break;
				case "giveQT"         : this.giveQT(); break;
				case "removeQT"       : this.removeQT(); break;
				case "random"         : this.random(); break;
				case "rollCustomDice" : this.rollCustomDice(); break;
				case "giveItem"       : this.giveItem(); break;
				case "checkItem"      : this.checkItem(); break;
				case "removeItem"     : this.removeItem(); break;
				case "setCheckpoint"  : this.setCheckpoint(); break;
				case "checkpoint"     : this.checkpoint(); break;
				
				case "END"            : this.end(); break;
			
			}
			
		}		
		else
		{
			// wyslij wiadomosc ze npc nie istnieje. Cos musi byc nie tak.
		}

	}
	
	this.getAction = function()
	{

		if(this.player.currentUUID==null)
		{
			this.player.currentUUID= this.npcsScenarioData[this.player.currentNpcid][this.player.trigger].action;
		}
		

		return this.actions[this.player.currentNpcid][this.player.currentUUID];

		
	}
	
	this.showDialog = function(action)
	{
		// wyslij do klienta parametry
		var dialog = this.dialogues[this.player.currentNpcid].dialogues[action.dialog];
		var options = [];
		
		for(var i=0; i<action.options.length; i++)
			{
			options.push(
					       {
					    	   text: this.dialogues[this.player.currentNpcid].options[action.options[i]],
						       option: action.options[i]
		                   }
			
						);
			//console.log(this.dialogues[this.player.currentNpcid].options[action.options[i]]);
			}
		
		
		scenario.showDialog(dialog, options);
		//alert(this.dialogues[this.player.currentNpcid].dialogues[action.dialog]);
		//this.actionResponse("o1");
		
		
	}
	this.checkStats = function()
	{
		
	}
	this.mofifyStats = function()
	{
		
	}
	this.sayOutLoud = function()
	{
		
	}
	this.checkQT = function(){};
	this.giveQT = function(){};
	this.removeQT = function(){};
	this.random = function(){};
	this.rollCustomDice = function(){};
	this.giveItem = function(){};
	this.checkItem = function(){};
	this.removeItem = function(){};
	this.setCheckpoint = function(){};
	this.checkpoint = function(){};
	this.end = function(){
		
		this.player.currentNpcid = null;
		this.player.currentUUID = null;
		this.player.currentGridNo = null;
		this.player.trigger = null;
		
		scenario.closeDialog();
		
	};

	
}

var s = new ServSimulation();
s.loadObjectsData();

