// Script Modified By Pinecone
// Original Script (https://onetap.su/threads/release-better-doubletap.13278/page-2#post-109254) by - https://onetap.su/members/edeen.9/
// Slider Title From https://onetap.su/members/12151/ - https://onetap.su/threads/release-customizable-jitter-probably-the-best-anti-aim-available.13157/
UI.AddSliderInt("Better DT", 1, 3);
UI.AddCheckbox("Better Doubletap");
function on_ragebot_fire() {
    if (!UI.GetValue("Misc", "JAVASCRIPT", "Script items", "Better Doubletap")){
        return;
    }
    player = Entity.GetLocalPlayer();
    weapon = Entity.GetWeapon(player);
    weaponName = Entity.GetName(weapon);
    Global.Print('Printing:');
    Global.Print(weaponName + '\n');
    if (!(weaponName.includes('g3sg1')|| weaponName.includes('scar')|| weaponName.includes('xm1014')|| weaponName.includes('desert')|| weaponName.includes('nova')|| weaponName.includes('sawed off'))) {
        Global.Print('Includes Blacklisted Gun... Setting fast recovery true' + '\n');
        UI.SetValue("Rage", "GENERAL", "Exploits", "Doubletap fast recovery", true);
        return;
    }
    ragebot_target_exploit = Event.GetInt("exploit");
    if (ragebot_target_exploit == 2) {
        UI.SetValue("Rage", "GENERAL", "Exploits", "Doubletap fast recovery", true);
    } else {
        UI.SetValue("Rage", "GENERAL", "Exploits", "Doubletap fast recovery", false);
    }  
}
Global.RegisterCallback("ragebot_fire", "on_ragebot_fire");