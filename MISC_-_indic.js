

UI.AddCheckbox("Vizualize Indicators");
UI.AddSliderInt("Indicator Y Position", 1, 100);

function drawFunction(){
    var shouldDraw = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Vizualize Indicators");
    if (shouldDraw) {
       
        var screen_size = Global.GetScreenSize();
        var x = screen_size[0] / 92
        var y = screen_size[1] - (UI.GetValue("Misc", "JAVASCRIPT", "Script Items","Indicator Y Position") * 10)

        var hotkeyArray = [
           
        ];
        if (UI.IsHotkeyActive("Anti-Aim", "Extra", "Slow walk")) {
            hotkeyArray.push("CRIPWALK")
        }
        if (UI.IsHotkeyActive("Anti-Aim", "Extra", "Fake duck")) {
            hotkeyArray.push("FAKE DUCK")
        }
        if (UI.IsHotkeyActive("Rage", "General", "General", "Safe point override")) {
            hotkeyArray.push("SAFE HOUSE")
        }
        if (UI.IsHotkeyActive("Rage", "Pistol", "Damage", "Minimum damage (on key)")) {
            hotkeyArray.push("MIN DMG")
        }
        if (UI.IsHotkeyActive("Rage", "Pistol", "Pistol config", "Hitbox override")) {
            hotkeyArray.push("HOTBOX")
    }
        if (UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter")) {
            hotkeyArray.push("SWITCHIN HOES")
    }
        if (UI.IsHotkeyActive("Misc", "General", "Movement", "Auto peek")) {
            hotkeyArray.push("PEEK")
    }
    if (UI.IsHotkeyActive("Rage", "Exploits", "Doubletap")) {
        hotkeyArray.push("DOUBLE PENETRATION")
        }
        var text_size = 4
       
        for (var i=0;i < hotkeyArray.length;i++) {
            //Global.Print("STD:" + hotkeyArray[i][0])
            var textHeight = text_size*5.5
            var y_add = (textHeight * i)
            Render.String( x, y - y_add, 0, hotkeyArray[i], [124,195,13,255],text_size);  
        }
    }
}
Global.RegisterCallback("Draw","drawFunction")

