var iExploitID = 0;
var bDoubleTapped = false;
var bShouldRecharge = false;
var ForceCharge = false;
var iLastShotTime = 1;
var props = 0;
var screen_size = Global.GetScreenSize();
var old_percentage = 0;

UI.AddCheckbox("Tripletap");
UI.AddDropdown("Tripletap Mode", ["FullSend", "Accurate",]);
UI.SetValue( "Rage", "GENERAL", "Exploits", "Doubletap", 1 );
UI.SetValue("Rage", "GENERAL", "Exploits", "Teleport release", true);
UI.AddCheckbox("Doubletap Indicator");
UI.AddCheckbox("Teleport Indicator");
UI.AddCheckbox("Onshot AA Indicator");
UI.AddCheckbox("Min DMG Override Indicator");
UI.AddCheckbox("Fullsend Teleport");

function on_ragebot_fire()
{
    ragebot_target_exploit = Event.GetInt("exploit");
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Tripletap"))
    {
		if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Fullsend Teleport"))
		{
			(ragebot_target_exploit == 2) ? UI.ToggleHotkey("Rage", "GENERAL", "Exploits", "Doubletap") : UI.ToggleHotkey("Rage", "GENERAL", "Exploits", "Doubletap");
		}
        if (ragebot_target_exploit == 2)
        {
            UI.SetValue("Rage", "GENERAL", "Exploits", "Doubletap fast recovery", true);
        }
        else
        {
            UI.SetValue("Rage", "GENERAL", "Exploits", "Doubletap fast recovery", true);
        }
    }
}

function event_rbot_fire( )
{
    if (!player_hurt)
        return;
    
    iExploitID = Event.GetInt( "exploit" );
    if ( !UI.GetValue( "Misc", "JAVASCRIPT", "Script Items", "Tripletap" ) )
        return;

    if ( iExploitID == 2 ) {
        iLastShotTime = Global.Tickcount( );
        bDoubleTapped = true;
        UI.SetValue( "Rage", "GENERAL", "Exploits", "Doubletap", 0 );
        bShouldRecharge = true;
    }

    ForceCharge = bShouldRecharge ? true : false;

 
    if ( ForceCharge && Global.Tickcount( ) >= ( Global.TickInterval( ) * 10 + iLastShotTime ) )
        UI.SetValue( "Rage", "GENERAL", "Exploits", "Doubletap", 1 );

}


function event_ragebot_fire()
{
    ragebot_target_exploit = Event.GetInt("exploit");
    if ( !UI.GetValue( "Misc", "JAVASCRIPT", "Script Items", "Tripletap" ) )
    {
        (ragebot_target_exploit == 2) ? UI.ToggleHotkey("Rage", "GENERAL", "Exploits", "Doubletap") : UI.ToggleHotkey("Rage", "GENERAL", "Exploits", "Doubletap");
    }   
}

function modecheck()
{
  if(UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Tripletap Mode") == 0) { on_ragebot_fire(); }
  if(UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Tripletap Mode") == 1) { event_rbot_fire(); }
  UI.SetValue("Rage", "GENERAL", "Exploits", "Teleport release", true);
}
function getPercentage(number, percentage) {
    return (percentage / 100) * number;
}
function main() {

    if (!UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Doubletap Indicator"))

        return;
    const screenSize = Global.GetScreenSize();
    const gapX = getPercentage(screenSize[0], 48);
    const gapY = getPercentage(screenSize[1], 54);

    if (UI.IsHotkeyActive("Rage", "GENERAL", "Exploits", "Doubletap")) {

        Render.String(gapX, gapY, 0, "DoubleTap", [10, 255, 114, 254], 4, 3);

    }

}
function EXTToggle()
{
   
        UI.SetValue( "Misc", "JAVASCRIPT", "Script items", "Fullsend Teleport", false );
        Render.String( 25, 1000 - 5, 0, " ", [255, 0, 0, 255], 4.6);
 
        if (UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script Items", "EXTToggle")) {

         UI.SetValue( "Misc", "JAVASCRIPT", "Script items", "Fullsend Teleport", true );
         Render.String( 25, 1000 - 5, 0, " ", [0, 255, 0, 255], 4.6);
        }
}

function EXTKey()
{
UI.AddHotkey( "Toggle Teleport", "JAVASCRIPT", "Script Items", "EXTToggle" );
}

function tp() {
    if (!UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Teleport Indicator"))

        return;
    const screenSize = Global.GetScreenSize();
    const gapX = getPercentage(screenSize[0], 48.5);
    const gapY = getPercentage(screenSize[1], 56);

    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Fullsend Teleport")) {

        Render.String(gapX, gapY, 0, "Teleport", [10, 255, 114, 254], 4, 3);

    }
}
function hs() {
    if (!UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Onshot AA Indicator"))

        return;
    const screenSize = Global.GetScreenSize();
    const gapX = getPercentage(screenSize[0], 51.0);
    const gapY = getPercentage(screenSize[1], 58);

    if (UI.IsHotkeyActive("Rage", "GENERAL", "Exploits", "Hide shots")) {

        Render.String(gapX, gapY, 0, "HS", [10, 229, 225, 255], 4, 3);

    }
}
function dmg() {
    if (!UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Min DMG Override Indicator"))

        return;
    const screenSize = Global.GetScreenSize();
    const gapX = getPercentage(screenSize[0], 51.0);
    const gapY = getPercentage(screenSize[1], 60);

    if (UI.IsHotkeyActive("Rage", "GENERAL", "Accuracy", "Minimum Damage (on key)")) {

        Render.String(gapX, gapY, 0, "DMG", [10, 229, 225, 255], 4, 3);

    }
}

Global.RegisterCallback("Draw", "main");
Global.RegisterCallback("Draw", "tp");
Global.RegisterCallback("Draw", "hs");
Global.RegisterCallback("Draw", "dmg");
Global.RegisterCallback("ragebot_fire", "modecheck");
Global.RegisterCallback("Draw", "EXTToggle")

EXTKey();


