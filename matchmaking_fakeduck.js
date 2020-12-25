//UI stuff here
UI.AddHotkey(["Config", "SUBTAB_MGR", "Scripts", "SHEET_MGR", "Keys", "JS Keybinds"], "Fake Duck", "");
var crouchHeight;

function FakeDuck() {
    var cmd = UserCMD.GetButtons();
    //If key is held do ducking
    if(UI.GetValue(["Config", "SUBTAB_MGR", "Scripts", "SHEET_MGR", "Keys", "JS Keybinds", "Fake Duck"])) {
        var entityStuff = Entity.GetProp(Entity.GetLocalPlayer(), "CCSPlayer", "m_flDuckAmount");
        if(UserCMD.Choke(), entityStuff <= .28) {
            crouchHeight = !0
        }
        if(entityStuff >= .8 && (crouchHeight = !1, UserCMD.Send()), crouchHeight) {
            UserCMD.SetButtons(4 | cmd)
        } else UserCMD.SetButtons(cmd | 1 << 22)
    } else {
        UserCMD.SetButtons(cmd | 1 << 22)
    }
}
function DrawThread()
{
    var customFont = Render.AddFont("Tahomabd", 14, 800);

    if(UI.GetValue(["Config", "SUBTAB_MGR", "Scripts", "SHEET_MGR", "Keys", "JS Keybinds", "Fake Duck"]))
        {
            //Renders "DUCK" if we are pressing Key
            Render.String(10, 720 / 2 + 358, 0, "DUCK", [255, 255, 255, 255], customFont);
        }
}
Cheat.RegisterCallback("CreateMove", "FakeDuck");

Cheat.RegisterCallback("Draw", "DrawThread");
