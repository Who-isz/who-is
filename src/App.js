import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const categories = ["Who is smarter?", "Who is richer?", "Who is cooler?"];

function App() {
  const [category, setCategory] = useState(categories[0]);
  const [view, setView] = useState("vote");
  const [pair, setPair] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    if (view === "vote") loadImages();
    else loadLeaderboard();
  }, [category, view]);

  const loadImages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/images?category=${encodeURIComponent(category)}`
      );
      setPair(res.data);
    } catch (err) {
      console.error("Image load failed", err);
    }
  };

  const vote = async (winner, loser) => {
    await axios.post("http://localhost:5000/api/vote", {
      winner,
      loser,
      category,
    });
    loadImages();
  };

  const loadLeaderboard = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/leaderboard?category=${encodeURIComponent(
          category
        )}`
      );
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Leaderboard load failed", err);
    }
  };

  return (
    <div className="App" style={{ textAlign: "center", padding: "2rem" }}>
      <h1>{category}</h1>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <div>
        <button onClick={() => setView("vote")}>Vote</button>
        <button onClick={() => setView("leaderboard")}>Leaderboard</button>
      </div>

      {view === "vote" && pair.length === 2 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "4rem", marginTop: "2rem" }}>
          {pair.map((p) => (
            <div key={p.name} onClick={() => vote(p.name, pair.find((x) => x !== p).name)}>
              <img src={p.image} alt={p.name} width="200" height="200" />
              <h3>{p.name}</h3>
            </div>
          ))}
        </div>
      )}

      {view === "leaderboard" && (
        <div>
          <h2>{category} Leaderboard</h2>
          <table style={{ margin: "auto" }}>
            <thead>
              <tr>
                <th>Person</th>
                <th>ELO</th>
                <th>Wins</th>
                <th>Losses</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((p) => (
                <tr key={p.name}>
                  <td style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img src={p.image} alt="" />
                    {p.name}
                  </td>
                  <td>{p.elo}</td>
                  <td>{p.wins}</td>
                  <td>{p.losses}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
