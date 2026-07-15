import React from 'react';
import { Select, SelectItem } from '@carbon/react';

/**
 * PlayerSelect
 *
 * Props:
 *   players  – array of player objects from players.json
 *   value    – currently selected player name (string)
 *   onChange – called with the player name string when selection changes
 */
function PlayerSelect({ players, value, onChange }) {
  function handleChange(e) {
    onChange(e.target.value);
  }

  return (
    <Select
      id="player-select"
      labelText="Select a player"
      value={value}
      onChange={handleChange}
    >
      <SelectItem value="" text="Select a player..." />
      {players.map((player) => (
        <SelectItem
          key={player.name}
          value={player.name}
          text={player.name}
        />
      ))}
    </Select>
  );
}

export default PlayerSelect;
