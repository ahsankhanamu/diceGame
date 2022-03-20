import React from "react"

function Table({ players, showRank = true, caption }) {
  return (
    <table>
      <caption
        style={{
          marginBottom: "0.5rem",
          fontStyle: "italic",
          textAlign: "left",
        }}>
        {caption}
      </caption>
      <thead>
        <tr>
          <th>Player Name</th>
          <th>Score</th>
          {showRank && <th>Rank</th>}
        </tr>
      </thead>
      <tbody>
        {players.map((player, idx) => {
          return (
            <tr key={idx}>
              <td>{player?.name}</td>
              <td>{player?.score}</td>
              {showRank && <td>{player?.rank}</td>}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default Table
