var screen_size = Global.GetScreenSize();
var isLeftActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Left Hotkey" );
UI.AddColorPicker("Arrows color");
UI.AddColorPicker("Selected arrow color");
UI.AddColorPicker("Text color");
var isRightActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Right Hotkey" );
var isBackwardsActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Backwards Hotkey" );
var isHideRealActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "HideReal Hotkey" );
var isInverted;
var drawLeft = 1; drawHideReal = 1;
var drawRight = 0, drawBack = 0;
       
function drawString()
{
    arrowscp = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Arrows color");
    textcp = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Text color");
    selectedcp = UI.GetColor("Misc", "JAVASCRIPT", "Script items", "Selected arrow color");
    arrows_red = arrowscp[0];
    arrows_green = arrowscp[1];
    arrows_blue = arrowscp[2];
    arrows_alpha = arrowscp[3];
    text_red = textcp[0];
    text_green = textcp[1];
    text_blue = textcp[2];
    text_alpha = textcp[3];
    selected_red = selectedcp[0];
    selected_green = selectedcp[1];
    selected_blue = selectedcp[2];
    selected_alpha = selectedcp[3];
    isHideshots = UI.IsHotkeyActive("Rage", "Exploits", "Hide shots");
    isSafepoint = UI.IsHotkeyActive("Rage", "General", "Safe point override");
    isDoubletap = UI.IsHotkeyActive("Rage", "Exploits", "Doubletap");
    isInverted = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter");
    Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +50, 0, "DESYNC", [ text_red, text_green, text_blue, text_alpha ], 3 );

   
    if(drawLeft)
    {
        Render.String(screen_size[0] /2 -50, screen_size[1] /2 -30, 1,  "<", [ selected_red, selected_green, selected_blue, selected_alpha ], 4 );
        Render.String(screen_size[0] /2 +50, screen_size[1] /2 -30, 1,  ">", [ arrows_red, arrows_green, arrows_blue, arrows_alpha ], 4 );
        Render.String(screen_size[0] /2, screen_size[1] /2 +25, 1,  "v", [ arrows_red, arrows_green, arrows_blue, arrows_alpha ], 4 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +58, 0, isInverted ? "LEFT" : "RIGHT", [ text_red, text_green, text_blue, text_alpha ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +66, 0, isHideshots ? "HIDE" : "HIDE", isHideshots ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +74, 0, isDoubletap ? "DT" : "DT", isDoubletap ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +82, 0, isSafepoint ? "SP" : "SP", isSafepoint ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
    }
    else if(drawRight)
    {  
        Render.String(screen_size[0] /2 -50, screen_size[1] /2 -30, 1,  "<", [ arrows_red, arrows_green, arrows_blue, arrows_alpha ], 4 );
        Render.String(screen_size[0] /2 +50, screen_size[1] /2 -30, 1,  ">", [ selected_red, selected_green, selected_blue, selected_alpha ], 4 );
        Render.String(screen_size[0] /2, screen_size[1] /2 +25, 1,  "v", [ arrows_red, arrows_green, arrows_blue, arrows_alpha ], 4 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +58, 0, isInverted ? "LEFT" : "RIGHT", [ text_red, text_green, text_blue, text_alpha ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +66, 0, isHideshots ? "HIDE" : "HIDE", isHideshots ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +74, 0, isDoubletap ? "DT" : "DT", isDoubletap ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +82, 0, isSafepoint ? "SP" : "SP", isSafepoint ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
    }
    else if(drawBack)
    {
        Render.String(screen_size[0] /2 -50, screen_size[1] /2 -30, 1,  "<", [ arrows_red, arrows_green, arrows_blue, arrows_alpha ], 4 );
        Render.String(screen_size[0] /2 +50, screen_size[1] /2 -30, 1,  ">", [ arrows_red, arrows_green, arrows_blue, arrows_alpha ], 4 );
        Render.String(screen_size[0] /2, screen_size[1] /2 +25, 1,  "v", [ selected_red, selected_green, selected_blue, selected_alpha ], 4 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +58, 0, isInverted ? "LEFT" : "RIGHT", [ text_red, text_green, text_blue, text_alpha ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +66, 0, isHideshots ? "HIDE" : "HIDE", isHideshots ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +74, 0, isDoubletap ? "DT" : "DT", isDoubletap ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +82, 0, isSafepoint ? "SP" : "SP", isSafepoint ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
   
    }
    else if(drawHideReal)
    {
        Render.String(screen_size[0] /2 -50, screen_size[1] /2 -20, 1,  "<", [ 255, 255, 255, 255 ], 4 );
        Render.String(screen_size[0] /2 +50, screen_size[1] /2 -20, 1,  ">", [ 255, 255, 255, 255 ], 4 );
        Render.String(screen_size[0] /2, screen_size[1] /2 +25, 1,  "v", [ 255, 255, 255, 255 ], 4 );
        Render.String(screen_size[0] /2 + 14 , screen_size[1] /2 +58, 0, isHideshots ? "HIDE" : "HIDE", isHideshots ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +66, 0, isDoubletap ? "DT" : "DT", isDoubletap ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
        Render.String(screen_size[0] /2 + 14, screen_size[1] /2 +74, 0, isSafepoint ? "SP" : "SP", isSafepoint ? [ 124, 195, 13, 255 ] : [ 255, 0, 0, 255 ],3 );
    }
}

function onCreateMove()
{
    isLeftActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Left Hotkey" );
    isRightActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Right Hotkey" );
    isBackwardsActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "Backwards Hotkey" );
    isHideRealActive = UI.IsHotkeyActive( "Misc", "JAVASCRIPT", "Script items", "HideReal Hotkey" );
   
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
    else if(isBackwardsActive)
    {  
        drawLeft = 0;
        drawBack = 1;
        drawRight = 0;
        UI.SetValue( "Anti-Aim", "Rage Anti-Aim", "Yaw offset", 0 );
        UI.SetValue( "Anti-Aim", "Fake Angles", "Hide real angle", false);
    }
    else if(isHideRealActive)
    {
        drawLeft = 0;
        drawBack = 0;
        drawRight = 0;
        UI.SetValue( "Anti-Aim", "Rage Anti-Aim", "Yaw offset", 0 );
        UI.SetValue("Anti-Aim", "Fake Angles", "Hide real angle", true);
    }
}

function Main()
{
    UI.AddHotkey( "Left Hotkey" );
    UI.AddHotkey( "Right Hotkey" );
    UI.AddHotkey( "Backwards Hotkey" );
    UI.AddHotkey( "HideReal Hotkey" );
   
    //  callbacks
    Global.RegisterCallback("Draw", "drawString")
    Global.RegisterCallback("CreateMove", "onCreateMove")
}
Main();