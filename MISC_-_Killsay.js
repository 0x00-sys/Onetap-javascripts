

UI.AddCheckbox("Enable Trashtalker")
UI.AddTextbox("Trashtalker");
UI.AddCheckbox("Trashtalker: Include Victim Name");
UI.AddCheckbox("Trashtalker: Deathmatch Mode");

var get = {
    value(v) {
        return UI.GetValue("Misc", "JAVASCRIPT", "Script items", v);
    },

    string(s) {
        return UI.GetString("Misc", "JAVASCRIPT", "Script items", s);
    }
}

function onPlayerDeath() {
    if (!get.value("Enable Trashtalker")) return;

    attacker = Event.GetInt("attacker");
    victim = Event.GetInt("userid");

    attacker_index = Entity.GetEntityFromUserID(attacker);
    victim_index = Entity.GetEntityFromUserID(victim);

    attacker_name = Entity.GetName(attacker_index);
    victim_name = Entity.GetName(victim_index);

    attacker_me = Entity.IsLocalPlayer(attacker_index);
    victim_enemy = Entity.IsEnemy(victim_index);

    is_dm = get.value("Trashtalker: Deathmatch Mode")

    if (attacker_me) {
        if (is_dm) {
            Global.ExecuteCommand("say "
                + (get.value("Trashtalker: Include Victim Name") ? victim_name + " " : "")
                + get.string("Trashtalker"));
        } else if (victim_enemy) {
            Global.ExecuteCommand("say "
                + (get.value("Trashtalker: Include Victim Name") ? victim_name + " " : "")
                + get.string("Trashtalker"));
        }
    }
}

Global.RegisterCallback("player_death", "onPlayerDeath");

