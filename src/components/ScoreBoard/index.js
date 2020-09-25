import React, { useState } from 'react'
import styled from 'styled-components'

import {
  GAME_STATUS_ALIVE,
  GAME_STATUS_DEAD,
  GAME_STATUS_WIN
} from '../../consts'

const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`

const Remaining = styled.div`
`

const Status = styled.div`
font-size: 36px;
`

const STATUS_ICONS = {
  [GAME_STATUS_ALIVE]: <span role='img'>😃</span>,
  [GAME_STATUS_DEAD]: <span role='img'>Game Over 😵</span>,
  [GAME_STATUS_WIN]: <span role='img'>You Won! 😸</span>
}

const ScoreBoard = ({ boardState, gameStatus }) => {
  
  return (
    <Wrapper>
      <Remaining>
        {boardState.remainingMines} mines left
      </Remaining>
      <Status>
        {STATUS_ICONS[gameStatus]}
      </Status>
    </Wrapper>
  )
}

export default ScoreBoard