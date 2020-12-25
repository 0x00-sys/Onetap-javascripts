UI.AddCheckbox("Premade Settings");
UI.AddCheckbox("Switch");
UI.AddSliderInt("Switch Interval", 1, 100);
UI.AddLabel("------------ While moving ------------");
UI.AddCheckbox("Body Lean moving");
UI.AddSliderInt("Inverted body lean", -180, 180);
UI.AddSliderInt("Body lean", -180, 180);
UI.AddLabel("----------- Main settings -----------");
UI.AddCheckbox("AA Settings"); //Master switch
UI.AddDropdown("Builder setting", ["Right", "Left"]);
UI.AddSliderInt("Real (R)", -180,180);
UI.AddSliderInt("Fake (R)", -60,60);
UI.AddSliderInt("Real yaw offset (R)", 0,60);
UI.AddSliderInt("Fake yaw offset (R)", 0,60);
UI.AddCheckbox("Use eye yaw for LBY (R)");
UI.AddSliderInt("Real (L)", -180,180);
UI.AddSliderInt("Fake (L)", -60,60);
UI.AddSliderInt("Real yaw offset (L)", 0,60);
UI.AddSliderInt("Fake yaw offset (L)", 0,60);
UI.AddHotkey("Invert");


var isInverted;
var invertedLean;
var bodyLean;

var screen_size = Global.GetScreenSize();
var isInverted;

