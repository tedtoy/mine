import React, { useState } from 'react'
import styled from 'styled-components'

import Cell from '../Cell'


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`



const RowWrapper = styled.div`
  display: flex;
`

const Board = ({ boardState, killGame, winGame }) => {
    
  const {
    cellMatrix,
    toggleFlag,
    clickCell,
    getNearbyMineCount
  } = boardState

  return (
    <Wrapper>
      {cellMatrix.map((row, r) => (
        <RowWrapper key={`row-${r}`}>
          {row.map((cell, c) => (
            <Cell 
              key={`row-${r}-col-${c}`}
              cell={cell}
              rowIndex={r}
              columnIndex={c}
              toggleFlag={toggleFlag}
              clickCell={clickCell}
              killGame={killGame}
              winGame={winGame}
              getNearbyMineCount={getNearbyMineCount}
            />
          ))}
        </RowWrapper>
      ))}
    </Wrapper>
  )
}

export default Board