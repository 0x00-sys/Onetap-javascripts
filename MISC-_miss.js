

UI.AddCheckbox( "[HMR] Hit/Miss Ratio" );
UI.AddCheckbox( "[HMR] Reset on round start" );

var x = 30, y = 420;

var gun_fired = false;
var font_size = 4;

var other_weapons =
[
    "knife",
    "knife_t",
    "hegrenade",
    "smokegrenade",
    "molotov",
    "incgrenade",
    "flashbang",
    "decoy",
    "taser"
];

var shots =
{
    fired: 0,
    hit: 0,
    missed: 0,
    hit_chance: 0,
    miss_chance: 0
};

function is_gun(weapon_name) {
    
    for(var i = 0; i < other_weapons.length; i++) {
        
        if(weapon_name == "weapon_" + other_weapons[i]) {

            return false;

        }

    }

    return true;

}

function weapon_fire() {
    var player_id = Event.GetInt("userid");
    var player_weapon = Event.GetString("weapon");

    if(Entity.IsLocalPlayer(Entity.GetEntityFromUserID(player_id)) && is_gun(player_weapon)) {

        shots.fired = shots.fired + 1;
        gun_fired = true;

    }
}

function player_hurt() {
    var attacker_id = Event.GetInt("attacker");
    var attacker_weapon = Event.GetString("weapon");

    if(Entity.IsLocalPlayer(Entity.GetEntityFromUserID(attacker_id)) && is_gun(attacker_weapon) && gun_fired) {

        shots.hit = shots.hit + 1;
        gun_fired = false;

    }
}

function round_prestart() {
    if( UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "[HMR] Reset on round start") ) {
        for (var key in shots){
            shots[key] = 0;
        }
    }
}

function main() {

    if(Global.GetMapName() == "" || !UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "[HMR] Hit/Miss Ratio"))
        return;
    
    shots.missed = shots.fired - shots.hit;
    shots.hit_chance = ( (shots.hit / shots.fired) * 100 );
    shots.miss_chance = ( (shots.missed / shots.fired) * 100 );
    
    text_size = Render.TextSize("total: " + shots.fired, font_size);

    Render.String(x, y, 0, "total: " + shots.fired, [255, 255, 255, 255], font_size);

    Render.String(x, y + (text_size[1]-12), 0, "hit: " + shots.hit, [30, 190, 40, 255], font_size);

    Render.String(x, y + (text_size[1]-12)*2, 0, "miss: " + shots.missed, [200, 60, 40, 255], font_size);

    if(shots.fired > 0) {

        Render.String(x, y + (text_size[1]-12)*3, 0, shots.hit + " / " + shots.fired + " = " + Math.round(shots.hit_chance), [30, 95, 190, 255], font_size);

        Render.String(x, y + (text_size[1]-12)*4, 0, shots.missed + " / " + shots.fired + " = " + Math.round(shots.miss_chance), [25,175,115, 255], font_size);

    }

}

Global.RegisterCallback("weapon_fire", "weapon_fire");
Global.RegisterCallback("player_hurt", "player_hurt");
Global.RegisterCallback("round_prestart", "round_prestart");

Global.RegisterCallback("Draw", "main");

