function Player(ent_index) {
    this.ent_index = ent_index;
    this.known_desync = 2; // 1 = normal 2 = opposite

}
function dist(v1 , v2){

  deltaX = v1[0] - v2[0];
  deltaY = v1[1] - v2[1];
  deltaZ = v1[2] - v2[2];

  distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);

  return distance;
}
function arrayRemove(arr, value) {

   return arr.filter(function(ele){
       return ele.ent_index != value;
   });

}

function find_enemy(index) {
  for(i = 0; i < enemies_list.length; i++)
  {
    if(enemies_list[i].ent_index == index)
      return enemies_list[i];
  }

  return Player(-1);

}

var other_weapons =
[
    "knife",
    "knife_t",
    "knife_karambit",
    "knife_m9_bayonet",
    "knife_survival_bowie",
    "knife_butterfly",
    "knife_flip",
    "knife_push",
    "knife_tactical",
    "knife_falchion",
    "knife_gut",
    "knife_ursus",
    "knife_gypsy_jackknife",
    "knife_stiletto",
    "knife_widowmaker",
    "knife_css",
    "knife_cord",
    "knife_canis",
    "knife_outdoor",
    "knife_skeleton",
    "bayonet",
    "hegrenade",
    "smokegrenade",
    "molotov",
    "incgrenade",
    "flashbang",
    "decoy",
    "taser"
];
function is_gun(weapon_name) {

    for(var i = 0; i < other_weapons.length; i++) {

        if(weapon_name == "weapon_" + other_weapons[i])
        {

            return false;

        }

    }

    return true;

}
function rotate(add, flip, start, degree, distance) {
    rad = degree * (Math.PI/180);
    ind0 = (flip ? Math.cos(rad) : Math.sin(rad)) * distance;
    ind1 = (flip ? Math.sin(rad) : Math.cos(rad)) * distance;
    start[0] += add ? ind0 : -ind0
    start[1] += add ? ind1 : -ind1;
    return start;
}

best_enemy = new Player(-1);
enemies_list = [];
function do_aa()
{
    if(!UI.GetValue( "Misc", "JAVASCRIPT", "Script items", "Anti aim lua" ))
        return;

   // UI.SetValue("Anti-Aim", "Fake angles", "Hide real angle" , true);

    local_index = Entity.GetLocalPlayer();
    closest_enemy = 0;

    if(!Entity.IsValid(local_index))
    {
      enemies_list = [];
      return;
    }

    enemies = Entity.GetEnemies();
    if(Entity.IsAlive(local_index) == false)
    {
      best_enemy = new Player(-1);
      return;
    }
    for ( i = 0; i < enemies.length; i++)
    {
        should_push = true;
        for(j = 0; j <enemies_list.length;j++)
        {
          if (enemies_list[j].ent_index == enemies[i])
            should_push = false;
        }
        if(should_push)
        {
          enemies_list.push(new Player(enemies[i]));
        }

    }

    local_eye_pos = Entity.GetEyePosition(local_index);
    closest = -1;
    for ( i = 0; i < enemies_list.length; i++)
    {
      if (Entity.IsAlive(enemies_list[i].ent_index) == true && Entity.IsValid(enemies_list[i].ent_index) == true && Entity.IsDormant(enemies_list[i].ent_index) == false)
      {
        enemy_eye_pos = Entity.GetEyePosition(enemies_list[i].ent_index);
        distance = dist(local_eye_pos , enemy_eye_pos);
        if(closest == -1)
        {
          closest = distance;
          closest_enemy = enemies_list[i];
        }
        else
        {
          if(distance < closest)
          {
            closest = distance;
            closest_enemy = enemies_list[i];
          }
        }

      }
    }
    if(Entity.IsAlive(best_enemy.ent_index) == true && Entity.IsValid(best_enemy.ent_index) == true && Entity.IsDormant(best_enemy.ent_index) == false)
      closest_enemy = best_enemy;
    else {
      best_enemy = new Player(-1)
    }
    if(closest == -1)
      return;
    var hotkey = UI.IsHotkeyActive( "Anti-Aim", "Fake angles", "inverter" );
    origin = Entity.GetRenderOrigin(Entity.GetLocalPlayer());
    originenemy = Entity.GetRenderOrigin(closest_enemy.ent_index);
    distleft = dist([origin[0] - 58 , origin[1] , origin[2]] , originenemy);
    distright = dist([origin[0] + 58 , origin[1] , origin[2]] , originenemy);

    hitbox_pos = Entity.GetHitboxPosition(closest_enemy.ent_index, 0);
    hitbox_pos2 = Entity.GetHitboxPosition(closest_enemy.ent_index, 5);
    result = Trace.Bullet(local_index, local_eye_pos, hitbox_pos);
    result2 = Trace.Bullet(local_index, local_eye_pos, hitbox_pos2);
    if(result[1] >= 1 || result2[1] >= 1)
    {
      if(closest_enemy.known_desync == 1) // if he thinks u have normal then you set it to opposite
      {
        if(UI.IsHotkeyActive( "Anti-Aim", "Fake angles", "inverter" ))
          UI.ToggleHotkey("Anti-Aim", "Fake angles", "inverter");
        //UI.SetValue("Anti-Aim", "Fake angles", "Fake desync" , false);
      }
      if(closest_enemy.known_desync == 2)
      {
        if(!UI.IsHotkeyActive( "Anti-Aim", "Fake angles", "inverter" ))
          UI.ToggleHotkey("Anti-Aim", "Fake angles", "inverter");
        //UI.SetValue("Anti-Aim", "Fake angles", "Fake desync" , true);

        // if he thinks you have opposite then you set it to normal
      }

    }
    else {


      if(closest_enemy.known_desync == 1) // if he thinks u have normal then you set it to opposite
      {
        if(distleft < distright)
        {
          //Global.Print("left")
          if(!hotkey)
            UI.ToggleHotkey("Anti-Aim", "Fake angles", "inverter");
        }
        if(distright < distleft) {
        //  Global.Print("right")
          if(hotkey)
            UI.ToggleHotkey("Anti-Aim", "Fake angles", "inverter");
        }

        //UI.SetValue("Anti-Aim", "Fake angles", "Fake desync" , false);
      }
      if(closest_enemy.known_desync == 2)
      {
        if(distleft < distright)
        {
          //Global.Print("left")
          if(hotkey)
            UI.ToggleHotkey("Anti-Aim", "Fake angles", "inverter");
        }
        if(distright < distleft) {
          //Global.Print("right")
          if(!hotkey)
            UI.ToggleHotkey("Anti-Aim", "Fake angles", "inverter");
        }
        //UI.SetValue("Anti-Aim", "Fake angles", "Fake desync" , true);

        // if he thinks you have opposite then you set it to normal
      }
  }


}

