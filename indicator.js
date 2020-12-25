//Modified by Reptar
//Originals made by :
//Signal for the idea
//Ultranite for help
//AA Indicators by 57777
//Fake Indicator by dummy (Decommissioned)
//Base by Snipi https://onetap.su/threads/release-manual-aa-indicators.13542/#post-110857
//shoutout to edeen and ntrzr

//If I forgot you, Please let me know



//indicator vars
var screen_size = Global.GetScreenSize();
var isLeftActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Left Hotkey" );
var isRightActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Right Hotkey" );
var isBackActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Back Hotkey" );
var isInverted;
var drawLeft = 0;
var drawRight = 0;
var drawBack = 1;
//ui
UI.AddColorPicker("Selected arrow color");
UI.AddHotkey( "Left Hotkey" );
UI.AddHotkey( "Back Hotkey" );
UI.AddHotkey( "Right Hotkey" );

//Polygon Points
LPx = [(screen_size[0] /2) - 50, (screen_size[1] /2) + 10];
LPy = [(screen_size[0] /2) - 50, (screen_size[1] /2) - 10];
LPz = [(screen_size[0] /2) - 70, (screen_size[1] /2)];
RPx = [(screen_size[0] /2) + 50, (screen_size[1] /2) + 10];
RPy = [(screen_size[0] /2) + 50, (screen_size[1] /2) - 10];
RPz = [(screen_size[0] /2) + 70, (screen_size[1] /2)];
LPxx = [(screen_size[0] /2) - 49, (screen_size[1] /2) + 12];
LPyy = [(screen_size[0] /2) - 49, (screen_size[1] /2) - 12];
LPzz = [(screen_size[0] /2) - 73, (screen_size[1] /2)];
RPxx = [(screen_size[0] /2) + 49, (screen_size[1] /2) + 12];
RPyy = [(screen_size[0] /2) + 49, (screen_size[1] /2) - 12];
RPzz = [(screen_size[0] /2) + 73, (screen_size[1] /2)];
BPx = [(screen_size[0] /2) + 10, (screen_size[1] /2) + 50];
BPy = [(screen_size[0] /2) - 10, (screen_size[1] /2) + 50];
BPz = [(screen_size[0] /2), (screen_size[1] /2) + 70];
BPxx = [(screen_size[0] /2) + 12, (screen_size[1] /2) + 49];
BPyy = [(screen_size[0] /2) - 12, (screen_size[1] /2) + 49];
BPzz = [(screen_size[0] /2), (screen_size[1] /2) + 73];

