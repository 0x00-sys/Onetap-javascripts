/**
 *
 * Title: Faster double tap
 * Author: april#0001
 * Description:
 * Customer: Stops all sorts of chocking to ensure maximum double tap speed
 *
*/

//region menu

const enable = UI.AddCheckbox("Double tap modifier");
const velocity = UI.AddDropdown("Double tap mode", ["Quick", "Accurate"]);

//endregion

//region functions

//region dependencies

function clamp(v, min, max)
{
    return Math.min(Math.max(v, min), max);
}

/**
 * @class vec3_t
 * @description Vector3D
*/
const vec3_t = {
    new: function(x, y, z) { return {x: x, y: y, z: z} },

    add: function(vec1, vec2) { return { x: vec1.x + vec2.x, y: vec1.y + vec2.y, z: vec1.z + vec2.z } },

    sub: function(vec1, vec2) { return { x: vec1.x - vec2.x, y: vec1.y - vec2.y, z: vec1.z - vec2.z } },

    multiply: function(vec1, vec2) { return { x: vec1.x * vec2.x, y: vec1.y * vec2.y, z: vec1.z * vec2.z } },

    divide: function(vec1, vec2) { return { x: vec1.x / vec2.x, y: vec1.y / vec2.y, z: vec1.z / vec2.z } }
};

/**
 * @class col_t
 * @description RBGA Colors
 */
const col_t = {
    new: function(r, g, b, a) { return {r: r, g: g, b: b, a: a}},
    unpack: function(col) { return [col.r, col.g, col.b, col.a]},
    shift: function(color, dst, dur) {
        if (!color.r || !dst.r)
            return;

        const inc = ((1 / dur) * Global.Frametime()) * 255;
        const is_color_equal = function(col1, col2) {
            return (col1.r === col2.r) && (col1.g === col2.g) && (col1.b === col2.b) && (col1.a === col2.a);
        };

        if (is_color_equal(color, dst))
            return color;

        // Best code I've ever made.
        if (color.r > dst.r)
        {
            color.r = clamp(color.r - inc, dst.r, 255);
        }

        if (color.r < dst.r)
        {
            color.r = clamp(color.r + inc, 0, dst.r);
        }

        if (color.g > dst.g)
        {
            color.g = clamp(color.g - inc, dst.g, 255);
        }

        if (color.g < dst.g)
        {
            color.g = clamp(color.g + inc, 0, dst.g);
        }

        if (color.b > dst.b)
        {
            color.b = clamp(color.b - inc, dst.b, 255);
        }

        if (color.b < dst.b)
        {
            color.b = clamp(color.b + inc, 0, dst.b);
        }

        if (color.a > dst.a)
        {
            color.a = clamp(color.a - inc, dst.a, 255);
        }

        if (color.a < dst.a)
        {
            color.a = clamp(color.a + inc, 0, dst.a);
        }

        return color;
    }
};

const rad2deg = function(rad) {
    return (rad * 180) / Math.PI;
};

const deg2rad = function(deg) {
    return (deg * Math.PI) / 180;
};

//endregion

const calculate_distance = function(src, dst)
{
    if (!src.x || !dst.x)
        return 0;

   return (Math.sqrt(Math.pow(src.x - dst.x, 2) + Math.pow(src.y - dst.y, 2) + Math.pow(src.z + dst.z, 2)));
};

const update_hitchance = function() {
    const hitchances = {0: 0, 1: 45};

    UI.SetValue("Rage", "GENERAL", "Exploits", "Doubletap hitchance", hitchances[UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Double tap mode")]);
};

function main()
{
    // Check whether the script is on or not
    if (!UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Double tap modifier"))
        return;

    // Update script hithance
    update_hitchance();

    // Get entity properties
    const player = Entity.GetLocalPlayer();
    const viewangles = vec3_t.new(Global.GetViewAngles()[0], Global.GetViewAngles()[1], Global.GetViewAngles()[2]);
    const eyepos = vec3_t.new(Entity.GetEyePosition(player)[0], Entity.GetEyePosition(player)[1], Entity.GetEyePosition(player)[2]);
    const enemies = Entity.GetEnemies();

    // Initiate our values
    var target_dist = 133337;
    var target_index = -1;

    // Loop through our enemies and find best target
    for (var i = 0; i < enemies.length; i++)
    {
        // Our current enemy
        const ent = enemies[i];

        // Checks whether the entity is dormant or not
        if (Entity.IsDormant(ent))
            break;

        // Checks whether the entity is alive or not
        if (!Entity.IsAlive(ent))
            break;

        // Calculates the distance between you and the enemy
        const dst = Entity.GetProp(ent, "CBaseEntity", "m_vecOrigin");

        var distance = calculate_distance(eyepos, vec3_t.new(dst[0], dst[1], dst[2]));

        // If the distance is lower than our current target distance, then change target (Distance based)
        if (distance < target_dist) {
            target_dist = distance;
            target_index = ent;
        }

    }

    // If we didn't find any targets, return
    if (target_index === -1)
    {
        UI.SetValue("Anti-Aim", "Fake angles", "Enabled", 1);
        return;
    }

    // Creates a variable to check if we're aiming at our target
    var is_targeting = false;

    // Checks if we're aiming at our target
    for (var h = 0; h < 19; h++)
    {
        // Trace a bullet to our target and check if we hit it
        var hitbox = Entity.GetHitboxPosition(target_index, h);
        var bullet_data = Trace.Bullet(player, [eyepos.x, eyepos.y, eyepos.z], hitbox);

        // If the entity the bullet trace hit is the same as our target, then we're aiming at him.
        if (bullet_data[0] === target_index)
            is_targeting = true;
    }

    // If we're aiming at our target and we're using doubletap, then disable desync
    if (is_targeting && UI.IsHotkeyActive("Rage", "GENERAL", "Exploits", "Doubletap")) {
        UI.SetValue("Anti-Aim", "Fake angles", "Enabled", 0);
        return;
    }

    // Otherwise, re-enable desync
    UI.SetValue("Anti-Aim", "Fake angles", "Enabled", 1);

}

// Create our color value
var draw_color = col_t.new(145, 160, 251, 200);

function indicator()
{
    // Check whether the script is on or not
    if (!UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Double tap modifier"))
        return;

    // Initiate dormant and active colors
    const colors = {
        blue: col_t.new(145, 160, 251, 225),
        red: col_t.new(235, 90, 80, 255)
    };

    // Get drawing properties
    const x = Global.GetScreenSize()[0], y = Global.GetScreenSize()[1];

    // Render indicator
    Render.String(50, y - 124, 0, "DT", [2, 2, 2, 225], 4);
    Render.String(50, y - 125, 0, "DT", col_t.unpack(draw_color), 4);
    Render.FilledRect( 50, y - 90, 36, 3, [2, 2, 2, 125]);
    Render.FilledRect( 50, y - 90, (draw_color.r - 145) * 96 / 235, 3, col_t.unpack(colors.red));

    // Check whether the script is on or not
    if (!UI.IsHotkeyActive("Rage", "GENERAL", "Exploits", "Doubletap"))
    {
        // Shifts to the dormant color
        draw_color = col_t.shift(draw_color, colors.blue, 0.5);
        return;
    }

    // Shifts to the active color
    draw_color = col_t.shift(draw_color, colors.red, 1);

}

//endregion

//region callbacks

Global.RegisterCallback("CreateMove", "main");
Global.RegisterCallback("Draw", "indicator");

//endregion