UI.AddCheckbox("Teleport on peek");
UI.AddHotkey("Toggle key");
UI.AddSliderInt("Predicted ticks", 2, 5);
UI.AddSliderFloat("Teleport cooldown", 1.0, 10.0);
UI.AddSliderInt("Minimum damage to trigger teleport", 1, 20);
UI.AddCheckbox("Enable doubletap after teleport");
UI.AddCheckbox("Recharge after teleport");
UI.AddCheckbox("Render indicator");
//useless js but its aight i guess
//code starting from this point is april#0001's vector thing
/**
 * @title Vector
 * @description Simple 3d vector system
 *
 * @typedef Vector {x: number, y: number, z: number}
 */
var vector = {
    _class: 'vector'
};
/**
 * @brief Creates a new 3d vector instance.
 * @param data {array}
 * @returns {Vector}
 */
vector.new = function(data)
{
    return {
        x: data[0],
        y: data[1],
        z: data[2]
    };
};
/**
 * @brief Realizes a mathematical operation between two vectors.
 * @param vec {Vector}
 * @param vec2 {Vector}
 * @param operation {string}
 * @returns {Vector}
 */
vector.operate = function(vec, vec2, operation)
{
  switch (operation)
  {
      case '+':
          return {
              x: vec.x + vec2.x,
              y: vec.y + vec2.y,
              z: vec.z + vec2.z
          };
      case '-':
          return {
              x: vec.x - vec2.x,
              y: vec.y - vec2.y,
              z: vec.z - vec2.z
          };
      case '*':
          return {
              x: vec.x * vec2.x,
              y: vec.y * vec2.y,
              z: vec.z * vec2.z
          };
      case 'x': //multiplication by number
          return {
              x: vec.x * vec2,
              y: vec.y * vec2,
              z: vec.z * vec2
          };
      case '/':
          return {
              x: vec.x / vec2.x,
              y: vec.y / vec2.y,
              z: vec.z / vec2.z
          };
      default:
          throw new Error("[Vector] Invalid operation type.");
  }
}; 
vector.to_array = function(vec)
{
    return [
        vec.x,
        vec.y,
        vec.z
    ];
};
//end of april's vector stuff
function extrapolate_tick(headpos, velocity, tick_amt)
{
    return vector.operate(headpos, vector.operate(velocity, tick_amt * Globals.TickInterval(), 'x'), "+"); //:flushed:
}
var has_teleported = false; //global variables are a great evil
var should_teleport = false;
var last_teleport_time = 0.0;
var js_items = ["Misc", "JAVASCRIPT", "Script Items"];
function on_move()
{
    if(UI.GetValue(js_items, "Teleport on peek") && UI.IsHotkeyActive(js_items, "Toggle key"))
    {
        var is_dt_enabled = UI.IsHotkeyActive("Rage", "Exploits", "Doubletap");
        var teleport_cooldown = UI.GetValue(js_items, "Teleport cooldown");
        if(Globals.Curtime() > last_teleport_time + teleport_cooldown)
        {
            if(is_dt_enabled && Exploit.GetCharge() < 0.95) //no point attempting to teleport if charge is too little
            {
                return;
            }
            if(should_teleport && !has_teleported)
            {
                if(is_dt_enabled)
                {
                    UI.ToggleHotkey("Rage", "Exploits", "Doubletap");
                    last_teleport_time = Globals.Curtime();
                    should_teleport = false;
                    has_teleported = true;
                    return;
                }
                else
                {
                    UI.ToggleHotkey("Rage", "Exploits", "Doubletap");
                    return;
                }
            }
            var local = Entity.GetLocalPlayer();
            var local_eyepos = Entity.GetEyePosition(local);
            var local_eyepos_vector = vector.new(local_eyepos);
            var local_velocity = Entity.GetProp(local, "CBasePlayer", "m_vecVelocity[0]");
            var local_velocity_vector = vector.new(local_velocity);
            var extrapolated_headpos = extrapolate_tick(local_eyepos_vector, local_velocity_vector, UI.GetValue(js_items, "Predicted ticks"));
            var enemies = Entity.GetEnemies();
            var teleport_mindamage = UI.GetValue(js_items, "Minimum damage to trigger teleport");
            if(!should_teleport && !has_teleported)
            {
                for(var i = 0; i < enemies.length; i++)
                {
                    if(Entity.IsValid(enemies[i]) && Entity.IsAlive(enemies[i]) && !Entity.IsDormant(enemies[i]))
                    {
                        var enemy_headpos = Entity.GetHitboxPosition(enemies[i], 0);
                        var enemy_pelvispos = Entity.GetHitboxPosition(enemies[i], 2); 
                        var trace = Trace.Bullet(local, enemies[i], vector.to_array(extrapolated_headpos), enemy_pelvispos);
                        var trace2 = Trace.Bullet(local, enemies[i], vector.to_array(extrapolated_headpos), enemy_headpos);
                        if(trace[1] > teleport_mindamage || trace2[1] > teleport_mindamage)
                        {
                            should_teleport = true;
                            break;
                        }
                    }
                }
            }
        }
        else if(has_teleported)
        {
            var should_attempt_to_reenable_dt = UI.GetValue(js_items, "Enable doubletap after teleport");
            var should_attempt_to_recharge = UI.GetValue(js_items, "Recharge after teleport");
            if(should_attempt_to_reenable_dt)
            {
                if(!is_dt_enabled)
                {
                    UI.ToggleHotkey("Rage", "Exploits", "Doubletap"); 
                }
                if(should_attempt_to_recharge)
                {
                     Exploit.Recharge(); 
                }
            }
             has_teleported = false;
        }
    }
}
function update_menu()
{
    var is_script_enabled = UI.GetValue(js_items, "Teleport on peek");
    UI.SetEnabled(js_items, "Toggle key", is_script_enabled);
    UI.SetEnabled(js_items, "Predicted ticks", is_script_enabled);
    UI.SetEnabled(js_items, "Teleport cooldown", is_script_enabled);
    UI.SetEnabled(js_items, "Minimum damage to trigger teleport", is_script_enabled);
    UI.SetEnabled(js_items, "Enable doubletap after teleport", is_script_enabled);
    var is_dt_shit_enabled = UI.GetValue(js_items, "Enable doubletap after teleport");
    UI.SetEnabled(js_items, "Recharge after teleport", is_script_enabled && is_dt_shit_enabled);
    UI.SetEnabled(js_items, "Render indicator", is_script_enabled);
}
function indicator()
{
    if(UI.GetValue(js_items, "Teleport on peek") && UI.GetValue(js_items, "Render indicator") && UI.IsHotkeyActive(js_items, "Toggle key"))
    {
        if(World.GetServerString() == "")
        {
            return;
        }
        if(!Entity.IsAlive(Entity.GetLocalPlayer()))
        {
            return;
        }
        var screen_size = Render.GetScreenSize();
        var teleport_cooldown = UI.GetValue(js_items, "Teleport cooldown");
        Render.String(30, screen_size[1] * 0.8, 1, "TP", (Globals.Curtime() > last_teleport_time + teleport_cooldown) ? [25, 255, 25, 200] : [255, 25, 25, 200], 4);
    }   
}
function reset_shit() //sometimes the script fails after restarting a game
{
    has_teleported = false;
    should_teleport = false;
    last_teleport_time = 0.0;
}
Cheat.RegisterCallback("Draw", "update_menu");
Cheat.RegisterCallback("CreateMove", "on_move");
Cheat.RegisterCallback("round_start", "reset_shit");
Cheat.RegisterCallback("Draw", "indicator");