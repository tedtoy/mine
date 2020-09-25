import React, { useState } from 'react';
import styled from 'styled-components'

const CELL_SIZE = 24

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${CELL_SIZE}px;
  height: ${CELL_SIZE}px;
  border: 1px solid #ccc;
  background-color: #888;
  ${props => props.isFlagged && `
    background-color: #E6E3CA;
  `}
  ${props => props.isMine && `
    // border-bottom: 1px solid red;
  `}
  ${props => props.isClicked && `
    background-color: #eee;
  `}
  ${props => (props.isClicked && props.isMine)  && `
    background-color: red;
  `}
`

const Cell = ({ 
    cell, 
    columnIndex,
    rowIndex,
    toggleFlag,
    clickCell,
    killGame,
    winGame,
    getNearbyMineCount
  }) => {

  const {
    isMine,
    isFlagged,
    isClicked,
  } = cell

  const handleLeftClick = (e) => {
    e.preventDefault()
    if (isClicked || isFlagged) return 

    if (e.type === 'click') {
      if (isMine) {
        clickCell(rowIndex, columnIndex)
        killGame()
      } else {
        clickCell(rowIndex, columnIndex)
      }
    } 
  }

  const handleRightClick = (e) => {
    e.preventDefault()
    toggleFlag(rowIndex, columnIndex, cell)
    return false
  }

  const nearbyMineCount = getNearbyMineCount(rowIndex, columnIndex) 

  return (
    <Wrapper 
      isFlagged={isFlagged}
      isMine={isMine}
      isClicked={isClicked}
      onClick={handleLeftClick} 
      onContextMenu={handleRightClick}
    >
      {(isClicked && isMine) && (
        <span role='img'>💣</span>
      )}
      {isFlagged && (
        <span role='img'>🚩</span>
      )}
      {/* {(nearbyMineCount !== 0) && (
        {nearbyMineCount}
      )} */}
      {(isClicked && (nearbyMineCount !== 0)) && (
        <span>{nearbyMineCount}</span>
      )}
    </Wrapper>
  )
}

export default Cell