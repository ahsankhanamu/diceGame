import React, { useState, useEffect, useCallback } from "react"
import Table from "./Table"
import game from "./lib/diceGame"

let diceGame = new game()
function App() {
  const [gameStartBool, setGameStartBool] = useState(false)
  const [activePlayers, setActivePlayers] = useState([])
  const [gameOver, setGameOver] = useState(false)
  const [winners, setWinners] = useState([])
  const [messages, setMessages] = useState([])
  const [diceRollCounter, setDiceRollCounter] = useState(0)
  const [diceGameState, setDiceGameState] = useState({})

  useEffect(() => {
    setActivePlayers(diceGame.activePlayers)
    setMessages(diceGame.messages)
    setDiceGameState(diceGame.getState())
  }, [diceRollCounter])

  useEffect(() => {
    document.addEventListener("keydown", keyBoardHandler)
    return () => {
      document.removeEventListener("keydown", keyBoardHandler)
    }
  }, [])

  useEffect(() => {
    setDiceGameState(diceGame.getState())
    setWinners(diceGame.winners)
    setGameOver(diceGame.gameOver)
  }, [activePlayers.length])

  var keyBoardHandler = useCallback(function (e) {
    if (e.code === "KeyS") {
      gameStart()
    }
    if (e.code === "KeyR") {
      handleDiceRoll()
    }
  }, [])
  function gameStart() {
    let playerNum, targetScore
    let prompter = prompt(
      "Please enter number of players, and target score seperated by comma"
    )
    if (prompter != null && /,/.test(prompter)) {
      let values = prompter.split(",")
      playerNum = parseInt(values[0].trim())
      targetScore = parseInt(values[1].trim())
    }
    if (playerNum > 1 && targetScore) {
      diceGame.start(playerNum, targetScore)
      setActivePlayers(diceGame.activePlayers)
      setMessages(diceGame.messages)
      setDiceGameState(diceGame.getState())
      // console.log("diceGame", diceGame)
      setGameStartBool(true)
    } else {
      gameStart()
    }
  }
  function handleDiceRoll() {
    diceGame.rollDice()
    setDiceRollCounter((prev) => prev + 1)
  }
  return (
    <div className='App'>
      <div className='flex-container'>
        <div className='dice-wrapper flex-item-left'>
          <h2 htmlFor='move-history'>Dice Moves History</h2>
          <ul>
            {messages.map((el, idx) => (
              <li key={`li-${idx}`}>{el}</li>
            ))}
          </ul>
          <p></p>
          {diceGameState.diceVal && (
            <img
              src={`imgs/dice-0${diceGameState.diceVal}.svg`}
              alt='Game dice'
            />
          )}
          <div>
            {diceGameState.gameStarted && (
              <p style={{ display: "block" }}>
                {diceGameState.diceVal
                  ? `Dice Value: ${diceGameState.diceVal}`
                  : 'Please roll the Dice | Press "R" to Roll'}
              </p>
            )}
            <p style={{ display: "block" }}>
              {diceGameState.gameStarted
                ? `Target Score: ${diceGameState.targetScore}`
                : 'Please start the Game | Press "s" to start'}
            </p>
          </div>
          <div>
            <button onClick={gameStart}>Start Game</button>
            <button onClick={handleDiceRoll} disabled={gameOver}>
              Roll Dice
            </button>
          </div>
        </div>
        <div className='flex-item-right'>
          {winners.length ? (
            <>
              <Table players={winners} showRank={true} caption={"Winners"} />
            </>
          ) : (
            <h1>Play to win</h1>
          )}
          {gameStartBool && (
            <>
              <Table
                className='flex-item-'
                players={activePlayers}
                showRank={false}
                caption={"Active Players"}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
