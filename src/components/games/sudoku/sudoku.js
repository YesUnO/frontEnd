import Phaser from 'phaser'
import store from '../../../store/index'
import eventDispatcher from '@/components/helpers/eventDispatcher.js'

/* eslint-disable */

let tileDim = 48
let canvasDimension = {
    x: tileDim * 9 + 15,
    y: tileDim * 9 + 50
}

let padding = {
    top: -20,
    left: 0
}

let boardAnchor = {
    x: (canvasDimension.x - 9 * tileDim) / 2 + padding.left,
    y: (canvasDimension.y - 9 * tileDim) / 2 + padding.top
}

let boardEnd = {
    x: boardAnchor.x + tileDim * 9,
    y: boardAnchor.y + tileDim * 9
}

function launch(containerId) {
    let config = {
        type: Phaser.AUTO,
        parent: containerId,
        width: canvasDimension.x,
        height: canvasDimension.y,
        resolution:window.devicePixelRatio,
        scale: { mode: Phaser.Scale.NONE },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    }
    return new Phaser.Game(config)
}

//configs

let colorsConfig = {
    minigridLines: '0x006AB0',
    text: 'black',
    failedText: 'red'
}

let numberTextConfig = {
    fontFamily: 'Source Sans Pro',
    // fontStyle: 'Extra-light 200',
    fontSize: '22px',
    color: colorsConfig.text
}

let failedNumberTextConfig = {
    fontFamily: 'Source Sans Pro',
    // fontStyle: 'Extra-light 200',
    fontSize: '22px',
    color: colorsConfig.failedText
}

let notesTextConfig = {
    fontFamily: 'Source Sans Pro',
    // fontStyle: 'Extra-light 200',
    fontSize: '14px',
    color: colorsConfig.text,
    lineSpacing: -5.5
}

// grid variables
let map;
let gridLayer;
let marker;
let worldPoint;
let test;
let timer;
let startTime;
let elapsedTime;
let timeNow;
let keys = [];
let numbers = [];
let emitter;
let notes = [];
let notesSwitch;
let emptyCells;
let breakInputLoop;

// sudoku variables
let actual;
let puzzleCorrectSolutionArray;
let puzzleCorrectSolution = '';
let puzzlePlayerSolution = '';
let puzzleEntering = '';
let possible;
let actualStack;
let possibleStack;
let wrongActualsStack;
let easySettings = [
    [0, 0], [0, 3], [0, 8],
    [1, 2], [1, 4], [1, 5], [1, 8],
    [2, 0], [2, 1], [2, 3], [2, 5], [2, 6], [2, 7],
    [3, 3], [3, 4], [3, 5], [3, 6],
    [5, 2], [5, 3], [5, 4], [5, 5],
    [6, 1], [6, 2], [6, 3], [6, 5], [6, 7], [6, 8],
    [7, 0], [7, 3], [7, 4], [7, 6],
    [8, 0], [8, 5], [8, 8]
];
let newGame;

let totalScore

// grid methods
function preload() {
    let self = this;

    self.load.image('tiles', 'assets/32.png', { frameWidth: tileDim, frameHeight: tileDim });
    self.load.image('bg', 'assets/sky4.png');
}

