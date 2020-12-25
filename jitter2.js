var binlib = {};

function dictLength(dict) {
    var count = 0;
    for (_ in dict) {
        count++;
    }
    return count;
}

function createDropdown(name, values, multi) {
    UI[multi ? "AddMultiDropdown" : "AddDropdown"](name, values);
   
    binlib[name] = {"multi": multi, "values": {}};

    multi && values.reverse();

    var i = 0; for (value in values) {
        var index = multi ? (1 << (values.length-(i+1))) : i;
        binlib[name].values[index] = values[value];
        i++;
    }
}

function fetchDropdown(name) {
    var selection = (name ? [] : {})
    var bin = get(["Script Items", name]);

    !name && function() {for (dropdown in binlib) selection[dropdown] = fetchDropdown(dropdown) }();

    if (!name) return;
    !binlib[name].multi && bin == 0 && selection.push(binlib[name].values[0]) && function() { return selection; }();
    for (var i = dictLength(binlib[name].values)-1; i >= 0; i--) {
        if (!binlib[name].multi && i == 0) continue;

        var index = binlib[name].multi ? (1 << i) : i;
        if (bin-index >= 0) {
            bin -= (index);
            selection.push(binlib[name].values[index]);
        }
    }

    return selection;
}

function get(item) {
    return UI.GetValue.apply(this, item);
}

function set(path, val) {
    return UI.SetValue(path, val);
}

function overflow(num, min, max) {
    var v = num > max ? min+(num-max) : num < min ? max-(min-num) : num
    if (v > max || v < min) v = overflow(v, min, max);
    return v;
}

var settings = {
    primary: [250, 161, 255, 255],
    secondary: [255, 255, 255, 255],
    font: 0,

    style: 0, // 0 = Constrained, 1 = Opposites
    dir: 0, // 0 = Left, 1 = Back, 2 = Right
    cycle: false,
	iteration: 0,
	rot: 0,

    ywidth: 0,
	yrandom: 0,
	jenabled: false,
	jwidth: 0,
	jrandom: 0,
	jnth: 1,
    spin: 0,

    vTotal: 0,
    vArrows: false,
    vCycle: false,
    vInverted: false,
    vWASD: false,
	vDeg: false,
	
	frequency: 0,

	offset: 0,
	lbyenabled: false,
	lbyexclude: [],
	lbyinclude: [],
	lbylast: -1,
	lbynth: 1,

    iTotal: 0,
    iCycle: false,
    iTaken: false,
    iDealt: false,
    iShot: false,
    iStep: false,
    cyclenth: 1
}, ui = {};

function setupUI() {
    UI.AddLabel("====== Rory's Jitter v2.1 ======");
    UI.AddLabel("---------------- Visuals ----------------");
    ui.primary = UI.AddColorPicker("Primary Color");
    ui.secondary = UI.AddColorPicker("Secondary Color");
    createDropdown("Visuals", ["Arrows", "Cycle", "Inverted", "WASD", "Degree"], true);
    ui.font = UI.AddDropdown("Font", ["Normal", "Small", "Big"]);
    ui.bold = UI.AddCheckbox("Bold");
    UI.AddLabel("----------------- Jitter -----------------");
    createDropdown("Style", ["Constrained", "Opposites"], false);
    ui.left = UI.AddHotkey("Face Left");
    ui.back = UI.AddHotkey("Face Back");
    ui.right = UI.AddHotkey("Face Right");
    ui.ywidth = UI.AddSliderInt("Yaw Width", 0, 180);
	ui.yrandom = UI.AddSliderInt("Yaw Randomize", 0, 180);
	ui.spin = UI.AddSliderInt("Spin Speed", 0, 25);
	ui.jenabled = UI.AddCheckbox("Offset Jitter");
	ui.jwidth = UI.AddSliderInt("Jitter Width", 0, 180);
	ui.jrandom = UI.AddSliderInt("Jitter Randomize", 0, 180);
	ui.jnth = UI.AddSliderInt("Offset Jitter Every nth Cycle", 1, 300);
	UI.AddLabel("----------------- Misc -----------------");
	ui.cycle = UI.AddSliderInt("Cycle Frequency", 1, 100);
	UI.AddLabel("---------------- Angles ----------------");
	ui.offset = UI.AddSliderInt("Yaw Offset", -180, 180);
	ui.lbyenabled = UI.AddCheckbox("LBY Jitter");
	createDropdown("Exclude LBY Modes", ["Normal", "Opposite", "Sway"], true);
	ui.lbynth = UI.AddSliderInt("Jitter LBY Every nth Cycle", 1, 300);
    UI.AddLabel("--------------- Inversion ---------------");
    createDropdown("Auto-Invert Flags", ["Cycle", "Damage Taken", "Damage Dealt", "On Shot", "On Footstep"], true);
    ui.cyclenth = UI.AddSliderInt("Invert Every nth Cycle", 1, 200);
    UI.AddLabel("=======================");

    UI.SetColor("Script Items", "Primary Color", settings.primary);
    UI.SetColor("Script Items", "Secondary Color", settings.secondary);
    UI.SetEnabled("Script Items", "Font", false);
	UI.SetEnabled("Script Items", "Bold", false);
	UI.SetEnabled("Script Items", "Spin Speed", false);
	UI.SetEnabled("Script Items", "Jitter Width", false);
	UI.SetEnabled("Script Items", "Jitter Randomize", false);
	UI.SetEnabled("Script Items", "Offset Jitter Every nth Cycle", false);
	set(ui.offset, 0);
	UI.SetEnabled("Script Items", "Exclude LBY Modes", false);
	UI.SetEnabled("Script Items", "Jitter LBY Every nth Cycle", false);
    UI.SetEnabled("Script Items", "Invert Every nth Cycle", false);
}