function GetScriptOption(name)

{

    var Value = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", name);

    return Value;

}



function radian(degree)

{

    return degree * Math.PI / 180.0;

}



function ExtendVector(vector, angle, extension)

{

    var radianAngle = radian(angle);

    return [extension * Math.cos(radianAngle) + vector[0], extension * Math.sin(radianAngle) + vector[1], vector[2]];

}



function VectorAdd(a, b)

{

    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

}



function VectorSubtract(a, b)

{

    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];

}



function VectorMultiply(a, b)

{

    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];

}



function VectorLength(x, y, z)

{

    return Math.sqrt(x * x + y * y + z * z);

}



function VectorNormalize(vec)

{

    var length = VectorLength(vec[0], vec[1], vec[2]);

    return [vec[0] / length, vec[1] / length, vec[2] / length];

}



function VectorDot(a, b)

{

    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

}



function VectorDistance(a, b)

{

    return VectorLength(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

}



function ClosestPointOnRay(target, rayStart, rayEnd)

{

    var to = VectorSubtract(target, rayStart);

    var dir = VectorSubtract(rayEnd, rayStart);

    var length = VectorLength(dir[0], dir[1], dir[2]);

    dir = VectorNormalize(dir);



    var rangeAlong = VectorDot(dir, to);

    if (rangeAlong < 0.0)

    {

        return rayStart;

    }

    if (rangeAlong > length)

    {

        return rayEnd;

    }

    return VectorAdd(rayStart, VectorMultiply(dir, [rangeAlong, rangeAlong, rangeAlong]));

}


var lastHitTime = 0.0;

var lastImpactTimes =

[

    0.0

];

var lastImpacts =

[

    [0.0, 0.0, 0.0]

];



function OnHurt()

{

    if (Entity.GetEntityFromUserID(Event.GetInt("userid")) != Entity.GetLocalPlayer()) return;

    var hitbox = Event.GetInt('hitgroup');

    entity = Entity.GetEntityFromUserID(Event.GetInt("attacker"));

    if (hitbox == 1 || hitbox == 6 || hitbox == 7)  //head, both toe

    {

        var curtime = Global.Curtime();
        lastHitTime = curtime;
        ent = find_enemy(entity);
        ent.ent_index = entity;
        ent.known_desync =  UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter") ? 1 : 2;
        best_enemy = ent;


    }

}



function OnBulletImpact()

{

    var curtime = Global.Curtime();

    if (Math.abs(lastHitTime - curtime) < 0.2) return;



    var entity = Entity.GetEntityFromUserID(Event.GetInt("userid"));

    var impact = [Event.GetFloat("x"), Event.GetFloat("y"), Event.GetFloat("z"), curtime];

    var source;

    if (Entity.IsValid(entity) && Entity.IsEnemy(entity))

    {

        if (!Entity.IsDormant(entity))

        {

            source = Entity.GetEyePosition(entity);

        }

        else if (Math.abs(lastImpactTimes[entity] - curtime) < 0.1)

        {

            source = lastImpacts[entity];

        }

        else

        {

            lastImpacts[entity] = impact;

            lastImpactTimes[entity] = curtime;

            return;

        }

        var local = Entity.GetLocalPlayer();

        var localEye = Entity.GetEyePosition(local);

        var localOrigin = Entity.GetProp(local, "CBaseEntity", "m_vecOrigin");

        var localBody = VectorMultiply(VectorAdd(localEye, localOrigin), [0.5, 0.5, 0.5]);



        var bodyVec = ClosestPointOnRay(localBody, source, impact);

        var bodyDist = VectorDistance(localBody, bodyVec);



        if (bodyDist < 256.0)       //he clearly shot at us!

        {
            //Global.Print("in range \n");
            var realAngle = Local.GetRealYaw();

            var fakeAngle = Local.GetFakeYaw();



            var headVec = ClosestPointOnRay(localEye, source, impact);

            var headDist = VectorDistance(localEye, headVec);

            var feetVec = ClosestPointOnRay(localOrigin, source, impact);

            var feetDist = VectorDistance(localOrigin, feetVec);



            var closestRayPoint;

            var realPos;

            var fakePos;



            if (bodyDist < headDist && bodyDist < feetDist)     //that's a pelvis

            {                                                   //pelvis direction = goalfeetyaw + 180

                closestRayPoint = bodyVec;

                realPos = ExtendVector(bodyVec, realAngle + 180.0, 10.0);

                fakePos = ExtendVector(bodyVec, fakeAngle + 180.0, 10.0);

            }

            else if (feetDist < headDist)                       //ow my toe

            {                                                   //toe direction = goalfeetyaw -30 +- 90

                closestRayPoint = feetVec;

                var realPos1 = ExtendVector(bodyVec, realAngle - 30.0 + 90.0, 10.0);

                var realPos2 = ExtendVector(bodyVec, realAngle - 30.0 - 90.0, 10.0);

                var fakePos1 = ExtendVector(bodyVec, fakeAngle - 30.0 + 90.0, 10.0);

                var fakePos2 = ExtendVector(bodyVec, fakeAngle - 30.0 - 90.0, 10.0);

                if (VectorDistance(feetVec, realPos1) < VectorDistance(feetVec, realPos2))

                {

                    realPos = realPos1;

                }

                else

                {

                    realPos = realPos2;

                }

                if (VectorDistance(feetVec, fakePos1) < VectorDistance(feetVec, fakePos2))

                {

                    fakePos = fakePos1;

                }

                else

                {

                    fakePos = fakePos2;

                }

            }

            else                                                //ow my head i feel like i slept for 2 days

            {

                closestRayPoint = headVec;

                realPos = ExtendVector(bodyVec, realAngle, 10.0);

                fakePos = ExtendVector(bodyVec, fakeAngle, 10.0);

            }


              lastHitTime = curtime;
            //  Global.Print("swap ")
              ent = find_enemy(entity);
              ent.ent_index = entity;
              ent.known_desync =  UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter") ? 1 : 2;
              best_enemy = ent;



        }



        lastImpacts[entity] = impact;

        lastImpactTimes[entity] = curtime;

    }

}




function on_player_disconnect(){
  if(!UI.GetValue( "Misc", "JAVASCRIPT", "Script items", "Anti aim lua" ))
    return;
	var uid = Event.GetInt("userid");
	arrayRemove(enemies_list ,Entity.GetEntityFromUserID(uid) );

}
function Main()
{
  UI.AddCheckbox( "Anti aim lua" );
//  Cheat.RegisterCallback("player_hurt", "OnHurt");
  Cheat.RegisterCallback("bullet_impact", "OnBulletImpact");
	Global.RegisterCallback("Draw", "do_aa")
  Global.RegisterCallback("player_disconnect", "on_player_disconnect")
//	Global.RegisterCallback("CreateMove", "onCreateMove")
//	Global.RegisterCallback("player_connect_full", "player_connect")
}
Main();