function create() {
    let self = this;

    let bg = self.add.image(canvasDimension.x / 2, canvasDimension.y/3*2, 'bg')
        bg.setDisplaySize(canvasDimension.x,1200);


    notesSwitch = true;

    let level = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]

    map = self.make.tilemap({ data: level, tileWidth: tileDim, tileHeight: tileDim });
    let tiles = map.addTilesetImage('tiles');
    gridLayer = map.createLayer(0, tiles, 0, 0)
        .setPosition(boardAnchor.x, boardAnchor.y);

    worldPoint = self.input;

    // add num keyboard
    keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace','ArrowRight','ArrowLeft','ArrowUp','ArrowDown'];


    // create minigrid lines

    let lineVert1 = self.add.line(
        0,
        0,
        boardAnchor.x + 3 * tileDim,
        boardAnchor.y,
        boardAnchor.x + 3 * tileDim,
        boardAnchor.y + 9 * tileDim,
        colorsConfig.minigridLines)
        .setOrigin(0, 0);

    let lineVert2 = self.add.line(
        0,
        0,
        boardAnchor.x + 6 * tileDim,
        boardAnchor.y,
        boardAnchor.x + 6 * tileDim,
        boardAnchor.y + 9 * tileDim,
        colorsConfig.minigridLines)
        .setOrigin(0, 0);

    let lineHor1 = self.add.line(
        0,
        0,
        boardAnchor.x,
        boardAnchor.y + 3 * tileDim,
        boardAnchor.x + 9 * tileDim,
        boardAnchor.y + 3 * tileDim,
        colorsConfig.minigridLines)
        .setOrigin(0, 0);

    let lineHor2 = self.add.line(
        0,
        0,
        boardAnchor.x,
        boardAnchor.y + 6 * tileDim,
        boardAnchor.x + 9 * tileDim,
        boardAnchor.y + 6 * tileDim,
        colorsConfig.minigridLines)
        .setOrigin(0, 0);

    // add grid array

    gridLayer.forEachTile(function (tile) {
        let textX = Math.floor(tile.pixelX + tile.width / 2 + boardAnchor.x)
        let textY = Math.floor(tile.pixelY + tile.height / 2 + boardAnchor.y)

        //createNotes(textX, textY,tile,self)
        notes[tile.x + 'x' + tile.y] = self.add.text(textX, textY, '', notesTextConfig)
        notes[tile.x + 'x' + tile.y].setOrigin(.5, .5);

        numbers[tile.x + 'x' + tile.y] = self.add.text(textX, textY, '', numberTextConfig);
        numbers[tile.x + 'x' + tile.y].setOrigin(0.5, 0.5).setScale(1);
    });

    timer = self.add.text(canvasDimension.x / 2, canvasDimension.y - 50 / 2)
        .setOrigin(.5, .5);

    // mark tile
    self.input.on('pointerdown', function () {
        let tileIndex
        try {
            tileIndex = gridLayer.getTileAtWorldXY(worldPoint.x, worldPoint.y).index
        } catch (e) {
            // error
        }
        gridLayer.forEachTile(function (tile) {
            if (tile.index == 2) {
                gridLayer.putTileAt(0, tile.x, tile.y)
            }
        })
        if (tileIndex == 0) {
            gridLayer.putTileAtWorldXY(2, worldPoint.x, worldPoint.y)
        }
    });

    self.input.keyboard.on('keydown', function userInput(event) {
        if (keys.includes(event.key)) {
            let tile = gridLayer.findByIndex(2);
            
            if (!!tile && tile.index == 2) {
                evaluateKeyDownEvent(event,tile);
            }
        }
    });

    createEmmiter()
    CreateMarker(self);
    startNewGame(newGame);
}

function createEmmiter() {
    
    emitter = eventDispatcher.getInstance();
    emitter.on('destroy',()=>{
        
        
    })
    emitter.on('newGame', startNewGame);
    emitter.on('loadLastGoodSolution', loadLastGoodSolution);
    emitter.on('switchNotes', function () {
        notesSwitch = !notesSwitch;

    });
    emitter.on('hint', setCorrectValue)
}

function evaluateKeyDownEvent(event, tile) {
    let nextTile;
    let x = JSON.parse(JSON.stringify(tile.x));
    let y = JSON.parse(JSON.stringify(tile.y));


    switch (event.key) {
        case 'Backspace':
            numbers[tile.x + 'x' + tile.y].setText('');
            break;

        case 'ArrowRight':
            while (true) {
                nextTile = gridLayer.getTileAt(++x, tile.y)
                if (!nextTile || nextTile.index == 0) {
                    break;
                }
            }
            if (!!nextTile && nextTile.index == 0) {
                gridLayer.putTileAt(0, tile.x, tile.y);
                gridLayer.putTileAt(2, nextTile.x, tile.y);
            }
            break;

        case 'ArrowLeft':
            while (true) {
                nextTile = gridLayer.getTileAt(--x, tile.y)
                if (!nextTile || nextTile.index == 0) {
                    break;
                }
            }
            if (!!nextTile && nextTile.index == 0) {
                gridLayer.putTileAt(0, tile.x, tile.y);
                gridLayer.putTileAt(2, nextTile.x, tile.y);
            }
            break;

        case 'ArrowUp':
            while (true) {
                nextTile = gridLayer.getTileAt(tile.x, --y)
                if (!nextTile || nextTile.index == 0) {
                    break;
                }
            }
            if (!!nextTile && nextTile.index == 0) {
                gridLayer.putTileAt(0, tile.x, tile.y);
                gridLayer.putTileAt(2, tile.x, nextTile.y);
            }
            break;

        case 'ArrowDown':
            while (true) {
                nextTile = gridLayer.getTileAt(tile.x, ++y)
                if (!nextTile || nextTile.index == 0) {
                    break;
                }
            }
            if (!!nextTile && nextTile.index == 0) {
                gridLayer.putTileAt(0, tile.x, tile.y);
                gridLayer.putTileAt(2, tile.x, nextTile.y);
            }
            break;

        default:
            if (!notesSwitch) {
                notesInput(tile.x, tile.y, event.key)
            }
            else {
                numberInput(tile.x, tile.y, event.key)
            }
            break;
    }
}

