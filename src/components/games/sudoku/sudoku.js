import Phaser from 'phaser'
import eventDispatcher from '../../../components/helpers/eventDispatcher.js'

/* eslint-disable */

let tileDim = 32
let canvasDimension = {
  x: tileDim * 9 + 50,
  y: tileDim * 9 + 150
}

let padding = {
  top: -70,
  left: -20
}

let boardAnchor = {
  x: (canvasDimension.x - 9 * tileDim) / 2 + padding.left,
  y: (canvasDimension.y - 9 * tileDim) / 2 + padding.top
}

let boardEnd = {
  x: boardAnchor.x + tileDim * 9,
  y: boardAnchor.y + tileDim * 9
}

function launch (containerId) {
  let config = {
    type: Phaser.AUTO,
    parent: containerId,
    width: canvasDimension.x,
    height: canvasDimension.y,
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  }
  return new Phaser.Game(config)
}

// grid variables
let map
let gridLayer
let marker
let worldPoint
let timer
let startTime
let elapsedTime
let newGameBtn
let timeNow
let keys = []
let numbers = []
let emitter

// sudoku variables
let actual
let possible
let actualStack
let possibleStack
let wrongActualsStack
let easySettings = [
  [0, 0], [0, 3], [0, 8],
  [1, 2], [1, 4], [1, 5], [1, 8],
  [2, 0], [2, 1], [2, 3], [2, 5], [2, 6], [2, 7],
  [3, 3], [3, 4], [3, 5], [3, 6],
  [5, 2], [5, 3], [5, 4], [5, 5],
  [6, 1], [6, 2], [6, 3], [6, 5], [6, 7], [6, 8],
  [7, 0], [7, 3], [7, 4], [7, 6],
  [8, 0], [8, 5], [8, 8]
]

let totalScore

// grid methods
function preload () {
  let self = this

  let path = 

  self.load.image('tiles', '@/components/gridtiles.png', { frameWidth: tileDim, frameHeight: tileDim })
    self.load.image('minigrid', '@/assets/miniGrid.png')
    self.load.image('bg', '../../../assers/sky4.png')
}

function create () {
  let self = this

  self.add.image(canvasDimension.x / 2, canvasDimension.y / 2, 'bg')

  self.emitter = eventDispatcher.getInstance()

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

  map = self.make.tilemap({ data: level, tileWidth: tileDim, tileHeight: tileDim })
  let tiles = map.addTilesetImage('tiles')
  gridLayer = map.createDynamicLayer(0, tiles, 0, 0)
    .setPosition(boardAnchor.x, boardAnchor.y)

  worldPoint = self.input.activePointer.position;

  // add num keyboard
  keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace']

  let colorsConfig = {
    minigridLines: '0x5DADE2',
    text: 'white'
  }

  let textConfig = {
    fontFamily: 'Source Sans Pro',
    // fontStyle: 'Extra-light 200',
    fontSize: '18px',
    color: colorsConfig.text
  }

  // create minigrid lines

  let lineVert1 = self.add.line(
    0,
    0,
    boardAnchor.x + 3 * tileDim,
    boardAnchor.y,
    boardAnchor.x + 3 * tileDim,
    boardAnchor.y + 9 * tileDim,
    colorsConfig.minigridLines)
    .setOrigin(0, 0)

  let lineVert2 = self.add.line(
    0,
    0,
    boardAnchor.x + 6 * tileDim,
    boardAnchor.y,
    boardAnchor.x + 6 * tileDim,
    boardAnchor.y + 9 * tileDim,
    colorsConfig.minigridLines)
    .setOrigin(0, 0)

  let lineHor1 = self.add.line(
    0,
    0,
    boardAnchor.x,
    boardAnchor.y + 3 * tileDim,
    boardAnchor.x + 9 * tileDim,
    boardAnchor.y + 3 * tileDim,
    colorsConfig.minigridLines)
    .setOrigin(0, 0)

  let lineHor2 = self.add.line(
    0,
    0,
    boardAnchor.x,
    boardAnchor.y + 6 * tileDim,
    boardAnchor.x + 9 * tileDim,
    boardAnchor.y + 6 * tileDim,
    colorsConfig.minigridLines)
    .setOrigin(0, 0)

    // add grid array
  gridLayer.forEachTile(function (tile) {
    let textX = Math.floor(tile.pixelX + tile.width / 2 + boardAnchor.x)
    let textY = Math.floor(tile.pixelY + tile.height / 2 + boardAnchor.y)

    numbers[tile.x + 'x' + tile.y] = self.add.text(textX, textY, '', textConfig)
    numbers[tile.x + 'x' + tile.y].setOrigin(0.5, 0.5)
  })

  timer = self.add.text(150, 300)

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
  })

  self.input.keyboard.on('keydown',
    function (event) {
      if (keys.includes(event.key)) {
        gridLayer.forEachTile(function (tile) {
          if (tile.index == 2) {
            if (event.key === 'Backspace') {
              numbers[tile.x + 'x' + tile.y].setText('')
            } else {
              numbers[tile.x + 'x' + tile.y].setText(event.key)
            }
          }
        })
      }
    })

  self.emitter.on('newGame', startNewGame)
  CreateMarker(self)
  startNewGame()
}

