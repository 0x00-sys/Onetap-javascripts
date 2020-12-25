notpeeked = 0
peeked = 0

function dtonpeek () {
    if (Ragebot.GetTargets() == "" && notpeeked == 0) {
        UI.SetValue( ["Rage", "Exploits", "General", "Double tap"], 1)
    }
    else if (Ragebot.GetTargets() != "") {
        notpeeked = 1
        peeked = Globals.Realtime()
    }

    if (notpeeked == 1) {
        UI.SetValue( ["Rage", "Exploits", "General", "Double tap"], 0)
        if (peeked + 1 < Globals.Realtime()) {
            notpeeked = 0
        }
    }
}

Cheat.RegisterCallback("CreateMove", "dtonpeek")