function setCorrectValue() {
    let tile = gridLayer.findByIndex(2);
    if (!!tile && tile.index == 2) {
        let x = tile.x;
        let y = tile.y;

        let value = puzzleCorrectSolutionArray[y][x];
        numbers[x + 'x' + y].setText(value);
        if (notes[x + 'x' + y].text != '     \n     \n     ') {
            notes[x + 'x' + y].setText('     \n     \n     ');
        }
        evaluateInput();
    }
}

function numberInput(x, y, value) {
    if (puzzleCorrectSolutionArray[y][x] != value) {
        saveLastGoodPlayerSolution()
    }
    numbers[x + 'x' + y].setText(value);
    if (notes[x + 'x' + y].text != '     \n     \n     ') {
        notes[x + 'x' + y].setText('     \n     \n     ');
    }
    evaluateInput();
}

function evaluateInput() {
    emptyCells = 0;
    scanGrid((x, y) => {
        if (numbers[x + 'x' + y].text == '') {
            emptyCells++;
        }
    });
    if (emptyCells == 0) {
        evaluateSolution();
    }
}

function saveLastGoodPlayerSolution() {
    let lastGoodSolution = '';
    scanGrid((r, c) => {
        if (numbers[c + 'x' + r].text == puzzleCorrectSolutionArray[r][c]) {
            lastGoodSolution += numbers[c + 'x' + r].text;
        }
        else {
            lastGoodSolution +=0
        }
    })
    let solutionLength = lastGoodSolution.replaceAll('0', '').length;
    let storedSolution = store.getters.getLastGoodSolution;
    if (storedSolution.length < solutionLength) {
        store.commit('setLastGoodSolution', { value: lastGoodSolution, length: solutionLength })
    }
}

function evaluateSolution() {
    puzzlePlayerSolution = '';
    scanGrid((x, y) => {
        puzzlePlayerSolution += numbers[y + 'x' + x].text;
    });
    let currentGame = store.getters.getCurrentGame;
    let ranked = store.getters.getRankedState
    if (puzzlePlayerSolution == currentGame.solution) {
        
        if (ranked) {
            store.commit('setCompletedGame', { id: currentGame.id, puzzleEntering: puzzleEntering, puzzleCorrectSolution: puzzleCorrectSolution, elapsedTime: elapsedTime });
            store.dispatch('userGameSolution/post', { game: { id: !!currentGame.id ? currentGame.id : 0, name: currentGame.name, entering: puzzleEntering, solution: puzzleCorrectSolution, difficulity: 0 }, elapsedTime: elapsedTime })
        }
        store.commit('setGameResult',true);
    }
    else {
        store.commit('setGameResult',false);
    }
    store.commit('setResultDialog',true)

}

function notesInput(x, y, value) {
    let position = 2 * value - 2;
    let noteText = notes[x + 'x' + y].text;

    if (noteText.includes(value)) {
        noteText = noteText.substring(0, position) + ' ' + noteText.substring(position + 1, noteText.length);
    }

    else {
        noteText = noteText.substring(0, position) + value + noteText.substring(position + 1, noteText.length);
    }

    notes[x + 'x' + y].setText(noteText);
    numbers[x + 'x' + y].setText('');
}

function update() {
    let self = this;

    updateTimer();

    UpdateMarker(self.input.activePointer);
}

function updateTimer() {

    timeNow = new Date();

    let timeDiff = (timeNow.getTime() - startTime.getTime());

    elapsedTime = Math.abs(timeDiff / 1000);

    var elapsedMin = Math.floor(elapsedTime / 60);

    var elapsedSec = Math.floor(elapsedTime - (60 * elapsedMin));

    timer.setText(elapsedMin + ':' + elapsedSec);
}

function startNewGame() {
    resetBoard();
    if (store.getters.getRankedState) {
        if (!store.getters.getNextGameAvailable) {
            GenerateNewPuzzle();
            
        }
        else {
            AssignExistingPuzzle();
        }
    }
    else {
        GenerateNewPuzzle();
    }
    startTime = new Date();
}

