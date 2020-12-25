/*
    Minesweeper Game
    by kseny
*/

var screenSize = Global.GetScreenSize();

var boxSize = 200;

var playingGame = false;
var revealBombs = false;
var gameMatrix = [];
var bombsCount = 20;


function onCellClick(i, j)
{
    switch(gameMatrix[i][j])
    {
        case -1:
        {
            playingGame = false;
            revealBombs = true;
            break;
        }
        case -2:
        {
            mineCount = 0;

            for (a = Math.max(i-1, 0); a <= Math.min(i+1, 9); a++)
                for(b = Math.max(j-1, 0); b <= Math.min(j+1, 9); b++)
                    if(gameMatrix[a][b] == -1)
                        mineCount ++;

            gameMatrix[i][j] = mineCount;  

            if(mineCount == 0)
                for (a = Math.max(i-1, 0); a <= Math.min(i+1, 9); a++)
                    for(b = Math.max(j-1, 0); b <= Math.min(j+1, 9); b++)
                        onCellClick(a, b);
        }
    }

    gameCompleted = true;

    for(i = 0; i < 10; i++)
        for(j = 0; j < 10; j++)
            if(gameMatrix[i][j] == -2)
                gameCompleted = false;

    if(gameCompleted)
        playingGame = false;  
}

function onDrawEvent()
{
    if(!UI.GetValue("MISC", "JAVASCRIPT", "Script Items", "Play Minesweeper Game") || !UI.IsMenuOpen())
        return;

    Render.GradientRect(screenSize[0]/2 - boxSize/2 - 5, screenSize[1]/2 - boxSize/2 - 34 - 2, boxSize + 10, 4, 1, [217, 157, 86, 255], [223, 174, 97, 255]);
    Render.FilledRect(screenSize[0]/2 - boxSize/2 - 5, screenSize[1]/2 - boxSize/2 - 30 - 2, boxSize + 10, 25, [44, 48, 55, 255]);
    Render.String(screenSize[0]/2, screenSize[1]/2 - boxSize/2 - 25 - 2, 1, "Minesweeper", [255, 255, 255, 255]);

    Render.FilledRect(screenSize[0]/2 - boxSize/2 - 5, screenSize[1]/2 - boxSize/2 - 5, boxSize + 10, boxSize + 10, [44, 48, 55, 255]);
    Render.Rect(screenSize[0]/2 - boxSize/2, screenSize[1]/2 - boxSize/2, boxSize, boxSize, [100, 100, 100, 150]);

    for(i = 0; i < 10; i++)
    {
        for(j = 0; j < 10; j++)
        {
            if(gameMatrix[i][j] == -1 && revealBombs)
                Render.FilledRect(screenSize[0]/2 - boxSize/2 + i * 20, screenSize[1]/2 - boxSize/2 + j * 20, 19, 19, [255, 0, 0, 255]);

            if(gameMatrix[i][j] > -1)
                Render.String(screenSize[0]/2 - boxSize/2 + i * 20 + 10, screenSize[1]/2 - boxSize/2 + j * 20 + 7, 1, gameMatrix[i][j].toString(), [255, 255, 255, 255], 2);

            Render.Rect(screenSize[0]/2 - boxSize/2 + i * 20, screenSize[1]/2 - boxSize/2 + j * 20, 20, 20, [255, 255, 255, 255]);
        }
    }

    if(playingGame)
    {
        var cursorPosition = Global.GetCursorPosition();

        if(Global.IsKeyPressed(0x01))
            for(i = 0; i < 10; i++)
                for(j = 0; j < 10; j++)
                    if(cursorPosition[0] >= screenSize[0]/2 - boxSize/2 + i * 20 && cursorPosition[0] <= screenSize[0]/2 - boxSize/2 + (i+1) * 20 && cursorPosition[1] >= screenSize[1]/2 - boxSize/2 + j * 20 && cursorPosition[1] <= screenSize[1]/2 - boxSize/2 + (j+1) * 20)
                        onCellClick(i, j);
    }
    else
    {
        Render.FilledRect(screenSize[0]/2 - boxSize/2 - 5, screenSize[1]/2 + boxSize/2 + 15, boxSize + 10, 47, [0, 0, 0, 120]);

        if(revealBombs == true)
            Render.String(screenSize[0]/2, screenSize[1]/2 + boxSize/2 + 22.5, 1, "You lost", [255, 0, 0, 255]);
        else
            Render.String(screenSize[0]/2, screenSize[1]/2 + boxSize/2 + 22.5, 1, "You Won", [0, 255, 0, 255]);

        Render.String(screenSize[0]/2, screenSize[1]/2 + boxSize/2 + 38, 1, "Press ENTER to start a new game", [255, 255, 255, 255]);

        if(Global.IsKeyPressed(0x0D))
            startNewGame();
    }
}

function startNewGame()
{
    gameMatrix = [];

    for(i = 0; i < 10; i++)
    {
        gameMatrix[i] = [];

        for(j = 0; j < 10; j++)
            gameMatrix[i][j] = -2;
    }

    for(i = 0; i < bombsCount; i++)
        gameMatrix[Math.floor(Math.random() * 10)][Math.floor(Math.random() * 10)] = -1;

    playingGame = true;
    revealBombs = false;
}


startNewGame();
UI.AddCheckbox("Play Minesweeper Game");
Global.RegisterCallback("Draw", "onDrawEvent");