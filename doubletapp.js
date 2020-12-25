UI.AddCheckbox("Better doubletap");

function on_ragebot_fire()
{ 
    
    ragebot_target_exploit = Event.GetInt("exploit");
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Better doubletap"))
    {
        if (ragebot_target_exploit == 2)
        {
            UI.SetValue("Rage", "GENERAL", "Exploits", "Doubletap fast recovery", true);
        }
        else
        {
            UI.SetValue("Rage", "GENERAL", "Exploits", "Doubletap fast recovery", false);
        }
    }
            
}

Global.RegisterCallback("ragebot_fire", "on_ragebot_fire");