function loadLastGoodSolution() {
    resetBoard();
    AssignExistingPuzzle();
    let lastGoodSolution = store.getters.getLastGoodSolution;
    let i = 0;
    scanGrid((x,y)=>{
        if (lastGoodSolution.value.charAt(i) != '0') {
            numbers[y+'x'+x].setText(lastGoodSolution.value.charAt(i));
        }
        i++
    })
    
}

function resetBoard() {
    actual = Array(9).fill('').map(() => Array(9).fill(0));
    possible = Array(9).fill('').map(() => Array(9).fill(''));
    puzzleCorrectSolutionArray = Array(9).fill('').map(() => Array(9).fill(''));
    actualStack = new Array();
    possibleStack = new Array();
    wrongActualsStack = new Array();
    puzzleEntering = '';
    puzzleCorrectSolution = '';
    scanGrid((x, y) => {
        notes[x + 'x' + y].setText('     \n     \n     ');
        numbers[x + 'x' + y].setText('');
    });
    gridLayer.forEachTile(function (tile) {
        tile.index = 0;
    });
}

function UpdateMarker(worldPoint) {
    let pointerTyleXY = gridLayer.worldToTileXY(worldPoint.x, worldPoint.y);
    let snappedWorldPoint = gridLayer.tileToWorldXY(pointerTyleXY.x, pointerTyleXY.y);

    if ((worldPoint.x >= boardAnchor.x && worldPoint.x <= boardEnd.x) && (worldPoint.y >= boardAnchor.y && worldPoint.y <= boardEnd.y)) {
        marker.setPosition(snappedWorldPoint.x - boardAnchor.x, snappedWorldPoint.y - boardAnchor.y);
    }
}

function CreateMarker(self) {
    marker = self.add.graphics();
    marker.lineStyle(2, 0x000000, 1);
    marker.strokeRect(boardAnchor.x, boardAnchor.y, tileDim, tileDim);
}

// sudoku methods

function AssignExistingPuzzle() {
    let newGame = store.getters.getCurrentGame;
    let assignedEntering = newGame.entering;
    let assignedSolution = newGame.solution;
    let assignedNrSol;
    let assignedNr;
    scanGrid((r, c) => {
        //write numbers to main entering array
        assignedNr = assignedEntering.charAt(0);
        assignedEntering = assignedEntering.substring(1)
        actual[r][c] = assignedNr;

        //write numbers to solution array
        assignedNrSol = assignedSolution.charAt(0);
        assignedSolution = assignedSolution.substring(1)
        puzzleCorrectSolutionArray[r][c] = assignedNrSol;

        //write numbers to visual entering array
        if (assignedNr != 0) {
            numbers[c + 'x' + r].setText(assignedNr)

            let tile = gridLayer.getTileAt(c, r)
            tile.index = 1
        }
    });
}

function SetDifficulity(difficulity) {
    scanGrid((r, c) => {
        let occurence = false;
        for (var i in difficulity) {
            let x = difficulity[i][0];
            let y = difficulity[i][1];
            if (x == r && y == c) {
                occurence = true;
                break;
            }
        }
        if (!occurence) {
            actual[r][c] = 0;
        }
    })
}

function SolveSudoku() {
    let exitLoop = false
    let changes = false

    try {
        while (!exitLoop) {
            changes = CheckColumnsAndRows()
            if (changes) {
                break
            }

            changes = LookForLoneRangersinMinigrids()
            if (changes) {
                break
            }

            changes = LookForLoneRangersinRows()
            if (changes) {
                break
            }

            changes = LookForLoneRangersinColumns()
            if (changes) {
                break
            }
            exitLoop = true
        }
        if (changes) {
            SolveSudoku()
        }
    } catch (error) {
        throw 'error'
    }

    if (IsSudokuSolved()) {
        return true
    } else {
        return false
    }
}

function IsSudokuSolved() {
    let pattern
    let c
    let r

    // check col by col
    for (c = 0; c < 9; c++) {
        pattern = '123456789'
        for (r = 0; r < 9; r++) {
            pattern = pattern.replace(actual[r][c].toString(), '')
        }
        if (pattern.length > 0) {
            return false
        }
    }

    // check column by column
    for (r = 0; r < 9; r++) {
        pattern = '123456789'
        for (c = 0; c < 9; c++) {
            pattern = pattern.replace(actual[r][c].toString(), '')
        }
        if (pattern.length > 0) {
            return false
        }
    }

    // check minigrid
    for (r = 0; r < 9; r += 3) {
        pattern = '123456789'
        for (c = 0; c < 9; c += 3) {
            for (var rr = 0; rr <= 2; rr++) {
                for (var cc = 0; cc <= 2; cc++) {
                    pattern = pattern.replace(actual[r + rr][c + cc].toString(), '')
                }
            }
        }
        if (pattern.length > 0) {
            return false
        }
    }
    return true
}

