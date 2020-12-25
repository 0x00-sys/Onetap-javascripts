UI.AddCheckbox("Doubletap Teleport");
UI.SetValue("Rage", "GENERAL", "Exploits", "Teleport release", true);
function on_ragebot_fire()
{
    ragebot_target_exploit = Event.GetInt("exploit");
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Doubletap Teleport"))
    {
        (ragebot_target_exploit == 2) ? UI.ToggleHotkey("Rage", "GENERAL", "Exploits", "Doubletap") : UI.ToggleHotkey("Rage", "GENERAL", "Exploits", "Doubletap");
    }   
}
Global.RegisterCallback("ragebot_fire", "on_ragebot_fire");