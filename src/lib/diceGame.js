function getRandomIntInc(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}

function Players() {
  this.activePlayers = []
  this.winners = []
  this.lastPlayer = false
  this.gameStarted = false
  this.gameOver = false
  this.messages = []
  this.diceVal = undefined
  this.targetScore = undefined
  this.currentPlayerIdx = undefined
  this.currentPlayer = undefined
  this.nextPlayerIdx = undefined
  this.nextPlayer = undefined
  this.state = {
    activePlayers: this.activePlayers,
    targetScore: this.targetScore,
    winners: this.winners,
    lastPlayer: this.lastPlayer,
    gameStarted: this.gameStarted,
    gameOver: this.gameOver,
    diceVal: this.diceVal,
    nextPlayerIdx: this.nextPlayerIdx,
    nextPlayer: this.nextPlayer,
    currentPlayerIdx: this.currentPlayerIdx,
    currentPlayer: this.currentPlayer,
    messages: this.messages,
  }
  this.getState = function () {
    return this.state
  }
  this.setState = function () {
    let state = {
      activePlayers: this.activePlayers,
      targetScore: this.targetScore,
      winners: this.winners,
      lastPlayer: this.lastPlayer,
      gameStarted: this.gameStarted,
      gameOver: this.gameOver,
      diceVal: this.diceVal,
      nextPlayerIdx: this.nextPlayerIdx,
      nextPlayer: this.nextPlayer,
      currentPlayerIdx: this.currentPlayerIdx,
      currentPlayer: this.currentPlayer,
      messages: this.messages,
    }
    this.state = state
  }
  this.start = function (playersNum, targetScore) {
    this.gameStarted = true
    this.gameOver = false
    this.lastPlayer = false
    this.winners = []
    this.messages = []
    this.activePlayers = Array.from({ length: playersNum }, (v, i) => {
      return {
        name: "Player-" + (i + 1),
        score: 0,
        won: false,
        lastMove: undefined,
        skipTurn: false,
      }
    })
    this.targetScore = targetScore
    this.currentPlayerIdx = getRandomIntInc(0, this.activePlayers.length - 1)
    this.currentPlayer = this.activePlayers[this.currentPlayerIdx]
    this.setMessage(
      `${this.currentPlayer.name}, It's your chance to roll the Dice`
    )
    return
  }
  this.setMessage = function (msg) {
    this.setState()
    let timerId
    timerId = setInterval(() => {
      if (this.messages.length > 1) {
        this.messages.shift()
        clearInterval(timerId)
      }
    }, 5000)
    this.messages.push(msg)
  }
  this.getMessage = function () {
    return this.messages
  }
  this.nextPlayerIdxFunc = function () {
    let _nextPlayerIdx
    let currentPlayerIdx = this.currentPlayerIdx
    if (currentPlayerIdx < this.activePlayers.length - 1) {
      this.currentPlayerIdx = currentPlayerIdx + 1
      _nextPlayerIdx = this.currentPlayerIdx
    }
    if (currentPlayerIdx >= this.activePlayers.length - 1) {
      //reset value of currentPlayerIdx if anyway it goes equal to or beyond the last player
      this.currentPlayerIdx = 0
      _nextPlayerIdx = this.currentPlayerIdx
    }
    return _nextPlayerIdx
  }
  this.skipper = function () {
    let skip = this.activePlayers[this.currentPlayerIdx].skipTurn
    while (skip) {
      if (skip) {
        this.activePlayers[this.currentPlayerIdx].skipTurn = false
      }
      skip = this.activePlayers[this.nextPlayerIdxFunc()].skipTurn
    }
    return
  }
  this.nextEligiblePlayer = function () {
    let playerIdx = this.nextPlayerIdxFunc()
    let nextPlayerIdx, nextPlayer
    if (!this.activePlayers[playerIdx].skipTurn) {
      nextPlayerIdx = playerIdx
      nextPlayer = this.activePlayers[playerIdx]
    }
    if (this.activePlayers[playerIdx].skipTurn) {
      this.skipper()
      nextPlayerIdx = this.currentPlayerIdx
      nextPlayer = this.activePlayers[this.currentPlayerIdx]
    }
    if (!this.gameOver) {
      this.setMessage(`${nextPlayer.name}, It's your turn to roll the Dice`)
    }
    this.nextPlayerIdx = nextPlayerIdx
    this.nextPlayer = nextPlayer
    return nextPlayer
  }
  this.addScoreCheckWin = function (diceVal) {
    let player = this.activePlayers[this.currentPlayerIdx]
    if (this.gameOver) {
      return
    }
    let finalScore = player.score + diceVal
    player.lastMove = diceVal
    if (this.targetScore > finalScore) {
      player.score = finalScore
    }
    if (this.targetScore === finalScore) {
      player.score = finalScore
      this.setMessage(`Congratulations ${player.name} has won the Game`)
      player.won = true
      player.rank = this.winners.length + 1
      this.winners.push(...this.activePlayers.splice(this.currentPlayerIdx, 1))
      if (this.activePlayers.length === 1) {
        this.setMessage("Game Over")
        this.gameOver = true
        this.lastPlayer = true
        this.gameStarted = false
      }
    }
    if (diceVal !== 6 || player.won || this.gameOver) {
      this.nextEligiblePlayer()
    }
    return player
  }
  this.rollDice = function () {
    let player = this.activePlayers[this.currentPlayerIdx]
    let { lastMove, name } = player
    let diceVal = getRandomIntInc(1, 6)
    this.diceVal = diceVal
    if (this.gameOver) {
      this.setMessage(`Game already over, Tata Bye Bye ${name} lost the Game`)
      return
    }
    if (diceVal === 1) {
      if (lastMove === diceVal) {
        player.skipTurn = true
        this.setMessage(`${name} will loose their next turn as penalty`)
      }
      this.addScoreCheckWin(diceVal)
    }
    if (diceVal === 6) {
      let player = this.addScoreCheckWin(diceVal)
      if (!player.won) {
        //if still not won, then let them rollDice again
        this.setMessage(`Hurray...! ${name} you got one more chance`)
      }
    } else {
      this.addScoreCheckWin(diceVal)
    }
    // this.setMessage("Current Player score after rolling dice", { ...player })
  }
}
export default Players