function CalculatePossibleValues(row, col) {
    let str
    if (possible[row][col] == '') {
        str = '123456789'
    } else {
        str = possible[row][col]
    }

    for (let c = 0; c < 9; c++) {
        if (actual[row][c] != 0) {
            str = str.replace(actual[row][c].toString(), '')
        }
    }

    for (let r = 0; r < 9; r++) {
        if (actual[r][col] != 0) {
            str = str.replace(actual[r][col].toString(), '')
        }
    }

    scanMinigrid(row, col, (r, c) => {
        if (actual[r][c] != 0) {
            str = str.replace(actual[r][c].toString(), '')
        }
    })

    if (str == '') {
        throw 'error'
    }
    return str
}

function CheckColumnsAndRows() {
    let changes = false
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (actual[row][col] == 0) {
                try {
                    possible[row][col] = CalculatePossibleValues(row, col)
                } catch (error) {
                    throw 'error'
                    // invalid move
                }
                if (possible[row][col].length == 1) {
                    setNumberToActual(row, col, parseInt(possible[row][col]), 1)
                    // actual[row][col] = parseInt(possible[row][col]);
                    changes = true
                    totalScore += 1
                }
            }
        }
    }
    return changes
}
function LookForLoneRangersinMinigrids() {
    let changes = false
    let occurence
    let nextMiniGrid
    let rPos
    let cPos

    for (let n = 1; n <= 9; n++) {
        for (let c = 0; c <= 8; c += 3) {
            for (let r = 0; r <= 8; r += 3) {
                nextMiniGrid = false
                occurence = 0

                for (let cc = 0; cc <= 2; cc++) {
                    for (let rr = 0; rr <= 2; rr++) {
                        if (actual[r + rr][c + cc] == 0 && possible[r + rr][c + cc].includes(n.toString())) {
                            occurence += 1
                            rPos = r + rr
                            cPos = c + cc
                            if (occurence >= 2) {
                                nextMiniGrid = true
                                break
                            }
                        }
                    }
                }
                if (!nextMiniGrid && occurence == 1) {
                    setNumberToActual(rPos, cPos, n, 2)

                    changes = true
                }
            }
        }
    }
    return changes
}

function LookForLoneRangersinRows() {
    let changes = false
    let occurence
    let rPos
    let cPos
    for (let c = 0; c < 8; c++) {
        for (let n = 0; n < 8; n++) {
            for (let r = 0; r < 8; r++) {
                if (actual[r][c] == 0 && possible[r][c].includes(n.toString())) {
                    occurence += 1
                    rPos = r
                    cPos = c
                    if (occurence > 1) {
                        break
                    }
                }
                if (occurence == 1) {
                    setNumberToActual(r, c, n, 3)
                    // actual[r][c] == n;
                    changes = true

                    totalScore += 2
                }
            }
        }
    }
    return changes
}

function LookForLoneRangersinColumns() {
    let changes = false
    let occurence
    let rPos
    let cPos
    for (let c = 0; c < 8; c++) {
        for (let n = 0; n < 8; n++) {
            for (let r = 0; r < 8; r++) {
                if (actual[r][c] == 0 && possible[r][c].includes(n.toString())) {
                    occurence += 1
                    rPos = r
                    cPos = c
                    if (occurence > 1) {
                        break
                    }
                }
                if (occurence == 1) {
                    setNumberToActual(r, c, n, 4)
                    // actual[r][c] == n;
                    changes = true

                    totalScore += 2
                }
            }
        }
    }
    return changes
}
function LookForTwinsinMinigrids() {
    let changes = false
    scanGrid((r, c) => {
        if (actual[r][c] == 0 & possible[r][c].length == 2) {
            scanMinigrid(r, c, (rr, cc) => {
                if (rr != r & cc != c & possible[r][c] == possible[rr][cc]) {
                    scanMinigrid(r, c, (rrr, ccc) => {
                        if (actual[rrr][ccc] == 0 & possible[rrr][ccc].length != possible[r][c]) {
                            let originalPossible = possible[rrr][ccc]
                            possible[rrr][ccc].replace(possible[r][c].charAt(0), '')
                            possible[rrr][ccc].replace(possible[r][c].charAt(1), '')
                            if (originalPossible != possible[rrr][ccc]) {
                                changes = true
                            }
                            if (possible[rrr][ccc] == '') {
                                // error
                            }
                            if (possible[rrr][ccc].length == 1) {
                                setNumberToActual(rrr, ccc, parseInt(possible[rrr][ccc]), 5)
                                // actual[rrr][ccc] = parseInt(possible[rrr][ccc])
                            }

                            totalScore += 3
                        }
                    })
                }
            })
        }
    })
    return changes
}

