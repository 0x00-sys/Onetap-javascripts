//Global Variables
const hitgroup = ['Head', 'Neck', 'Pelvis', 'Body', 'Thorax', 'Chest', 'Upper chest', 'Left thigh', 'Right thigh', 'Left calf', 'Right calf', 'Left foot', 'Right foot', 'Left hand', 'Right hand', 'Left upper arm', 'Left forearm', 'Right upper arm', 'Right forearm'];

const activeLogs = [];

const ragebotTarget = {};

UI.AddColorPicker("Hitlog Color");

//Check if color is unset
var color = UI.GetColor("MISC", "JAVASCRIPT", "Script Items", "Hitlog Color");
if (color[0] === 0 && color[1] === 0 && color[2] === 0 && color[3] === 0)
    UI.SetColor("MISC", "JAVASCRIPT", "Script Items", "Hitlog Color", [255, 0, 0, 255]);


/**
 * Description returns width of multi colored text lines
 * @param {array}   lines  (0 == color, 1 == text);
 */

function getMultiColorTextSize(lines) {
    var w = 0;
    for (var x = 0; x < lines.length; x++) {
        w += Render.TextSize(lines[x][1], 8)[0];
    }
    return w;
}

/**
 * Description draws Multiple text with different color
 * @param {int}      x      x cords
 * @param {number}   y      y cords
 * @param {array}   lines  (0 == color, 1 == text);
 */
function drawMultiColorText(x, y, lines) {
    var x_pad = 0;
    for (var i = 0; i < lines.length; i++) {
        const line = lines[i];
        const text = line[1];
        var color = line[0];
        if (typeof line[0] == "number") {
            color = UI.GetColor("MISC", "JAVASCRIPT", "Script Items", "Hitlog Color");
        }
        Render.String(x + x_pad, y, 0, text, color, 8);
        const w = Render.TextSize(text, 8)[0];
        x_pad += w;
    }
}


/**
 * Description Displays the log detail on screen
 * @param {int}      count      Index of the log.
 * @param {number}   layer      Log Details .
 */
function showLog(count, layer) {
    const text = layer.text;
    const w = getMultiColorTextSize(text);
    const expiry = Global.Realtime() < layer.delay;
    const y = 45 + (42 * (count - 1));
    const h = 12;
    const logW = (w < 150) ? 150 : (w + 15);
    const speed = 3;
    const layerSize = 15;

    layer.firstLayer = expiry ? Math.min(layer.firstLayer + logW * 0.025, logW + layerSize) : Math.max(layer.firstLayer - speed, 0);
    layer.secondLayer = expiry ? Math.min(layer.secondLayer + logW * 0.015, logW) : Math.max(layer.secondLayer - 2 * speed, 0);
    var color = UI.GetColor("MISC", "JAVASCRIPT", "Script Items", "Hitlog Color");
    Render.FilledRect(layer.firstLayer - layer.firstLayer, y, layer.firstLayer, h + 20, color);
    Render.FilledRect(layer.secondLayer - layer.secondLayer, y, layer.secondLayer, h + 20, [16, 0, 0, 255]);

    drawMultiColorText(layer.secondLayer - logW + 5, y + 3 + 6, text);
    activeLogs[count] = layer;
    if (layer.secondLayer === 0) {
        activeLogs.splice(count, 1);
    }
}

function onDraw() {
    for (var x = 0; x < activeLogs.length; x++) {
        showLog(x, activeLogs[x]);
    }
}

function onRagebotFire() {
    ragebotTarget[Entity.GetName(Event.GetInt("target_index"))] = {
        hitgroup: hitgroup[Event.GetInt("hitbox")],
        hc: Event.GetInt("hitchance"),
        safepoint: Event.GetInt("safepoint"),
        exploit: Event.GetInt("exploit")
    }
}

function onPlayerHurt() {
    const attacker = Entity.GetEntityFromUserID(Event.GetInt("attacker"));
    const victim = Entity.GetEntityFromUserID(Event.GetInt("userid"));
    const victimName = Entity.GetName(victim);
    if (attacker === Entity.GetLocalPlayer() && victim !== Entity.GetLocalPlayer()) {
        const target = ragebotTarget[victimName];
        if (target != null) {
            const hitMessage = [
                [[255, 255, 255, 255], "Hit "],
                [0, victimName.substring(0, 28)],
                [[255, 255, 255, 255], " in the "],
                [0, target.hitgroup],
                [[255, 255, 255, 255], " for "],
                [0, Event.GetInt("dmg_health").toString()],
                [[255, 255, 255, 255], " damage ("],
                [0, Event.GetInt("health") + " health remaining"],
                [[255, 255, 255, 255], ")"]
            ];
            activeLogs.push({
                    text: hitMessage,
                    delay: Global.Realtime() + 5,
                    firstLayer: 0,
                    secondLayer: 0
                }
            );
        }
    }
}


//Register Callbacks
Global.RegisterCallback("Draw", "onDraw");
Global.RegisterCallback("ragebot_fire", "onRagebotFire");
Global.RegisterCallback("player_hurt", "onPlayerHurt");