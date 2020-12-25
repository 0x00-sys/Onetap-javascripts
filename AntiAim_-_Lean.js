var screen_size = Global.GetScreenSize();
var isInverted;
var invertedLean;
var bodyLean;

function setBodyLean() {

    if (!UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Custom body lean"))
        return;

    UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", isInverted ? invertedLean : bodyLean);
}

function onCreateMove() {

    isInverted = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter");
    invertedLean = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Inverted body lean");
    bodyLean = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Body lean");

    setBodyLean();
}

function Main() {

    UI.AddCheckbox("Custom body lean");
    UI.AddSliderInt("Inverted body lean", -180, 180);
    UI.AddSliderInt("Body lean", -180, 180);

    // callbacks
    Global.RegisterCallback( "CreateMove", "onCreateMove" );
}

Main();