function LookForTwinsinRows() {
    let changes = false
    scanGrid((r, c) => {
        if (actual[r][c] == 0 & possible[r][c].length == 2) {
            for (let rr = r + 1; rr < 9; rr++) {
                if (possible[rr][c] == possible[r][c]) {
                    for (let rrr = 0; rr < 9; rr++) {
                        if (actual[rrr][c] == 0 & rrr != r & rrr != rr) {
                            let originalPossible = possible[rrr][c]
                            possible[rrr][c].replace(possible[r][c].charAt(0), '')
                            possible[rrr][c].replace(possible[r][c].charAt(1), '')
                            if (originalPossible != possible[rrr][c]) {
                                changes = true
                            }
                            if (possible[rrr][c] == '') {
                                // error
                            }
                            if (possible[rrr][c].length == 1) {
                                setNumberToActual(rrr, c, parseInt(possible[rrr][c]), 6)
                                // actual[rrr][c] = parseInt(possible[rrr][c])
                            }

                            totalScore += 3
                        }
                    }
                }
            }
        }
    })
    return changes
}
function LookForTwinsinColumns() {
    let changes = false
    scanGrid((r, c) => {
        if (actual[r][c] == 0 & possible[r][c].length == 2) {
            for (let cc = c + 1; cc < 9; cc++) {
                if (possible[r][cc] == possible[r][c]) {
                    for (let ccc = 0; ccc < 9; ccc++) {
                        if (actual[r][ccc] == 0 & ccc != r & ccc != cc) {
                            let originalPossible = possible[r][ccc]
                            possible[r][ccc].replace(possible[r][c].charAt(0), '')
                            possible[r][ccc].replace(possible[r][c].charAt(1), '')
                            if (originalPossible != possible[r][ccc]) {
                                changes = true
                            }
                            if (possible[r][ccc] == '') {
                                // error
                            }
                            if (possible[r][ccc].length == 1) {
                                setNumberToActual(r, ccc, parseInt(possible[r][ccc]), 7)
                                // actual[r][ccc] = parseInt(possible[r][ccc])
                            }

                            totalScore += 3
                        }
                    }
                }
            }
        }
    })
    return changes
}
function LookForTripletsinMinigrids() {
    let changes = false
    scanGrid((r, c) => {
        if (actual[r][c] == 0 & possible[r][c].length == 3) {
            let tripletsLocation = `${r}${c}`
            scanMinigrid(r, c, (rr, cc) => {
                if (rr != r & cc != c &
                    (possible[rr][cc] == possible[r][c] ||
                        (
                            possible[rr][cc].length == 2 &
                            possible[r][c].includes(possible[rr][cc].charAt(0).toString()) &
                            possible[r][c].includes(possible[rr][cc].charAt(0).toString())
                        )
                    )
                ) {
                    tripletsLocation += `${rr}${cc}`
                }
            })

            if (tripletsLocation.length == 6) {
                scanMinigrid(r, c, (rrr, ccc) => {
                    if (
                        actual[rrr][ccc] == 0 &
                        rrr == tripletsLocation.charAt(0) &
                        ccc == tripletsLocation.charAt(1) &
                        rrr == tripletsLocation.charAt(2) &
                        ccc == tripletsLocation.charAt(3) &
                        rrr == tripletsLocation.charAt(4) &
                        ccc == tripletsLocation.charAt(5)
                    ) {
                        let originalPossible = possible[rrr][ccc]

                        possible[rrr][ccc].replace(possible[r][c].charAt(0), '')
                        possible[rrr][ccc].replace(possible[r][c].charAt(1), '')
                        possible[rrr][ccc].replace(possible[r][c].charAt(2), '')
                        if (originalPossible != possible[rrr][ccc]) {
                            changes = true
                        }
                        if (possible[rrr][ccc] == '') {
                            // error
                        }
                        if (possible[rrr][ccc].length == 1) {
                            setNumberToActual(rrr, ccc, parseInt(possible[r][ccc]), 8)
                            // actual[rrr][ccc] = parseInt(possible[r][ccc])
                        }

                        totalScore += 3
                    }
                })
            }
        }
    })
    return changes
}
function LookForTripletsinRows() {
    let changes = false
    scanGrid((r, c) => {
        if (actual[r][c] == 0 & possible[r][c].length == 3) {
            let tripletsLocation = `${r}${c}`
            for (let rr = 0; rr < 9; rr++) {
                if (rr != r &
                    (possible[rr][c] == possible[r][c] ||
                        (
                            possible[rr][c].length == 2 &
                            possible[r][c].includes(possible[rr][c].charAt(0).toString()) &
                            possible[r][c].includes(possible[rr][c].charAt(0).toString())
                        )
                    )
                ) {
                    tripletsLocation += `${rr}${c}`
                }
            }
            if (tripletsLocation.length == 6) {
                for (let rrr = 0; rrr < 9; rrr++) {
                    if (
                        actual[rrr][c] == 0 &
                        rrr == tripletsLocation.charAt(0) &
                        rrr == tripletsLocation.charAt(2) &
                        rrr == tripletsLocation.charAt(4)
                    ) {
                        let originalPossible = possible[rrr][c]

                        possible[rrr][c].replace(possible[r][c].charAt(0), '')
                        possible[rrr][c].replace(possible[r][c].charAt(1), '')
                        possible[rrr][c].replace(possible[r][c].charAt(2), '')
                        if (originalPossible != possible[rrr][c]) {
                            changes = true
                        }
                        if (possible[rrr][c] == '') {
                            // error
                        }
                        if (possible[rrr][c].length == 1) {
                            setNumberToActual(rrr, c, parseInt(possible[r][c]), 9)
                            // actual[rrr][c] = parseInt(possible[r][c])
                        }

                        totalScore += 3
                    }
                }
            }
        }
    })
    return changes
}
function LookForTripletsinColumns() {
    let changes = false
    scanGrid((r, c) => {
        if (actual[r][c] == 0 & possible[r][c].length == 3) {
            let tripletsLocation = `${r}${c}`
            for (let cc = 0; cc < 9; cc++) {
                if (cc != c &
                    (possible[r][cc] == possible[r][c] ||
                        (
                            possible[r][cc].length == 2 &
                            possible[r][c].includes(possible[r][cc].charAt(0).toString()) &
                            possible[r][c].includes(possible[r][cc].charAt(0).toString())
                        )
                    )
                ) {
                    tripletsLocation += `${r}${cc}`
                }
            }
            if (tripletsLocation.length == 6) {
                for (let ccc = 0; ccc < 9; ccc++) {
                    if (
                        actual[r][ccc] == 0 &
                        ccc == tripletsLocation.charAt(1) &
                        ccc == tripletsLocation.charAt(3) &
                        ccc == tripletsLocation.charAt(5)
                    ) {
                        let originalPossible = possible[r][ccc]

                        possible[r][ccc].replace(possible[r][c].charAt(0), '')
                        possible[r][ccc].replace(possible[r][c].charAt(1), '')
                        possible[r][ccc].replace(possible[r][c].charAt(2), '')
                        if (originalPossible != possible[r][ccc]) {
                            changes = true
                        }
                        if (possible[r][ccc] == '') {
                            // error
                        }
                        if (possible[r][ccc].length == 1) {
                            setNumberToActual(r, ccc, parseInt(possible[r][c]), 10)
                            // actual[r][ccc] = parseInt(possible[r][c])
                        }

                        totalScore += 3
                    }
                }
            }
        }
    })
    return changes
}

