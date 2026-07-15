import React, { useState, useCallback } from 'react';
import { Button } from '@carbon/react';
import PlayerSelect from './components/PlayerSelect/PlayerSelect';
import PlayerCard from './components/PlayerCard/PlayerCard';
import WikiSummary from './components/WikiSummary/WikiSummary';
import FormationBoard from './components/FormationBoard/FormationBoard';
import players from './data/players.json';
import './App.scss';

/** Pick `n` distinct players at random from the full list. */
function pickRandom(list, n) {
  const shuffled = [...list].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function App() {
  const [selectedName, setSelectedName] = useState('');
  const [teamPlayers, setTeamPlayers] = useState([]);

  const selectedPlayer = players.find((p) => p.name === selectedName) || null;

  const handleGenerateTeam = useCallback(() => {
    setTeamPlayers(pickRandom(players, 11));
  }, []);

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

        <div className="app__formation">
          <div className="app__formation-header">
            <h2 className="app__formation-title">Team Formation</h2>
            <Button kind="primary" size="sm" onClick={handleGenerateTeam}>
              Generate Random Team
            </Button>
          </div>
          <FormationBoard players={teamPlayers} />
        </div>
      </main>
    </div>
  );
}

export default App;
