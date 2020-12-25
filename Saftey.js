/*
    VERSION: 1.1
    RELEASE TIME:   31/12/19|1:25
    ---------------------
    TBD: IGN FEET 1ST SHOT
*/
UI.AddCheckbox("Safe Revolver");
UI.AddCheckbox("Prevent Anti-Aim Correction");
UI.AddCheckbox("Prevent Height Advantage");
UI.AddCheckbox("Prevent Taser Threat");
UI.AddCheckbox("Anti Aim Clock");
var old_fake_desync = UI.GetValue("Anti-Aim", "Fake angles", "Fake desync");
var old_at_targets = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "At targets");
var old_auto_direction = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction");
var old_yaw_offset = UI.GetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset");
var res = Render.GetScreenSize();
var prevent_correction = false;
var last_prevent_time = 0;
var in_act_pha = false;
var in_act_pac = false;
var in_act_sr = false;
var in_act_ptt = false;
var local_viewangles = [];
var local_yaw_real = 0;
var local_yaw_fake = 0;
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
        if (Entity.IsTeammate(players[i])) //filters local player too
            continue;
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
function draw_angle_line(angle, x, y, length, color) {//improper since we only use our viewangles
    _angle = angle + 45;
    yaw = (_angle) * (3.14159 / 180.0);
    c_yaw = Math.cos(yaw);
    s_yaw = Math.sin(yaw);
    _x = 50 * (-c_yaw) + 50 * s_yaw;
    _y = 50 * (-c_yaw) - 50 * s_yaw;
    screen_x = x + (_x / 50 * length);
    screen_y = y + (_y / 50 * length)
    Render.Line(x, y, screen_x, screen_y, color)
    Render.Line(x, y, screen_x, screen_y + 1, color)
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
    local_viewangles = Local.GetViewAngles();
    local_yaw_real = Local.GetRealYaw();
    local_yaw_fake = Local.GetFakeYaw();
    if (UI.GetValue("Safe Revolver")) {
        if(local_weapon_id === 262208) {
            in_act_sr = Math.round(1/Globals.Frametime()) < 65 ? true : false;
            UI.SetValue("Anti-Aim", "Fake-Lag", "Enabled", Math.round(1/Globals.Frametime()) < 65 ? false : true);
        }
        else {
            in_act_sr = false;
            UI.SetValue("Anti-Aim", "Fake-Lag", "Enabled", true);
        }
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
            //UI.SetValue("Anti-Aim", "Rage Anti-Aim", "At targets", true); //test if target ent meets w at target
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction", false);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", 180);
        } else {
            in_act_pha = false;
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "At targets", old_at_targets);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Auto direction", old_auto_direction);
            UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", old_yaw_offset);
        }
    }
    if (UI.GetValue("Prevent Taser Threat")//taser == 31
        && (local_weapon_id === 11 || local_weapon_id === 38)
        && !UI.IsHotkeyActive("Exploits", "Doubletap")) {
        target = get_nearest_player();
        target_weapon_id = Entity.GetProp(Entity.GetWeapon(target), "CBaseAttributableItem", "m_iItemDefinitionIndex");
        if (target_weapon_id !== 31)
            return;
        local_origin = Entity.GetRenderOrigin(Entity.GetLocalPlayer());
        target_origin = Entity.GetRenderOrigin(target);
        if ((target_origin[2] > local_origin[2])
        && distance2D(local_origin[0], local_origin[1], target_origin[0], target_origin[1]) < 500) {
            in_act_ptt = true;
            UI.ToggleHotkey("Exploits", "Doubletap")
        } else
            in_act_ptt = false;
    } else in_act_ptt = false;
}
function draw() {
    if (!UI.GetValue("Prevent Anti-Aim Correction")
    && !UI.GetValue("Prevent Height Advantage")
    && !UI.GetValue("Safe Revolver"))
        return;
    if (World.GetServerString() == "") //unconnected
        return;
    active_features = [];
    if (UI.GetValue("Prevent Anti-Aim Correction"))
        active_features.push(["prevent correction", in_act_pac ? [0, 255, 0, 220] : [255, 255, 0, 220]]);
    if (UI.GetValue("Prevent Height Advantage"))
        active_features.push(["prevent height", in_act_pha ? [0, 255, 0, 220] : [255, 255, 0, 220]]);
    if (UI.GetValue("Safe Revolver"))
        active_features.push(["safe revolver", in_act_sr ? [0, 255, 0, 220] : [255, 255, 0, 220]]);
        if (UI.GetValue("Prevent Taser Threat"))
        active_features.push(["prevent threat", in_act_ptt ? [0, 255, 0, 220] : [255, 255, 0, 220]]);
    /*Render.Polygon( maybe will be used for something special in the future :)
        [[ (res[0] / 2) - 75, (res[1] / 2) ],
        [ (res[0] / 2) - 50, (res[1] / 2) - 15 ],
        [ (res[0] / 2) - 50, (res[1] / 2) + 15 ]],
        [255, 45, 200, 200]
    );*/

    if (UI.GetValue("Anti Aim Clock")) {
        synced_real = local_viewangles[1] - local_yaw_real;
        synced_fake = local_viewangles[1] - local_yaw_fake;
        Render.Circle(res[0] / 2, res[1] - 100, 1, [255, 255, 255, 255]);
        draw_angle_line(synced_fake, res[0] / 2, res[1] - 100, 35, [255, 80, 145, 255]);
        draw_angle_line(synced_real, res[0] / 2, res[1] - 100, 35, [50, 255, 50, 255]);//we want real to be visible at all times
        Render.Circle(res[0] / 2, res[1] - 100, 50, [0, 0, 0, 255]);// fill color
        Render.Circle(res[0] / 2, res[1] - 100, 51, [255, 0, 0, 255]);//           when ?
    }
    Render.FilledRect(
        20, 400, 160, 72, [18, 18, 18, 220]
    );
    Render.String(
        100, 404, 1, "active safety features", [255, 255, 255, 220], 8
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