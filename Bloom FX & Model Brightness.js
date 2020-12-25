//Bound here to avoid spam
var iBloomValue = 1, iScalarValue = 0.1, iModelAmbient = 0;

//Read actual value
function getValue(name)
{
    var value = UI.GetValue("MISC", "JAVASCRIPT", "Script items", name);
    return value;
}

//Dafuq actually doesn't matter where to hook, it will not spam
function OnCreateMove()
{
    //To avoid spam it everytime 
    if(iBloomValue != getValue('FX: Mat bloom scale'))
    { 
        Global.ExecuteCommand("mat_bloomscale " + getValue('FX: Mat bloom scale'));
        iBloomValue = getValue('FX: Mat bloom scale');
    }
    //Lowering this setting will improve the image quality
    if(iScalarValue != getValue('FX: Mat bloom scale factor'))
    { 
        Global.ExecuteCommand("mat_bloom_scalefactor_scalar " + getValue('FX: Mat bloom scale factor'));
        iScalarValue = getValue('FX: Mat bloom scale factor');
    }
    //Brightness for models
    if(iModelAmbient != getValue('FX: Model brightness'))
    { 
        Global.ExecuteCommand("r_modelAmbientMin " + getValue('FX: Model brightness'));
        iModelAmbient = getValue('FX: Model brightness');
    } 
}

//Our script hooks
function Main()
{ 
    UI.AddSliderFloat("FX: Mat bloom scale", 1.0, 50.0);
    UI.AddSliderFloat("FX: Mat bloom scale factor", 0.1, 1.0);
    UI.AddSliderFloat("FX: Model brightness", 0, 50);
    //Epic dumbass ever >_>
    Global.RegisterCallback("CreateMove", "OnCreateMove");
}

Main();