function info() {
    Render.String(0, 400, 0, "Rory's Jitter Info", UI.GetColor("Script Items", "Primary Color", settings.primary), 1);
    Render.String(0, 412, 0, "- In able to use jitter offsetting you must enable the built in jitter under the AA tab,", [255, 255, 255, 255], 1);
	Render.String(0, 424, 0, "  it can be binded if you only want it to jitter when binded, or you can have it set to always.", [255, 255, 255, 255], 1);
	Render.String(0, 436, 0, "- In able to use the Auto-Inverter you must have Invert in the AA section binded, and set to toggle.", [255, 255, 255, 255], 1);
	Render.String(0, 448, 0, "- The built in Manual AA overrides this jitter script, the jitter will only activate when no direction is active.", [255, 255, 255, 255], 1);
	Render.String(0, 472, 0, "Rory's Discord Server: discord.gg/nxRxxPk", UI.GetColor("Script Items", "Primary Color", settings.primary), 1);
}

function menuLogic() {
	if (!UI.IsMenuOpen()) return;
	
	var visualFlags = fetchDropdown("Visuals");
    settings.vTotal = visualFlags.length;
    settings.vArrows = visualFlags.indexOf("Arrows") > -1;
    settings.vCycle = visualFlags.indexOf("Cycle") > -1;
    settings.vInverted = visualFlags.indexOf("Inverted") > -1;
    settings.vWASD = visualFlags.indexOf("WASD") > -1;
	settings.vDeg = visualFlags.indexOf("Degree") > -1;

    settings.primary = UI.GetColor.apply(this, ui.primary);
    settings.secondary = UI.GetColor.apply(this, ui.secondary);
    settings.font = get(["Script Items", "Font"]) == 2 ? 4 : get(["Script Items", "Font"])*2 + get(["Script Items", "Bold"]);

    settings.style = fetchDropdown("Style").indexOf("Constrained") > -1 ? 0 : 1;
    settings.ywidth = get(ui.ywidth);
	settings.yrandom = get(ui.yrandom);
    settings.jenabled = get(ui.jenabled);
	settings.spin = get(ui.spin);
	settings.jwidth = get(ui.jwidth);
	settings.jrandom = get(ui.jrandom);
	settings.jnth = get(ui.jnth);
	
	settings.frequency = get(ui.cycle);

	settings.offset = get(ui.offset);
	settings.lbyenabled = get(ui.lbyenabled);
	var lby = fetchDropdown("Exclude LBY Modes");
	if (settings.lbyexclude.length == 2 && lby.length == 3) {
		var newVal = 0;
		for (v in binlib["Exclude LBY Modes"].values) {
			if (settings.lbyexclude.indexOf(binlib["Exclude LBY Modes"].values[v]) > -1) {
				newVal += parseInt(v);
			}
		}
		UI.SetValue("Exclude LBY Modes", newVal);
	} else {
		settings.lbyexclude = lby;
	}
	var include = [];
	for (v in binlib["Exclude LBY Modes"].values) {
		if (settings.lbyexclude.indexOf(binlib["Exclude LBY Modes"].values[v]) == -1) include.push(v >> 1);
	}
	settings.lbyinclude = include;
	settings.lbynth = get(ui.lbynth);

	var invertFlags = fetchDropdown("Auto-Invert Flags");
    settings.iTotal = invertFlags.length;
    settings.iCycle = invertFlags.indexOf("Cycle") > -1;
    settings.iTaken = invertFlags.indexOf("Damage Taken") > -1;
    settings.iDealt = invertFlags.indexOf("Damage Dealt") > -1;
    settings.iShot = invertFlags.indexOf("On Shot") > -1;
    settings.iStep = invertFlags.indexOf("On Footstep") > -1;
    settings.cyclenth = get(ui.cyclenth);

    var text = visualFlags.length-(settings.vArrows ? 1 : 0) > 0;
    UI.SetEnabled("Script Items", "Font", text);
    UI.SetEnabled("Script Items", "Bold", text && settings.font != 4);

    var constrained = settings.style == 0;
    UI.SetEnabled("Script Items", "Face Left", constrained);
    UI.SetEnabled("Script Items", "Face Back", constrained);
    UI.SetEnabled("Script Items", "Face Right", constrained);
    UI.SetEnabled("Script Items", "Yaw Width", constrained);
	UI.SetEnabled("Script Items", "Yaw Randomize", constrained);
	UI.SetEnabled("Script Items", "Spin Speed", !constrained);
	UI.SetEnabled("Script Items", "Jitter Width", get(ui.jenabled));
	UI.SetEnabled("Script Items", "Jitter Randomize", get(ui.jenabled));
	UI.SetEnabled("Script Items", "Offset Jitter Every nth Cycle", get(ui.jenabled));

	UI.SetEnabled("Script Items", "Exclude LBY Modes", get(ui.lbyenabled));
	UI.SetEnabled("Script Items", "Jitter LBY Every nth Cycle", get(ui.lbyenabled));

    UI.SetEnabled("Script Items", "Invert Every nth Cycle", settings.iCycle);

    info();
}

