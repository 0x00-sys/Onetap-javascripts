UI.AddSubTab( ["Misc.", "SUBTAB_MGR"], "Killsay");

//var killsay = ["Misc.", "Killsay", "SHEET_MGR", "Killsay"]

UI.AddCheckbox( ["Misc.", "Killsay", "SHEET_MGR", "Killsay"], "Enable Killsay");
UI.AddCheckbox( ["Misc.", "Killsay", "SHEET_MGR", "Killsay"], "Use Enemy Name");
UI.AddTextbox( ["Misc.", "Killsay", "SHEET_MGR", "Killsay"], "Say(s)");
UI.AddSliderInt( ["Misc.", "Killsay", "SHEET_MGR", "Killsay"], "Killsay Delay", 0, 10);
UI.AddCheckbox( ["Misc.", "Killsay", "SHEET_MGR", "Killsay"], "Enable Killsound");
UI.AddTextbox( ["Misc.", "Killsay", "SHEET_MGR", "Killsay"], "Filename(s)");
UI.AddCheckbox( ["Misc.", "Killsay", "SHEET_MGR", "Killsay"], "Hear Killsound");
UI.AddSliderFloat( ["Misc.", "Killsay", "SHEET_MGR", "Killsay"], "Play Length", 0.0, 10.0);
UI.AddSliderInt( ["Misc.", "Killsay", "SHEET_MGR", "Killsay"], "Note: Set length to longest sound", 0, 0);

// Functions to return killsays and killsounds
function rand_chat() {
    string = UI.GetString( ["Misc.", "Killsay", "SHEET_MGR", "Killsay", "Say(s)"]);
    killsays = string.split(", ");
    return killsays[randint(0, killsays.length)];
}

function rand_sound() {
    string = UI.GetString( ["Misc.", "Killsay", "SHEET_MGR", "Killsay", "Filename(s)"]);
    sounds = string.split(", ");
    return sounds[randint(0, sounds.length)] + ".wav";
}

// Killsay Section

// Variables used by killsay functions
var kill_time = 0;
var say = "";
var state = false;

// Function to create killsay
function killsay() {
    if (!UI.GetValue( ["Misc.", "Killsay", "SHEET_MGR", "Killsay", "Enable Killsay"])) return;
    if (Entity.GetEntityFromUserID(Event.GetInt("attacker")) == Entity.GetLocalPlayer()) {
        kill_time = Globals.Realtime();
        string = name_handler();
        if (UI.GetValue( ["Misc.", "Killsay", "SHEET_MGR", "Killsay", "Killsay Delay"]) == 0) {
            display(string);
        }
        else {
            say = string;
            state = true;
        }
    }
}

function name_handler() {
    if (UI.GetValue( ["Misc.", "Killsay", "SHEET_MGR", "Killsay", "Use Enemy Name"])) {
        return (Entity.GetName(Entity.GetEntityFromUserID(Event.GetInt("userid"))) + " " + rand_chat());
    }
    else {
        return (rand_chat());
    }
}

// Function that handles when to send chat via delay value
function delay_handler(string) {
    time = Globals.Realtime();
    if (time - kill_time == UI.GetValue( ["Misc.", "Killsay", "SHEET_MGR", "Killsay", "Killsay Delay"]) && state == true) {
        display(say);
        state = false;
        say = "";
    }
}

// Function used to send in chat
function display(string) {
    Global.ExecuteCommand("say " + string);
}

// Function that returns random ints (for indexes)
function randint(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Killsound Section

// Variables used by killsound functions
var playing = false;
var started = 0.0;

// Function that plays killsound
function killsound() {
    if (!UI.GetValue( ["Misc.", "Killsay", "SHEET_MGR", "Killsay", "Enable Killsound"])) return;
    if (Entity.GetEntityFromUserID(Event.GetInt("attacker")) != Entity.GetLocalPlayer()) return;
    if (Entity.GetEntityFromUserID(Event.GetInt("userid")) == Entity.GetLocalPlayer()) return;
    started = Global.Realtime();
    playing = true;
    if (UI.GetValue( ["Misc.", "Killsay", "SHEET_MGR", "Killsay", "Hear Killsound"])) {
        Global.ExecuteCommand("voice_loopback 1");
    }
    Sound.PlayMicrophone('..\\Counter-Strike Global Offensive\\' + rand_sound());
}

// Function to handle when to stop playing killsound
function soundreset() {
    if (playing && Math.abs(started + UI.GetValue( ["Misc.", "Killsay", "SHEET_MGR", "Killsay", "Play Length"]) - Global.Realtime()) < 0.05) {
        playing = false;
        Sound.StopMicrophone();
        Global.ExecuteCommand("voice_loopback 0");
    }
}

// Callbacks
Global.RegisterCallback("player_death", "killsay");
Global.RegisterCallback("player_death", "killsound");
Global.RegisterCallback("FrameStageNotify", "soundreset");
Global.RegisterCallback("FrameStageNotify", "delay_handler");
