var screenSetting = {
  // canvasId: 'tm-canvas',
  // frameSpeed: 40,
  // column: 60,
  // row: 20,
  // backgroundColor: '#151617',
  // webFontJsPath: 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js',
  // fontColor: '#F5F7FA',
  // fontFamily: 'monospace',
  // fontSource: null,
  // fontSize: 30,
  // zoom: 0.5,
  column: 56,
  row: 19,
  fontFamily: 'Consolas',
};

var debugSetting = {
  // devMode: false,
  // outputDomId: 'tm-debug-output',
  devMode: true,
};

var TMS = new TM.ScreenManager(screenSetting),
    TMI = new TM.InputManager(screenSetting.canvasId,debugSetting.devMode),
    TMD = new TM.DebugManager(debugSetting);

var NUM_OF_DISKS = 4;
var NUM_OF_POLES = 3;
var COLUMN_WIDTH = NUM_OF_DISKS*2+1;
var COLUMN_GAP = 4;
var FRAME_X = 6;
var FRAME_Y = 1;
var DISK_COLORS = ['#999', '#BBB', '#DDD', '#FFF'];
var KEYSET = {
  LEFT: 37,
  RIGHT: 39,
  ENTER: 13,
  ESC: 27,
};
var DISK_CHAR = "#";
var CURSOR_CHAR = "↓";
var GROUND_CHAR = "─";
var POLE_CHAR = "|";

var towerData;
var moveCount;
var cursorPosition;
var cursorDiskValue;
var isGameOver;

function resetTowerData() {
  var towerData = [];
  for(var i=0; i<NUM_OF_POLES; i++){
    towerData[i] = [];
  }
  for(var j=0; j<NUM_OF_DISKS; j++){
    towerData[0].push(NUM_OF_DISKS-j);
  }
  return towerData;
}

function getDiskColor(diskValue){
  var diskColor;
  if(diskValue>0){
    diskColor = DISK_COLORS[(diskValue-1)%(DISK_COLORS.length)];
  }
  return diskColor;
}

function drawFrame(){
  //draw static text
  TMS.insertTextAt(FRAME_X,FRAME_Y+NUM_OF_DISKS+5,"MOVES : \n\n\n");
  TMS.cursor.move(FRAME_X+11,FRAME_Y+NUM_OF_DISKS+7);
  TMS.insertText("┌──────────────────┐\n");
  TMS.insertText("│ HANOI TOWER GAME │\n");
  TMS.insertText("└──────────────────┘\n");
  TMS.insertText("www.A-MEAN-Blog.com");
  TMS.insertTextAt(FRAME_X+5,FRAME_Y+NUM_OF_DISKS+12,"KEYS : ENTER, ←, →, ESC(restart)");

  var x,y;

  //draw top of poles
  for(var i=0; i<NUM_OF_POLES; i++){
    x = FRAME_X+COLUMN_GAP+NUM_OF_DISKS+i*(COLUMN_WIDTH+COLUMN_GAP);
    y = FRAME_Y+3;
    TMS.insertTextAt(x,y,POLE_CHAR);
  }

  //draw ground
  var width = COLUMN_WIDTH*NUM_OF_POLES+COLUMN_GAP*(NUM_OF_POLES+1);
  for(var j=0; j<width; j++){
    x = FRAME_X+j;
    y = FRAME_Y+NUM_OF_DISKS+4;
    TMS.insertTextAt(x,y,GROUND_CHAR);
  }
}

function drawMove(){
  var x = FRAME_X+8;
  var y = FRAME_Y+NUM_OF_DISKS+5;
  TMS.insertTextAt(x,y,moveCount);
}

function drawCursor(){
  for(var i=0; i<NUM_OF_POLES; i++){
    for(var j=0; j<COLUMN_WIDTH; j++){
      var x = FRAME_X+COLUMN_GAP+i*(COLUMN_WIDTH+COLUMN_GAP)+j;
      var y = FRAME_Y+1;
      var char = " ";
      var charColor = null;
      if(i===cursorPosition){
        if(cursorDiskValue === 0 && j==NUM_OF_DISKS){
          char = CURSOR_CHAR;
        }
        else if(cursorDiskValue !== 0 && j>=NUM_OF_DISKS-cursorDiskValue && j<=NUM_OF_DISKS+cursorDiskValue){
          char = DISK_CHAR;
          charColor = getDiskColor(cursorDiskValue);
        }
      }
      TMS.insertTextAt(x,y,char,charColor);
    }
  }
}

function drawTower(){
  for(var i=0; i<NUM_OF_POLES; i++){
    for(var j=0; j<NUM_OF_DISKS; j++){
      for(var k=0; k<COLUMN_WIDTH; k++){
        var x = FRAME_X+COLUMN_GAP+i*(COLUMN_WIDTH+COLUMN_GAP)+k;
        var y = FRAME_Y+4+NUM_OF_DISKS-1-j;
        var char = " ";
        var charColor = null;
        if(!towerData[i][j] && k==NUM_OF_DISKS){
          char = POLE_CHAR;
        }
        else if(towerData[i][j] !== 0 && k>=NUM_OF_DISKS-towerData[i][j] && k<=NUM_OF_DISKS+towerData[i][j]){
          char = DISK_CHAR;
          charColor = getDiskColor(towerData[i][j]);
        }
        TMS.insertTextAt(x,y,char,charColor);
      }
    }
  }
}

function drawGameOver(){
  TMS.cursor.move(FRAME_X,FRAME_Y);
  TMS.insertText(" Completed! Your moves : "+moveCount+" \n",null,"gray");
  TMS.insertText(" Press <ESC> key to start new game ",null,"gray");
}

function reset(){
  towerData = resetTowerData();
  moveCount = 0;
  cursorPosition = 0;
  cursorDiskValue = 0;
  isGameOver = false;

  TMS.cursor.hide();
  TMS.clearScreen();
  drawFrame();
  drawMove();
  drawCursor();
  drawTower();
}


reset();

TMD.print('debug-data',{
  moveCount: moveCount,
  cursorPosition: cursorPosition,
  cursorDiskValue: cursorDiskValue,
  isGameOver: isGameOver,
});
