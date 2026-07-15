import React, { useState } from 'react';
import PlayerSelect from './components/PlayerSelect/PlayerSelect';
import PlayerCard from './components/PlayerCard/PlayerCard';
import WikiSummary from './components/WikiSummary/WikiSummary';
import players from './data/players.json';
import './App.scss';

function App() {
  const [selectedName, setSelectedName] = useState('');

  const selectedPlayer = players.find((p) => p.name === selectedName) || null;

  return (
    <div className="app">
      <header className="app__header">
        <h1>Player Dashboard</h1>
      </header>
      <main className="app__main">
        <div className="app__selector">
          <PlayerSelect
            players={players}
            value={selectedName}
            onChange={setSelectedName}
          />
        </div>
        <PlayerCard player={selectedPlayer} />
        <WikiSummary player={selectedPlayer} />
      </main>
    </div>
  );
}

export default App;