function visuals() {
    if (settings.vTotal == 0 || !Entity.IsAlive(Entity.GetLocalPlayer())) return;

    var x = Global.GetScreenSize()[0]/2, y = Global.GetScreenSize()[1]/2;
    var fOffset = Render.TextSize("P", settings.font)[1]*.7;

    if (settings.vArrows) {
        var colors = [settings.secondary, settings.secondary, settings.secondary]
        if (settings.style == 0) {
            colors[settings.dir] = settings.primary;
        } else {
            if (UI.IsHotkeyActive("Fake angles", "Inverter")) colors[0] = settings.primary;
            else colors[2] = settings.primary;
        }

        Render.String(x-50, y-20, 1, "<", colors[0], 4);
        Render.String(x, y+30, 1, settings.style == 0 ? "v" : "", colors[1], 4);
        Render.String(x+50, y-20, 1, ">", colors[2], 4);

        y += settings.style == 0 ? 60 : 30;
    }

    if (settings.vCycle) {
        Render.String(x, y, 0, "CYCLE", settings.cycle ? settings.primary : settings.secondary, settings.font);

        y += fOffset;
    }

    if (settings.vInverted) {
        Render.String(x, y, 0, "INVERTED", UI.IsHotkeyActive("Fake angles", "Inverter") ? settings.primary : settings.secondary, settings.font);

        y += fOffset;
    }

    if (settings.vWASD) {
        Render.String(x, y, 0, "W", Global.IsKeyPressed(0x57) ? settings.primary : settings.secondary, settings.font);
        Render.String(x+Render.TextSize("W", settings.font)[0], y, 0, "A", Global.IsKeyPressed(0x41) ? settings.primary : settings.secondary, settings.font);
        Render.String(x+Render.TextSize("WA", settings.font)[0], y, 0, "S", Global.IsKeyPressed(0x53) ? settings.primary : settings.secondary, settings.font);
        Render.String(x+Render.TextSize("WAS", settings.font)[0], y, 0, "D", Global.IsKeyPressed(0x44) ? settings.primary : settings.secondary, settings.font);

        y += fOffset;
    }

    if (settings.vDeg) {
        Render.String(x, y, 0, "DEG: " + get(["Yaw offset"]), settings.secondary, settings.font);
    }
}