var LastSwitch = 0;
////////////////////////////////////////////////////////////////////////////////////
function setBodyLean() {

    if (!UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Body Lean moving"))
        return;

    UI.SetValue("Anti-Aim", "Rage Anti-Aim", "Yaw offset", isInverted ? invertedLean : bodyLean);
}
function onCreateMove() {

    isInverted = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter");
    invertedLean = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Inverted body lean");
    bodyLean = UI.GetValue("Misc", "JAVASCRIPT", "Script Items", "Body lean");

    setBodyLean();
}
//////////////////////////////////////////////////////////////////////////////////////
var scriptitems = ["Misc", "JAVASCRIPT", "Script Items"];
function menu_cb() {
    var enabled = UI.GetValue(scriptitems, "AA Settings");
    var r_enabled = UI.GetValue(scriptitems, "Builder setting") == 0 && enabled;
    UI.SetEnabled(scriptitems, "Real (R)", r_enabled);
    UI.SetEnabled(scriptitems, "Fake (R)", r_enabled);
    UI.SetEnabled(scriptitems, "Real yaw offset (R)", r_enabled);
    UI.SetEnabled(scriptitems, "Fake yaw offset (R)", r_enabled);
    UI.SetEnabled(scriptitems, "Use eye yaw for LBY (R)", r_enabled);
  
    var l_enabled = UI.GetValue(scriptitems, "Builder setting") == 1 && enabled;
    UI.SetEnabled(scriptitems, "Real (L)", l_enabled);
    UI.SetEnabled(scriptitems, "Fake (L)", l_enabled);
    UI.SetEnabled(scriptitems, "Real yaw offset (L)", l_enabled);
    UI.SetEnabled(scriptitems, "Fake yaw offset (L)", l_enabled);
    UI.SetEnabled(scriptitems, "Use eye yaw for LBY (L)", l_enabled);
  
    UI.SetEnabled(scriptitems, "Builder setting", enabled);
    UI.SetEnabled(scriptitems, "Invert", enabled);
}
function draw_custom_aa() {
    if (UI.IsMenuOpen()) {menu_cb();}
}
function aa_sys() {
    var enabled = UI.GetValue(scriptitems, "AA Settings");
    enabled ? AntiAim.SetOverride(1) : AntiAim.SetOverride(0);
  
    var m_side;//merp
    var m_invert = UI.IsHotkeyActive(scriptitems, "Invert");
    if (m_invert) {
        m_side = " (L)";
    } else {
        m_side = " (R)";
    }
    var m_fake = UI.GetValue(scriptitems, "Fake" + m_side);
    var m_real = UI.GetValue(scriptitems, "Real" + m_side);
    var m_use_ey = UI.GetValue(scriptitems, "Use eye yaw for LBY" + m_side);
    var m_ryaw_offset_val = UI.GetValue(scriptitems, "Real yaw offset" + m_side);
    var m_fyaw_offset_val = UI.GetValue(scriptitems, "Fake yaw offset" + m_side);
    setAntiaim(m_real, m_fake, m_use_ey, m_ryaw_offset_val, m_fyaw_offset_val);
}

function setAntiaim(caa_real, caa_fake, caa_use_ey, caa_ryaw_offset_val, caa_fyaw_offset_val) {
  
    var caa_realyaw_offset = caa_use_ey ? caa_ryaw_offset_val : (caa_ryaw_offset_val * 2);
  	
    AntiAim.SetFakeOffset(caa_real);
  
    if (caa_fake > 0) {
        AntiAim.SetRealOffset(caa_real - caa_fake + caa_realyaw_offset);
        if (caa_fake < caa_fyaw_offset_val) {
            caa_fyaw_offset_val = caa_fake;
        }//Clamp our fake yaw
        caa_use_ey ? AntiAim.SetLBYOffset(caa_real - caa_fyaw_offset_val) : AntiAim.SetLBYOffset(caa_real + caa_fake - caa_fyaw_offset_val * 2);
    } else {
        if (caa_fake > caa_fyaw_offset_val) {
            caa_fyaw_offset_val = caa_fake;
        }//Clamp our fake yaw (todo update this and above one to be more dynamic / working better x.x)
        AntiAim.SetRealOffset(caa_real - caa_fake - caa_realyaw_offset);
        caa_use_ey ? AntiAim.SetLBYOffset(caa_real + caa_fyaw_offset_val) : AntiAim.SetLBYOffset(caa_real + caa_fake + caa_fyaw_offset_val * 2);
    }
}

function getVelocity(index)
{
    var velocity = Entity.GetProp( index, "CBasePlayer", "m_vecVelocity[0]" );
    return Math.sqrt( velocity[0] * velocity[0] + velocity[1] * velocity[1] );

}

function main_switch() {
	var enabled = UI.GetValue(scriptitems, "Switch");
    var switched = UI.GetValue(scriptitems, "AA Settings");
    //Cheat.Print("Alive:  " + Entity.IsAlive(Entity.GetLocalPlayer()) + "\n")
    //Cheat.Print("Veloc:  " + getVelocity(Entity.GetLocalPlayer()) + "\n")

    if (enabled) {

        if (Globals.Tickcount() - LastSwitch > UI.GetValue(scriptitems, "Switch Interval") && getVelocity(Entity.GetLocalPlayer()) < 2) {
                
            UI.SetValue(scriptitems, "AA Settings", !switched)
            UI.SetValue(scriptitems, "Body Lean moving", 0)
            LastSwitch = Globals.Tickcount();

        }

        if (getVelocity(Entity.GetLocalPlayer()) > 2) {
            UI.SetValue(scriptitems, "AA Settings", 0)
            UI.SetValue(scriptitems, "Body Lean moving", 1)
        }
    }
    
}

function getValue() {
	var yeyeet = UI.IsHotkeyActive("Anti-Aim", "Fake angles", "Inverter"); { 
		if (yeyeet == 0) { 
			//Cheat.Print("Right" + "\n");
			Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +91, 1,"RIGHT", [ 255, 255, 255, 255 ], 1);
		}	
	}
	{ 
		if (yeyeet == 1) {
			//Cheat.Print("Left" + "\n");
			Render.String(screen_size[0] /2 + 1, screen_size[1] /2 +91,	1,"LEFT", [ 255, 255, 255, 255 ], 1);
		}
	}
}

function buttonlol() {
	var Settinglol = UI.GetValue(scriptitems, "Premade Settings");
	
	if (Settinglol== 1) {
		fuckinghellwhatisthisname();
		UI.SetValue(scriptitems, "Premade Settings", 0)		
	}
}

function fuckinghellwhatisthisname() {
	UI.SetValue("Real (R)", -14);
	UI.SetValue("Fake (R)", -16);
	UI.SetValue("Real yaw offset (R)", 18);
	UI.SetValue("Fake yaw offset (R)", 26);
	UI.SetValue("Real (L)", -19);
	UI.SetValue("Fake (L)", -52);
	UI.SetValue("Real yaw offset (L)", 17);
	UI.SetValue("Fake yaw offset (L)", 12);
}

Cheat.RegisterCallback("Draw","buttonlol")
Global.RegisterCallback( "CreateMove", "onCreateMove" );
Cheat.RegisterCallback("Draw","getValue")
Cheat.RegisterCallback("Draw","draw_custom_aa");
Cheat.RegisterCallback("Draw","main_switch");
Cheat.RegisterCallback("CreateMove","aa_sys");