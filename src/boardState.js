import { useState } from 'react'

// So I dont forget what my object looks like
// interface Cell {
//   randomId: Number,
//   isMine: Boolean,
//   isFlagged: Boolean,
//   isClicked: Boolean
// }

// This could be configurable from the UI, but I didnt have time
const BOARD_SETTINGS = {
  height: 8,
  width: 12,
  initialMineCount: 12
}

export const createCellsWithMines = (boardSettings) => {
  const { height, width, initialMineCount: mineCount } = boardSettings
  // A boring for-loop might be the easiest/most performant here
  console.log(`creating ${height * width} cells with ${mineCount} random mines`)
  let cells = []
  let remainingMines = mineCount
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      let isMine = false
      if (remainingMines > 0) {
        isMine = true
        remainingMines -= 1
      }
      cells.push({
        id: Math.random(),
        isMine,
        isFlagged: false,
        isClicked: false
      })
    }
  }

  return cells.sort((a,b) => (a.id > b.id) ? 1 : -1)
}

const mapCellsToRows = (cells, boardSettings) => new Array(boardSettings.height).fill(0)
  .map((row, rowIndex) => {
    return new Array(boardSettings.width).fill(0)
      .map((column, columnIndex) => {
        const cell = cells.shift()
        return {
          ...cell,
          rowIndex,
          columnIndex
        }
      })
  })

const cells = createCellsWithMines(BOARD_SETTINGS)
const initialState = mapCellsToRows(cells, BOARD_SETTINGS)

export const useBoardState = () => {

   const [cellMatrix, setCellMatrix] = useState(initialState)
   const [remainingMines, setRemainingMines] = useState(BOARD_SETTINGS.initialMineCount)
 
   const updateCell = (rowIndex, columnIndex, newValues={}) => {
     const updatedRows = cellMatrix.map((row, r) => {
       if (r === rowIndex) {
         const updatedColumns = row.map((cell, c) => {
           if (c === columnIndex) {
             return {
               ...cell,
               ...newValues
             }
           } else {
             return cell
           }
         })
         return updatedColumns
       } else {
         return row
       }
     })
 
     setCellMatrix(updatedRows)
   }

  const decreaseMineCount = () => setRemainingMines(remainingMines - 1) // TODO: boundary error handling
  const increaseMineCount = () => setRemainingMines(remainingMines + 1) // TODO: boundary error handling
 
  const toggleFlag = (r, c, cell) => {
    if (cell.isFlagged) {
      increaseMineCount()
    } else {
      decreaseMineCount()
    }
    updateCell(r, c, {isFlagged: !cell.isFlagged})
  } 

  const clickCell = (r, c) => {

    const cell = cellMatrix[r][c]
    const batchIds = [cell.id]
    
    if (!cell.isMine) {
      const allAdjacent = findAllAdjacent(r, c)
      allAdjacent.forEach((adjacentCell) => {
        const { rowIndex, columnIndex } = adjacentCell
        updateCell(rowIndex, columnIndex, {isClicked: true})
      })
      allAdjacent.forEach(c => batchIds.push(c.id))
    }
    batchClick(batchIds)
  }

  const batchClick = (cellIds) => {
    const updatedMatrix = cellMatrix.map(row => {
      return row.map(cell => {
        const isClicked = !cell.isClicked
          ? (cellIds.includes(cell.id))
          : cell.isClicked
        return {
          ...cell,
          isClicked
        }
      })
    })
    setCellMatrix(updatedMatrix)
  }

  const findAdjacentCells = (r, c) => {
    let left = (c - 1) < 0 ? 0 : (c - 1)
    let right = (c + 1) > BOARD_SETTINGS.width ? BOARD_SETTINGS.width : (c + 1)
    let top = (r - 1) < 0 ? 0 : r - 1
    let bottom = (r + 1)  > BOARD_SETTINGS.height ? BOARD_SETTINGS.height : (r + 1)
    const rows = cellMatrix.slice(top, bottom + 1)
    const adjacent = rows.reduce((acc, row) => {
      const columns = row.slice(left, right + 1)
      columns.reduce((acc, cell) => {
        if (!((cell.rowIndex === r) && (cell.columnIndex === c))) {
          acc.push(cell)
        }
        return acc
      }, acc)
      return acc
    }, [])

    return adjacent
  }

  const findAllAdjacent = (r, c, acc=[], visited={}) => {
    const cell = cellMatrix[r][c] 
    if (cell.id in visited) return acc

    visited[cell.id] = true

    const adjacent = findAdjacentCells(r, c)
    const hasMinesNearby = adjacent.some(cell => cell.isMine)

    if (hasMinesNearby) {
      return acc
    } else {
      adjacent.forEach((adjacentCell) => {
        const {id, rowIndex, columnIndex} = adjacentCell
          acc.push(adjacentCell)        
          return findAllAdjacent(rowIndex, columnIndex, acc, visited)
      })
    }
    return acc
  }

  const getNearbyMineCount = (r, c) => {
    const adjacentCells = findAdjacentCells(r, c)
    const mineCount = adjacentCells.filter(c => c.isMine).length
    return mineCount
  }

  return {
    toggleFlag,
    clickCell,
    cellMatrix,
    remainingMines,
    decreaseMineCount,
    increaseMineCount,
    getNearbyMineCount
  }
}