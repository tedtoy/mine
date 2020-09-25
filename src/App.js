import React, { useState } from 'react'
import styled from 'styled-components'

import Board from './components/Board'
import ScoreBoard from './components/ScoreBoard'

import {
  useBoardState
} from './boardState'

import './App.css';

import {
  GAME_STATUS_ALIVE,
  GAME_STATUS_DEAD,
  GAME_STATUS_WIN
} from './consts'

const Wrapper = styled.div`
  width: 100%;
`
function App() {

  const boardState = useBoardState()
  const [gameStatus, setGameStatus] = useState(GAME_STATUS_ALIVE)

  const killGame = () => setGameStatus(GAME_STATUS_DEAD)
  const winGame = () => setGameStatus(GAME_STATUS_WIN)

  return (
    <div className="App">
      <Wrapper>
        <ScoreBoard
          boardState={boardState}
          gameStatus={gameStatus}
        />
        <Board
          boardState={boardState}
          killGame={killGame}
          winGame={winGame}
        />
        
      </Wrapper>
    </div>
  );
}

export default App;
