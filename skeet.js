function skeet(){
        var screen_size = Global.GetScreenSize();
        var x = screen_size[0]
        var y = screen_size[1]
        var h = [];
        if (UI.IsHotkeyActive("Anti-Aim", "Extra", "Slow walk")) {
            h.push(1);
        }
        if (UI.IsHotkeyActive("Anti-Aim", "Extra", "Fake duck")) {
            h.push("2");
        }
        if (UI.IsHotkeyActive("Rage", "General", "General", "Safe point override")) {
            h.push("3");
        }
        if (UI.IsHotkeyActive("Rage", "Pistol", "Damage", "Minimum damage (on key)")) {
            h.push("4");
        }
        if (UI.IsHotkeyActive("Rage", "Pistol", "Pistol config", "Hitbox override")) {
            h.push("5");
        }
        if (UI.IsHotkeyActive("Misc", "General", "Movement", "Auto peek")) {
            h.push("6");
        }
        if (UI.IsHotkeyActive("Rage", "Exploits", "Doubletap")) {
            h.push("7");
        }
        if (UI.IsHotkeyActive("Rage", "Exploits", "Hide shots")) {
            h.push("8");
        }
        var white = [255, 255, 255, 255];
        var green = [124,195,13,255];
        var distance = 25;
        for (index = 0; index < h.length; ++index) {
            if(h[index] == 1)
            {
                Render.String( 1, y - 83 - (index * distance), 0, "NASAWALK", [ 0, 252, 231, 255 ] , 4);
            }
            if(h[index] == 2)
            {
                Render.String( 1, y - 83 - (index * distance), 0, "DUCK", white , 4);
            }
            if(h[index] == 3)
            {
                Render.String( 1, y - 83 - (index * distance), 0, "SP", green , 4);
            }
            if(h[index] == 4)
            {
                Render.String( 1, y - 83 - (index * distance), 0, "DMG", green , 4);
            }
            if(h[index] == 5)
            {
                Render.String( 1, y - 83 - (index * distance), 0, "BAIM", green , 4);
            }
            if(h[index] == 6)
            {
                Render.String( 1, y - 83 - (index * distance), 0, "AUTOPICK", green , 4);
            }
            if(h[index] == 7)
            {
                Render.String( 1, y - 83 - (index * distance), 0, "DT", white , 4);
            }
            if(h[index] == 8)
            {
                Render.String( 1, y - 83 - (index * distance), 0, "HS", white , 4);
            }
        }
}
Global.RegisterCallback("Draw","skeet")