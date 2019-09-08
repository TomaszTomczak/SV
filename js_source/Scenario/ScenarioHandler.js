/*(
 * 
 * Obiekt z ktorym jest jakas interakcja bedzie przekazywac swoje ID, typ i co wywolalo akcje
 * 
 */


function ScenarioHandler()
{
	this.actionResponse = function(response)
	{
		s.actionResponse(response);
	}
	
	this.actionRequest = function(npcid, trigger)
	{
		s.actionRequest(npcid, trigger, "123123123123");
		console.log("request akcji dla :"+npcid+ " "+ trigger);
		
	}
	this.showDialog = function(dialog, options)
	{
		windows.showTalkWindow(dialog, options);
		console.log(dialog);
		console.log(options);
	}
	this.closeDialog = function()
	{
		windows.closeTalkWindow();
	}

}

var scenario = new ScenarioHandler();