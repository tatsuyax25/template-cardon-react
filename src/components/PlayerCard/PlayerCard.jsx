import React from 'react';
import { Tile } from '@carbon/react';
import './PlayerCard.scss';

const FALLBACK = '—';

function stat(value) {
  return value !== null && value !== undefined && value !== '' ? value : FALLBACK;
}

function formatRating(rating) {
  if (rating === null || rating === undefined) return FALLBACK;
  return `${parseFloat(rating).toFixed(1)} / 10`;
}

function PlayerCard({ player }) {
  if (!player) return null;

  const rows = [
    { label: 'Position',    value: stat(player.position)   },
    { label: 'Age',         value: stat(player.age)        },
    { label: 'Nationality', value: stat(player.citizenship) },
    { label: 'Club',        value: stat(player.club)       },
    { label: 'Form rating', value: formatRating(player.rating) },
  ];

  return (
    <Tile className="player-card">
      {player.photo && (
        <div className="player-card__photo-wrap">
          <img
            src={player.photo}
            alt={player.name}
            className="player-card__photo"
          />
        </div>
      )}

      <h2 className="player-card__name">{player.name}</h2>

      <dl className="player-card__stats">
        {rows.map(({ label, value }) => (
          <div key={label} className="player-card__stat-row">
            <dt className="player-card__label">{label}</dt>
            <dd className="player-card__value">{value}</dd>
          </div>
        ))}
      </dl>
    </Tile>
  );
}

export default PlayerCard;