function GenerateNewPuzzle() {
    if (!SolveSudoku()) {
        SolvePuzzleByBruteForce();
    }

    SaveCorrectSolution();
    SetDifficulity(easySettings);
    SavePuzzleEntering();
    PrintOutPuzzleOnTheBoard();
    store.commit('setNewGame', { solution: puzzleCorrectSolution, entering: puzzleEntering });
}

function PrintOutPuzzleOnTheBoard() {
    scanGrid((r, c) => {
        if (actual[r][c] != 0) {
            numbers[c + 'x' + r].setText(actual[r][c]);

            let tile = gridLayer.getTileAt(c, r);
            tile.index = 1;
        }
    })
}

function SolvePuzzleByBruteForce() {
    baseCheckBoard()

    let fewestPossKoordinates = FindCellWithFewestPossibleValues()
    let row = fewestPossKoordinates.row
    let col = fewestPossKoordinates.col

    let possibleLength = possible[row][col].length
    let randomPossiblePosition = getRandomIntInclusive(0, possibleLength - 1)
    let randomValue = parseInt(possible[row][col].charAt(randomPossiblePosition))

    BruteForceNumber(row, col, randomValue)

    try {
        if (SolveSudoku()) {
            return
        } else {
            SolvePuzzleByBruteForce()
        }
    } catch (error) {
        DealWithFailAfterBruteForce()
    }
}

