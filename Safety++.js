/*
    VERSION: 1.0
    RELEASE TIME:
    ---------------------
    TBD: IGN FEET 1ST SHOT
*/
UI.AddCheckbox("Safe Revolver");
UI.AddCheckbox("Prevent Anti-Aim Correction");
UI.AddCheckbox("Prevent Height Advantage");
var old_fake_desync = UI.GetValue("Anti-Aim", "Fake angles", "Fake desync");
var old_at_targets = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "At targets");
var old_auto_direction = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction");
var old_yaw_offset = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset");
var prevent_correction = false;
var last_prevent_time = 0;
var in_act_pha = false;
var in_act_pac = false;
var in_act_sr = false;
function distance(a, b) {
    ax = a[0], ay = a[1], az = a[2];
    bx = b[0], by = b[1], bz = b[2];
    dx = ax - bx, dy = ay - by, dz = az - bz;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function distance2D( x1, y1, x2, y2 ) {
    xs = x2 - x1, ys = y2 - y1;
       
    xs *= xs;
    ys *= ys;
    
    return Math.sqrt( xs + ys );
}
function difference(a, b) {
    if (a > b) {
      return a - b;
    } else {
      return b - a;
    }
}
function get_nearest_player() {
    players = Entity.GetPlayers();
    local_origin = Entity.GetRenderOrigin(Entity.GetLocalPlayer());
    target_origin = 0;
    target = 0;
    for (i=0; i < players.length; i++) {
        if (!Entity.IsAlive(players[i]))
            continue;
        //if (Entity.IsBot(players[i]))
        //    continue;
        if (Entity.IsTeammate(players[i])) //filters local player too
            continue;
        /*if (Entity.IsValid(players[i])) //doesn't work on bots (?)
              continue;*/
        if(Entity.IsDormant(players[i]))
            continue;
        entity_origin = Entity.GetRenderOrigin(players[i]);
        if (target === 0)
            target_origin = [999999, 999999, 999999]; //FK FLT_MAX LOL
        if (distance(local_origin, target_origin) > distance(local_origin, entity_origin)){
            target = players[i];
            target_origin = entity_origin;
        }
    }
    return target;
}
function player_hurt() {
    target = Event.GetInt("userid");
    attacker = Event.GetInt("attacker");
    damage = Event.GetInt("dmg_health");
    hitgroup = Event.GetInt("hitgroup");
    if ((Entity.GetLocalPlayer() === Entity.GetEntityFromUserID(target))
    && Entity.GetLocalPlayer() !==  Entity.GetEntityFromUserID(attacker)) {
        health = Entity.GetProp(Entity.GetLocalPlayer(), "CBasePlayer", "m_iHealth");
        if (hitgroup === 1 && (health / damage) >= 2)
            prevent_correction = true;
        else
            prevent_correction = false;
    }
}
function create_move() {
    local_weapon_id = Entity.GetProp(Entity.GetWeapon(Entity.GetLocalPlayer()), "CBaseAttributableItem", "m_iItemDefinitionIndex");
    local_origin = Entity.GetProp(Entity.GetLocalPlayer(), "CBaseEntity", "m_vecOrigin");
    if (UI.GetValue("Safe Revolver"))
        if(local_weapon_id === 262208) {
            in_act_sr = Math.round(1/Globals.Frametime()) < 65 ? true : false;
            UI.SetValue("Anti-Aim", "Fake-Lag", "Enabled", Math.round(1/Globals.Frametime()) < 65 ? false : true);
        }
        else {
            in_act_sr = false;
            UI.SetValue("Anti-Aim", "Fake-Lag", "Enabled", true);
        }
           
    if (UI.GetValue("Prevent Anti-Aim Correction")) {
        if (prevent_correction) {
            in_act_pac = true;
            fake_desync = UI.GetValue("Anti-Aim", "Fake angles", "Fake desync"); 
            UI.SetValue("Anti-Aim", "Fake angles", "Fake desync", fake_desync ? false : true);
            last_prevent_time = Globals.Curtime();
            prevent_correction = false;
        }
        else if (Globals.Curtime() - last_prevent_time > 2.5) {
            in_act_pac = false;
            UI.SetValue("Anti-Aim", "Fake angles", "Fake desync", old_fake_desync);
        }
    }
    if (UI.GetValue("Prevent Height Advantage")) {
        target = get_nearest_player();
       
        if (target === 0 || !Entity.IsAlive(target)) {
            in_act_pha = false;
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "At targets", old_at_targets);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction", old_auto_direction);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", old_yaw_offset);
            return;
        }
        local_origin = Entity.GetRenderOrigin(Entity.GetLocalPlayer());
        target_origin = Entity.GetRenderOrigin(target);
        if ((target_origin[2] > local_origin[2])
        && difference(target_origin[2], local_origin[2]) > 64
        && distance2D(local_origin[0], local_origin[1], target_origin[0], target_origin[1]) < 400) {
            in_act_pha = true;
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "At targets", true); //test if target ent meets w at target
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction", false);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", 180);
        } else {
            in_act_pha = false;
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "At targets", old_at_targets);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction", old_auto_direction);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", old_yaw_offset);
        }
    }
}
function draw() {
    if (!UI.GetValue("Prevent Anti-Aim Correction")
    && !UI.GetValue("Prevent Height Advantage")
    && !UI.GetValue("Safe Revolver"))
        return;
    active_features = [];
    if (UI.GetValue("Prevent Anti-Aim Correction"))
        active_features.push(["prevent correction", in_act_pac ? [0, 255, 0, 220] : [255, 255, 0, 220]]);
    if (UI.GetValue("Prevent Height Advantage"))
        active_features.push(["prevent height", in_act_pha ? [0, 255, 0, 220] : [255, 255, 0, 220]]);
    if (UI.GetValue("Safe Revolver"))
        active_features.push(["safe revolver", in_act_sr ? [0, 255, 0, 220] : [255, 255, 0, 220]]);
    Render.FilledRect(
        20, 400, 160, 80, [18, 18, 18, 220]
    );
    Render.String(
        100, 404, 1, "active features", [255, 255, 255, 220], 8
    );
    Render.Line(
        30, 415, 170, 415, [160, 160, 160, 220]
    );
    pos = 0;
    for (i=0; i < active_features.length; i++) {
        Render.String(
            30, 418 + pos, 0, active_features[i][0], active_features[i][1], 8
        );
        pos = pos + 12;
    }
}
Cheat.RegisterCallback("player_hurt", "player_hurt");
Cheat.RegisterCallback("CreateMove", "create_move");
Cheat.RegisterCallback("Draw", "draw");