function update () {
  let self = this

  updateTimer()

  UpdateMarker(self.input.mousePointer)
}

function updateTimer () {
  timeNow = new Date()

  let timeDiff = (timeNow.getTime() - startTime.getTime())

  elapsedTime = Math.abs(timeDiff / 1000)

  var elapsedMin = Math.floor(elapsedTime / 60)

  var elapsedSec = Math.floor(elapsedTime - (60 * elapsedMin))

  timer.setText(elapsedMin + ':' + elapsedSec)
}

function startNewGame () {
  actual = Array(9).fill('').map(() => Array(9).fill(0))
  possible = Array(9).fill('').map(() => Array(9).fill(''))
  actualStack = new Array()
  possibleStack = new Array()
  wrongActualsStack = new Array()
  resetBoard()
  GenerateNewPuzzle()
  startTime = new Date()
}

function resetBoard () {
  gridLayer.forEachTile(function (tile) {
    if (tile.index == 2) {
      gridLayer.putTileAt(1, tile.x, tile.y)
    }
  })
}

function UpdateMarker (worldPoint) {
  let pointerTyleXY = gridLayer.worldToTileXY(worldPoint.x, worldPoint.y)
  let snappedWorldPoint = gridLayer.tileToWorldXY(pointerTyleXY.x, pointerTyleXY.y)

  if ((worldPoint.x >= boardAnchor.x && worldPoint.x <= boardEnd.x) && (worldPoint.y >= boardAnchor.y && worldPoint.y <= boardEnd.y)) {
    marker.setPosition(snappedWorldPoint.x - boardAnchor.x, snappedWorldPoint.y - boardAnchor.y)
  }
}

function CreateMarker (self) {
  marker = self.add.graphics()
  marker.lineStyle(2, 0x000000, 1)
  marker.strokeRect(boardAnchor.x, boardAnchor.y, tileDim, tileDim)
}

// sudoku methods

function SetDifficulity (difficulity) {
  scanGrid((r, c) => {
    let occurence = false
    for (var i in difficulity) {
      let x = difficulity[i][0]
      let y = difficulity[i][1]
      if (x == r && y == c) {
        occurence = true
        break
      }
    }
    if (!occurence) {
      actual[r][c] = 0
    }
  })
}

function SolveSudoku () {
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

function IsSudokuSolved () {
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

function CalculatePossibleValues (row, col) {
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

function CheckColumnsAndRows () {
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
function LookForLoneRangersinMinigrids () {
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

function LookForLoneRangersinRows () {
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

function LookForLoneRangersinColumns () {
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
function LookForTwinsinMinigrids () {
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

function LookForTwinsinRows () {
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
function LookForTwinsinColumns () {
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
function LookForTripletsinMinigrids () {
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
function LookForTripletsinRows () {
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
function LookForTripletsinColumns () {
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

function GenerateNewPuzzle () {
  if (!SolveSudoku()) {
    SolvePuzzleByBruteForce()
  }
  SetDifficulity(easySettings)
  PrintOutPuzzleOnTheBoard()
}

function PrintOutPuzzleOnTheBoard () {
  scanGrid((r, c) => {
    if (actual[r][c] != 0) {
      numbers[c + 'x' + r].setText(actual[r][c])

      let tile = gridLayer.getTileAt(c, r)
      tile.index = 1
    }
  })
}

function SolvePuzzleByBruteForce () {
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
    console.log(error)
    DealWithFailAfterBruteForce()
  }
}

function BruteForceNumber (row, col, value) {
  let wrongActual = [row, col, value]

  let actualClone = JSON.parse(JSON.stringify(actual))
  actualStack.push(actualClone)
  let possibleClone = JSON.parse(JSON.stringify(possible))
  possibleStack.push(possibleClone)

  wrongActualsStack.push(wrongActual)

  setNumberToActual(row, col, value, 0)
}

function DealWithFailAfterBruteForce () {
  let wrongNumber = wrongActualsStack.pop()
  let wrongNumberRow = wrongNumber[0]
  let wrongNumberCol = wrongNumber[1]
  let wrongNumberValue = wrongNumber[2]

  actual = actualStack.pop()
  possible = possibleStack.pop()
  possible[wrongNumberRow][wrongNumberCol] = possible[wrongNumberRow][wrongNumberCol].replace(wrongNumberValue.toString(), '')

  SolvePuzzleByBruteForce()
}

function getRandomIntInclusive (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min // The maximum is inclusive and the minimum is inclusive
}

function FindCellWithFewestPossibleValues () {
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
  return {row, col}
}

function scanMinigrid (r, c, callback) {
  let startR = r - ((r) % 3)
  let startC = c - ((c) % 3)
  for (let cc = startC; cc <= startC + 2; cc++) {
    for (let rr = startR; rr <= startR + 2; rr++) {
      callback(rr, cc)
    }
  }
}

function scanGrid (callback) {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      callback(r, c)
    }
  }
}

function baseCheckBoard () {
  scanGrid((r, c) => {
    if (actual[r][c] == 0 && possible[r][c] == '') {
      throw 'error'
    }
  })
}

function reportBadMove () {
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

function setNumberToActual (row, col, value, caller) {
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