Cheat.PrintColor([255, 75, 100, 25], "\n------------------------\nReptar's Indicators\n------------------------\n");

       
function drawString()
{
    selectedcp = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Selected arrow color");
    selected_red = selectedcp[0];
    selected_green = selectedcp[1];
    selected_blue = selectedcp[2];
    selected_alpha = selectedcp[3];
    const alpha = Math.sin(Math.abs(-Math.PI + (Globals.Curtime() * (1 / .75)) % (Math.PI * 2))) * 255;
    const alphaa = Math.sin(Math.abs(-Math.PI + (Globals.Curtime() * (1 / 2)) % (Math.PI * 2))) * 255;
    isHideshots = UI.IsHotkeyActive("Rage", "Exploits", "Hide shots");
    isFakeduck = UI.IsHotkeyActive("Anti-Aim", "Extra", "Fake duck");
    isDoubletap = UI.IsHotkeyActive("Rage", "Exploits", "Doubletap");
    isInverted = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter" );
    isDmgActive = UI.IsHotkeyActive("Rage", "GENERAL", "Accuracy", "Minimum damage (on key)");
    isLbyMode = UI.GetValue("Anti-Aim", "Fake angles", "LBY mode");
    isDesyncMode = UI.GetValue("Anti-Aim", "Fake angles", "Fake desync");
    localplayer_index = Entity.GetLocalPlayer( );
    localplayer_alive = Entity.IsAlive( localplayer_index );
    
    //Fake Indicator Plus
    //var difference = Math.abs( Local.GetRealYaw( ) - Local.GetFakeYaw( ) );
    //Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +101, 1, "FAKE", [ 0, 0, 0, 255 ], 3 );
    //Render.String(screen_size[0] /2, screen_size[1] /2 +100, 1, "FAKE", [ difference * 255 / 58, 255 - ( difference * 255 / 58 ), 0 , 255], 3 );
    
    if (localplayer_alive == true){
    //Shadows
    Render.Polygon([LPxx, LPzz, LPyy], [0, 0, 0, 60] );
    Render.Polygon([RPyy, RPzz, RPxx], [0, 0, 0, 60] );
    Render.Polygon([BPyy, BPxx, BPzz], [0, 0, 0, 60] );
    Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +101, 1, isLbyMode ? "FAKE" : "NORM", [ 0, 0, 0, 255 ], 3 );
    Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +121, 1, isDoubletap ? "DT" : "DT", isDoubletap ? [ 0, 0, 0, 255 ] : [ 0, 0, 0, 255 ], 3 );
    Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +131, 1, isDmgActive ? "WALL" : "DMG", isDmgActive ? [ 0, 0, 0, 255 ] : [ 0, 0, 0, 255 ], 3 );
    Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +141, 1, isHideshots ? "HIDE" : "ANIM", isHideshots ? [ 0, 0, 0, 255 ] : [ 0, 0, 0, 255 ], 3 );
    Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +151, 1, isFakeduck ? "DUCK" : "", isFakeduck ? [ 0, 0, 0, 255 ] : [ 0, 0, 0, 0 ], 3 );
    
    //indicators
    Render.String(screen_size[0] /2, screen_size[1] /2 +100, 1, isLbyMode ? "FAKE" : "NORM", [ 0, 255, 255 , 255], 3 );
    Render.String(screen_size[0] /2, screen_size[1] /2 +120, 1, isDoubletap ? "DT" : "DT", isDoubletap ? [ 0, 255, 0, 255 ] : [ 255, 0, 0, 255 ], 3 );
    Render.String(screen_size[0] /2, screen_size[1] /2 +130, 1, isDmgActive ? "WALL" : "DMG", isDmgActive ? [ 255, 159, 212, 255] : [ 255, 159, 212, 255 ], 3 );
    Render.String(screen_size[0] /2, screen_size[1] /2 +140, 1, isHideshots ? "HIDE" : "ANIM", isHideshots ? [ 145, 120, 229, 255 ] : [ 255, 153, 0, alpha ], 3 );
    Render.String(screen_size[0] /2, screen_size[1] /2 +150, 1, isFakeduck ? "DUCK" : "", isFakeduck ? [ 255, 255, 255, 255 ] : [ 0, 0, 0, 0 ], 3 );
    
    //inverter indicators
    if(isDesyncMode == 0)
    {
        Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +111, 1, isInverted ? "LEFT" : "RIGHT", [ 0, 0, 0, 255 ], 3 );
        Render.String(screen_size[0] /2, screen_size[1] /2 +110, 1, isInverted ? "LEFT" : "RIGHT", [ 255, 255, 255, 255 ], 3 );
    }
    else if(isDesyncMode == 1)
    {
        Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +111, 1, isInverted ? "RIGHT" : "LEFT", [ 0, 0, 0, 255 ], 3 );
        Render.String(screen_size[0] /2, screen_size[1] /2 +110, 1, isInverted ? "RIGHT" : "LEFT", [ 255, 255, 255, 255 ], 3 );
    }

    
    if(drawLeft)
    {
        Render.Polygon([LPx, LPz, LPy], [ selected_red, selected_green, selected_blue, selected_alpha] );
    }
    else if(drawRight)
    {      
        Render.Polygon([RPy, RPz, RPx], [ selected_red, selected_green, selected_blue, selected_alpha] );
    }
    else if(drawBack)
    {
        Render.Polygon([BPy, BPx, BPz], [ selected_red, selected_green, selected_blue, selected_alpha] );
    }
}}

function onCreateMove()
{
    isLeftActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Left Hotkey" );
    isRightActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Right Hotkey" );
    isBackActive = UI.IsHotkeyActive("Misc", "JAVASCRIPT", "Script items", "Back Hotkey" );
   
    if(isLeftActive)
    {  
        drawLeft = 1;
        drawBack = 0;
        drawRight = 0;
        UI.SetValue( "Anti-Aim", "Rage Anti-Aim", "Yaw offset", -90 );
        UI.SetValue( "Anti-Aim", "Fake Angles", "Hide real angle", false);
    }
    else if(isRightActive)
    {  
        drawLeft = 0;
        drawBack = 0;
        drawRight = 1;
        UI.SetValue( "Anti-Aim", "Rage Anti-Aim", "Yaw offset", 90 );
        UI.SetValue( "Anti-Aim", "Fake Angles", "Hide real angle", false);
       
    }
        else if(isBackActive)
    {  
        drawLeft = 0;
        drawBack = 1;
        drawRight = 0;
        UI.SetValue( "Anti-Aim", "Rage Anti-Aim", "Yaw offset", 0 );
        UI.SetValue( "Anti-Aim", "Fake Angles", "Hide real angle", false);
       
    }
}


function Main()
{
    Global.RegisterCallback("Draw", "drawString")
    Global.RegisterCallback("CreateMove", "onCreateMove")
}

Main();