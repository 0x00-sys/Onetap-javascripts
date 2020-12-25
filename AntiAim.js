UI.AddLabel("Jeff's AA");
UI.AddSliderInt("Lag amount Minimum", 10, 10);
UI.AddSliderInt("Lag amount Maximum", 16, 16);
UI.AddSliderInt("Yaw angle", -24, -24);
UI.AddSliderFloat("Minimum Randomizer", 0, 0);
UI.AddSliderFloat("Maximum Randomizer", 2.96, 2.96);
UI.AddSliderInt("SlowWalk Jitter", 14, 14);
UI.AddSliderInt("LEFT Offset", -9, -9);
UI.AddSliderInt("RIGHT Offset", -26, -26);
UI.AddSliderInt("Fake Offset", -60.0, 60.0);
UI.AddSliderInt("Fake Direction", -60.0, 60.0);
UI.AddSliderInt("Fake Jitter", 30, 30);
UI.AddSliderInt("LBY Offset", -60, 60);
UI.AddSliderInt("LBY Direction", 7, 7);
UI.AddSliderInt("LBY Jitter", 18, 18);

var LagSwitch = 0;
var screen_size = Global.GetScreenSize();

function getValue() {
var LEFT = UI.GetValue("LEFT Offset", -60.0, 0);
var RIGHT = UI.GetValue("RIGHT Offset", 0, 60.0);
	
	
	var yeyeet = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter"); { 
		if (yeyeet == 0) { 
			Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +91, 1,"", [ 255, 255, 255, 255 ], 1);
			UI.SetValue("Fake Direction", RIGHT)	
		}	
	}
	{ 
		if (yeyeet == 1) {
			Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +91,	1,"", [ 255, 255, 255, 255 ], 1);
			UI.SetValue("Fake Direction", LEFT)	
		}
	}
}

function getVelocity(index)
{
    var velocity = Entity.GetProp( index, "CBasePlayer", "m_vecVelocity[0]" );
    return Math.sqrt( velocity[0] * velocity[0] + velocity[1] * velocity[1] );
}

function setantiaim(){
	var Direction2 = UI.GetValue("LBY Direction")	
	var LBY2 = UI.GetString("LBY Jitter");
	var lagg = UI.GetValue("Lag amount Minimum")
	var lagg2 = UI.GetValue("Lag amount Maximum")
	var yaw1 = UI.GetValue("Yaw angle")	
	var yaw2 = UI.GetValue("Yaw amount Jitter")		
	var offsetvalue = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset")	
	var Direction1 = UI.GetValue("Fake Direction")	
	var fakejitter = UI.GetValue("Fake Jitter")		
	var effect = UI.GetValue("Desync Amount");
	
	SyncOptions = [effect]
	AntiAim.SetOverride(1);
	
	var SyncOptions1 = UI.GetValue("Fake Offset");
	var SyncOptions3 = UI.GetValue("Real Offset");	
	var SyncOptions4 = UI.GetValue("LBY Offset");	

	AntiAim.SetLBYOffset(SyncOptions4);
	AntiAim.SetFakeOffset(RandomShit(SyncOptions1, 0.25))
	AntiAim.SetRealOffset(RandomShit(SyncOptions3, 0.25) * SyncOptions[RandomShit(0, SyncOptions.length)]);		
	
	UI.SetValue("LBY Offset", (RandomShitLBY(Direction2, LBY2)));
	UI.SetValue("Anti-Aim", "Fake-lag", "Limit", (RandomShitLag(lagg, lagg2)));
	UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", (RandomShitYaw(yaw1)));
	UI.SetValue("Fake Offset", (RandomShitDesync(Direction1, fakejitter)));
		
}

function slowwalk(){
	var slowalking = UI.GetValue("SlowWalk Jitter");
	if (Globals.Tickcount() > UI.GetValue("SlowWalk") && getVelocity(Entity.GetLocalPlayer()) > 2) {
        UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Jitter offset", slowalking);
	}
	else 
	{
        UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Jitter offset", 0);
	}
}

function RandomShit(min, max) {
	var first = UI.GetString("Minimum Randomizer");	
	var second = UI.GetString("Maximum Randomizer");	
	
	max = Math.floor(max);
    min = Math.ceil(min);
    return Math.floor(Math.random() * (max - min - first,second)) + min;
}

function RandomShitYaw(min3, max4) {
	var yaw2 = UI.GetValue("Yaw amount Jitter")

    max4 = Math.floor(max4);
    min3 = Math.ceil(min3);
    return Math.floor(Math.random() * (max4 + min3 - 0,yaw2)) + min3;
} 

function RandomShitDesync(min5, max6) {
	var fakejitter = UI.GetValue("Fake Jitter")

    max6 = Math.floor(max6);
    min5 = Math.ceil(min5);
    return Math.floor(Math.random() * (max6 + min5 - 0,fakejitter)) + min5;
} 

function RandomShitLBY(minLBY, maxLBY) {
	var LBY2 = UI.GetValue("LBY Jitter");

    maxLBY = Math.floor(maxLBY);
    minLBY = Math.ceil(minLBY);
    return Math.floor(Math.random() * (maxLBY + minLBY - 0,LBY2)) + minLBY;
} 

function RandomShitLag(min1, max1) {
	var lagg = UI.GetValue("Lag amount Minimum")
	var lagg2 = UI.GetValue("Lag amount Maximum")
    min1 = Math.ceil(min1);
    max1 = Math.floor(max1);
    return Math.floor(Math.random() * (max1 + min1 - lagg, lagg2)) + min1;
}


Cheat.RegisterCallback("Draw","getValue")
Cheat.RegisterCallback("Draw","setantiaim")
//Cheat.RegisterCallback("Draw","lag_switch")
