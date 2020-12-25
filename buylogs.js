UI.AddCheckbox("Buy logs");
function BuyLogs(){
    Global.Print('k')
    if (UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Buy logs")) {
        var ent = Entity.GetEntityFromUserID(Event.GetInt('userid'))
        var team = Event.GetInt('team')
        if (team != Entity.GetProp(Entity.GetLocalPlayer(), "CBaseEntity", "m_iTeamNum")) {
            var item = Event.GetString('weapon')
            item = item.replace("weapon_", "")
            item = item.replace("item_", "")
            item = item.replace("assaultsuit", "kevlar + helmet")
            item = item.replace("incgrenade", "molotov")
            if (item != "unknown") {
                var name = Entity.GetName(ent)
                Global.PrintChat(" \x01[\x06onetap.su\x01] \x04" + name + " \x01bought \x04" + item + " \n");
            }
        }
    }
}
Global.RegisterCallback("item_purchase", "BuyLogs");