function jitter() {
    settings.iteration++;
    if (UI.IsHotkeyActive("Script Items", "Face Left")) settings.dir = 0;
    else if (UI.IsHotkeyActive("Script Items", "Face Back")) settings.dir = 1;
	else if (UI.IsHotkeyActive("Script Items", "Face Right")) settings.dir = 2;
	
    if (!Entity.IsAlive(Entity.GetLocalPlayer()) || settings.iteration%(settings.frequency+1) != 0) return;
    settings.cycle = !settings.cycle;

    if (settings.style == 0) {
        var ang = 0;

        if (settings.dir == 0) ang = settings.cycle ? -90 : settings.ywidth-90;
        else if (settings.dir == 1) ang = settings.cycle ? settings.ywidth/2 : -(settings.ywidth/2);
        else if (settings.dir == 2) ang = settings.cycle ? 90 : 90-settings.ywidth;

		var offset = settings.offset;
		if (offset != 0) offset = offset > 0 ? overflow(offset, 0, 180) : overflow(offset, -180, 0);

		set("Yaw offset", ang+(~~(Math.random() * settings.yrandom)-settings.yrandom)+offset);
    } else {
        settings.rot += settings.spin;
		if (settings.spin == 0) settings.rot = 0;
		
        if (UI.IsHotkeyActive("Fake angles", "Inverter")) UI.SetValue("Yaw offset", settings.cycle ? overflow(180+settings.rot+settings.offset, 0, 180)-180 : overflow(180+settings.rot+settings.offset, 0, 180));
        else UI.SetValue("Yaw offset", settings.cycle ? 180-overflow(180+settings.rot+settings.offset, 0, 180) : -overflow(180+settings.rot+settings.offset, 0, 180));
	}

	if (settings.jenabled && settings.iteration%settings.jnth == 0) {
		set("Jitter offset", (settings.cycle ? settings.jwidth : -settings.jwidth)+(~~(Math.random() * settings.jrandom)-settings.jrandom));
	}
	
	if (settings.lbyenabled && settings.iteration%settings.lbynth == 0) {
		settings.lbylast = overflow(settings.lbylast+1, -1, settings.lbyinclude.length-1);
		UI.SetValue("LBY mode", settings.lbyinclude[settings.lbylast]);
	}

	if (settings.iCycle && settings.iteration%settings.cyclenth == 0) UI.ToggleHotkey("Fake angles", "Inverter");
}

function damage() {
    if ((!settings.iTaken && !settings.iDealt) || !Entity.IsAlive(Entity.GetLocalPlayer())) return;
    var vic = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    var atck = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
    var locp = Entity.GetLocalPlayer()

    if ((vic != locp && atck != locp) || vic == atck) return;

    if (settings.iTaken && vic == locp) UI.ToggleHotkey("Fake angles", "Inverter");
    if (settings.iDealt && atck == locp) UI.ToggleHotkey("Fake angles", "Inverter");
}

function shot() {
    if (settings.iShot) UI.ToggleHotkey("Fake angles", "Inverter");
}

function step() {
    if (settings.iStep && Entity.GetEntityFromUserID(Event.GetInt("userid")) == Entity.GetLocalPlayer()) UI.ToggleHotkey("Fake angles", "Inverter");
}

function main() {
    setupUI();
    Global.RegisterCallback("Draw", "menuLogic");
    Global.RegisterCallback("Draw", "visuals");
    Global.RegisterCallback("CreateMove", "jitter");
    Global.RegisterCallback("player_hurt", "damage");
    Global.RegisterCallback("ragebot_fire", "shot");
    Global.RegisterCallback("player_footstep", "step");
} main();