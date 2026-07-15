import React, { useState } from 'react';
import PlayerSelect from './components/PlayerSelect/PlayerSelect';
import players from './data/players.json';
import './App.scss';

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  return (
    <div className="app">
      <header className="app__header">
        <h1>Player Dashboard</h1>
      </header>
      <main className="app__main">
        <div className="app__selector">
          <PlayerSelect
            players={players}
            value={selectedPlayer}
            onChange={setSelectedPlayer}
          />
          {selectedPlayer && (
            <p className="app__selection-label">
              Selected: <strong>{selectedPlayer}</strong>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