function SaveCorrectSolution() {
    puzzleCorrectSolutionArray = JSON.parse(JSON.stringify(actual));
    scanGrid((r, c) => {
        puzzleCorrectSolution += actual[r][c].toString()
    })
}
function SavePuzzleEntering() {
    scanGrid((r, c) => {
        puzzleEntering += actual[r][c].toString()
    })
}

function BruteForceNumber(row, col, value) {
    let wrongActual = [row, col, value]

    let actualClone = JSON.parse(JSON.stringify(actual))
    actualStack.push(actualClone)
    let possibleClone = JSON.parse(JSON.stringify(possible))
    possibleStack.push(possibleClone)

    wrongActualsStack.push(wrongActual)

    setNumberToActual(row, col, value, 0)
}

function DealWithFailAfterBruteForce() {
    let wrongNumber = wrongActualsStack.pop()
    let wrongNumberRow = wrongNumber[0]
    let wrongNumberCol = wrongNumber[1]
    let wrongNumberValue = wrongNumber[2]

    actual = actualStack.pop()
    possible = possibleStack.pop()
    possible[wrongNumberRow][wrongNumberCol] = possible[wrongNumberRow][wrongNumberCol].replace(wrongNumberValue.toString(), '')

    SolvePuzzleByBruteForce()
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min // The maximum is inclusive and the minimum is inclusive
}

function FindCellWithFewestPossibleValues() {
    let min = 9
    let row = 0
    let col = 0
    scanGrid((r, c) => {
        if (actual[r][c] === 0 && possible[r][c].length < min) {
            min = possible[r][c].length
            row = r
            col = c
        }
    })
    return { row, col }
}

function scanMinigrid(r, c, callback) {
    let startR = r - ((r) % 3)
    let startC = c - ((c) % 3)
    for (let cc = startC; cc <= startC + 2; cc++) {
        for (let rr = startR; rr <= startR + 2; rr++) {
            callback(rr, cc)
        }
    }
}

function scanGrid(callback) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            callback(r, c)
        }
    }
}

function baseCheckBoard() {
    scanGrid((r, c) => {
        if (actual[r][c] == 0 && possible[r][c] == '') {
            throw 'error'
        }
    })
}

function reportBadMove() {
    let r
    let c
    let str = ''

    for (c = 0; c < 9; c++) {
        str = ''
        for (r = 0; r < 9; r++) {
            if (!str.includes(actual[r][c].toString()) && actual[r][c] != 0) {
                str += actual[r][c].toString()
            } else if (actual[r][c] != 0) {
                return true
            }
        }
    }

    // check column by column
    for (r = 0; r < 9; r++) {
        str = ''
        for (c = 0; c < 9; c++) {
            if (!str.includes(actual[r][c].toString()) && actual[r][c] != 0) {
                str += actual[r][c].toString()
            } else if (actual[r][c] != 0) {
                return true
            }
        }
    }

    // check minigrid
    for (r = 0; r < 9; r += 3) {
        for (c = 0; c < 9; c += 3) {
            str = ''
            for (var rr = 0; rr <= 2; rr++) {
                for (var cc = 0; cc <= 2; cc++) {
                    let act = actual[r + rr][c + cc]
                    let actString = act.toString()

                    if (!str.includes(actString) && act != 0) {
                        str += actString
                    } else if (str.includes(act.toString()) && act != 0) {
                        return true
                    }
                }
            }
        }
    }

    return false
}

function setNumberToActual(row, col, value, caller) {
    if (value == 'NaN') {
        throw 'error'
    }

    actual[row][col] = value
    possible[row][col] = ' '

    if (reportBadMove()) {
        console.log('fk', row, col, value, caller)
    }
}

export default launch
export { launch }
