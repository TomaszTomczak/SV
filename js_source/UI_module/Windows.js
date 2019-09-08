function Windows()
{
	this.anyBlockingWindowActive=false;
	
	this.objectMenu=null;
	this.objectMenuActive=false;
	
	this.talkWindow=null;
	this.talkWindowActive=false;
	
	this.showObjectMenu = function(object, positionX, positionY)
	{
		this.objectMenu = document.createElement( 'div' ) ;
		this.objectMenu.id = "objectMenu";	
		this.objectMenu.style.left =  positionX + 'px';
		this.objectMenu.style.top = positionY + 'px';
		
		var temp_input = document.createElement('input');
	    temp_input.setAttribute("type", "button");
		temp_input.setAttribute("value", "talk");
		//temp_input.setAttribute("onclick", object.onTalk()); 
		temp_input.onclick = function()
		{
			object.onTalk();
		}
		
		this.objectMenu.appendChild(temp_input);
		
		temp_input = document.createElement('input');
	    temp_input.setAttribute("type", "button");
		temp_input.setAttribute("value", "info");
		//temp_input.setAttribute("onclick", object.showInfo());  
		temp_input.onclick = function()
		{
			object.showInfo();
		}
		//temp_input.setAttribute("class", "btn");
		
		this.objectMenu.appendChild(temp_input);
		//document.body.appendChild(fp);
		$('body').prepend(this.objectMenu);
		this.objectMenuActive=true;
	}
	
	this.closeObjectMenu=function()
	{
		if(this.objectMenuActive)
		{
			document.getElementById("objectMenu").remove();
			this.objectMenuActive=false;
		}
		
	}
	
	this.showTalkWindow = function(dialogText, options) 
	{
		if(!this.talkWindowActive)
			{
		this.talkWindow	= document.createElement( 'div' ) ;
		this.talkWindow.id = "okno_rozmowy";	
		this.talkWindow.innerHTML = 
				"<table cellspacing='0' cellpadding='0' >" +
						"<tr>" +
						"<td id='lewo'></td>" +
								"<td>" +
								"	<table cellspacing='0' cellpadding='0'>" +
								"<tr><td id='gora'></td></tr>" +
								"	<tr><td id='rozmowa'>" +
								"		<table id='dupa'>" +
								"		<tr id='tekst_rozmowy'><td>" +
								"<img src='asset/images/windows/talk/starzec.png' align=left>" +
								"<div id='w_dialog'>"+
								
								"<p>Witaj wêdrowcze. Jak widzisz nie za wiele zosta³o z naszego piêknego miasta." +
								"Wszêdzie dooko³a grasuj¹ brutalne gangi. Podró¿owanie przez pustyniê wymaga wiele ekhm... sprytu</p> " +
								"</div>" +
								"</td></tr>" +
								"<tr id='tekst_rozmowy'><td>" +
								"<div id='w_options'>" +
						// opcje
								"</div>" +
								"</td></tr>" +
								"		</table>" +
								"</td></tr>" +
								"	<tr><td id ='dol'></td></tr>" +
								"	</table>" +
								"<td>" +
								"<td id='prawo'></td>" +
								"</tr>" +
								"</table>"; 
		//document.body.appendChild(fp);
			$('body').prepend(this.talkWindow);
			}
			//  sandbox
			
			var dialog = document.getElementById("w_dialog");
			dialog.innerHTML = dialogText;
			
			var op = document.getElementById("w_options");
			
			
			while (op.firstChild) {
			    op.removeChild(op.firstChild);
			}
			
			var ul = document.createElement("UL"); 
			
			for(var i=0; i<options.length; i++)
				{
				
				var a;
				var li = document.createElement("LI"); 
				a = document.createElement('a');
				a.href = "#";
				a.setAttribute("onclick", "windows.dialogOption('"+options[i].option+"')");
				a.innerHTML = options[i].text;
				li.appendChild(a);
				ul.appendChild(li);
				}
			op.appendChild(ul);
			
			//
			
			this.closeObjectMenu();
			this.talkWindowActive=true;
					
	}

	this.closeTalkWindow=function()
	{
		if(this.talkWindowActive)
		{
			document.getElementById("okno_rozmowy").remove();
			this.talkWindowActive=false;
		}
	}
	this.dialogOption=function(option)
	{
		scenario.actionResponse(option);
	}
	this.update = function()
	{
		this.anyBlockingWindowActive = this.talkWindowActive;

	}
	
}

var windows = new Windows();

