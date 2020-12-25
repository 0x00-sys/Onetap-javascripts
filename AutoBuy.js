var run = false;
var estimate = 0;
var firstBuy = 0;
var alias = [
    ["awp"],
    ["ssg08"],
    ["scar20", "g3sg1"]
]

function roundEnded() {
    run = true;
    estimate = Globals.Curtime()+Convar.GetInt("mp_round_restart_delay");
    firstBuy = 0;
}

function purchase(index) {
    alias[index].forEach(function(v) { Cheat.ExecuteCommand("buy "+v); })
    run = false;
}

function onDraw() {
    run && Globals.Curtime()+(Local.Latency()/1000) >= estimate && purchase(UI.GetValue.apply(this, dropdown));
}

function purchased() {
    if (firstBuy == 0) firstBuy = Globals.Curtime()-estimate;
    if (!Entity.GetEntityFromUserID(Event.GetInt("userid")) || firstBuy == -1) return;

    Cheat.Print("The first item of the round was purchased at " + firstBuy + "s, you purchased at " + (Globals.Curtime()-estimate) + "s.\n");
    firstBuy = -1;
}

var dropdown = UI.AddDropdown("Fastest Autobuy", ["AWP", "Scout", "Auto"]);

Cheat.RegisterCallback("round_end", "roundEnded");
Cheat.RegisterCallback("Draw", "onDraw");
Cheat.RegisterCallback("item_purchase", "purchased");