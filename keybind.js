
function toggleESP()
{
    var isKeyActive = UI.IsHotkeyActive( "Misc", "ESP" );
	UI.SetValue( "Visual", "ENEMIES", "ESP", "Box", isKeyActive);
	UI.SetValue( "Visual", "ENEMIES", "ESP", "Name", isKeyActive);
	UI.SetValue( "Visual", "ENEMIES", "ESP", "Health", isKeyActive);
	UI.SetValue( "Visual", "ENEMIES", "ESP", "Dormant", isKeyActive);
	UI.SetValue( "Visual", "ENEMIES", "ESP", "Flags", "Money", isKeyActive);
	UI.SetValue( "Visual", "FRIENDLIES", "Chams", "Override", !isKeyActive);
	
	
}
UI.AddHotkey( "ESP" );



Global.RegisterCallback("CreateMove", "toggleESP");