import React, { useState, useCallback } from 'react';
import { Button } from '@carbon/react';
import AppHeader from './components/Header/Header';
import PlayerSelect from './components/PlayerSelect/PlayerSelect';
import PlayerCard from './components/PlayerCard/PlayerCard';
import WikiSummary from './components/WikiSummary/WikiSummary';
import FormationBoard from './components/FormationBoard/FormationBoard';
import { generateRandomTeam } from './utils/teamGenerator';
import players from './data/players.json';
import './App.scss';

function App() {
  const [currentPage, setCurrentPage]   = useState('browser');
  const [selectedName, setSelectedName] = useState('');
  const [teamPlayers, setTeamPlayers]   = useState([]);

  const selectedPlayer = players.find((p) => p.name === selectedName) || null;

  const handleGenerateTeam = useCallback(() => {
    setTeamPlayers(generateRandomTeam(players));
  }, []);

  return (
    <>
      <AppHeader currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="app">
        {currentPage === 'browser' && (
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
        )}

        {currentPage === 'formation' && (
          <main className="app__main app__main--formation">
            <h1 className="app__formation-title">Team Formation Visualizer</h1>
            <div className="app__formation-actions">
              <Button kind="primary" onClick={handleGenerateTeam}>
                Generate Random Team
              </Button>
            </div>
            <div className="app__formation-board">
              <FormationBoard players={teamPlayers} />
            </div>
          </main>
        )}
      </div>
    </>
  );
}

export default App;
