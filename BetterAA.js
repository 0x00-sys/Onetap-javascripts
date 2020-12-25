UI.AddSliderFloat("LBY offset", -180, 180)
UI.AddSliderFloat("Real offset", -180, 180)
UI.AddSliderFloat("Fake offset", -180, 180)


function main(){
    var LBYOffset = UI.GetValue ("Misc", "JAVASCRIPT", "Script Items", "LBY offset")
    var RealOffset = UI.GetValue ("Misc", "JAVASCRIPT", "Script Items", "Real offset")
    var FakeOffset = UI.GetValue ("Misc", "JAVASCRIPT", "Script Items", "Fake offset")

    var inverted = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter")

    if(inverted){
        AntiAim.SetOverride(1);
        AntiAim.SetFakeOffset(-FakeOffset);
        AntiAim.SetRealOffset(-RealOffset);
        AntiAim.SetLBYOffset(-LBYOffset);
    } else {
        AntiAim.SetOverride(1);
        AntiAim.SetFakeOffset(FakeOffset);
        AntiAim.SetRealOffset(RealOffset);
        AntiAim.SetLBYOffset(LBYOffset);
    }


}

Cheat.RegisterCallback("CreateMove", "main");