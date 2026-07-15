import React from 'react';
import { Tile } from '@carbon/react';
import './WikiSummary.scss';

/**
 * Build a grounded summary using only the dataset fields.
 * Fields used: name, position, age, citizenship, club, rating.
 * No external sources are consulted.
 */
function buildSummary(player) {
  const parts = [];

  // Opening clause: name + position
  if (player.position) {
    parts.push(`${player.name} is a ${player.position}.`);
  } else {
    parts.push(`${player.name} is a professional footballer.`);
  }

  // Age
  if (player.age !== null && player.age !== undefined && player.age !== '') {
    parts.push(`They are ${player.age} years old.`);
  }

  // Nationality
  if (player.citizenship) {
    parts.push(`Their nationality is ${player.citizenship}.`);
  }

  // Club
  if (player.club) {
    parts.push(`They currently play for ${player.club}.`);
  }

  // Form rating
  if (player.rating !== null && player.rating !== undefined && player.rating !== '') {
    const r = parseFloat(player.rating);
    let formDesc;
    if (r >= 8.0) {
      formDesc = 'in strong form';
    } else if (r >= 6.0) {
      formDesc = 'showing consistent form';
    } else {
      formDesc = 'building form';
    }
    parts.push(`Based on their form rating of ${r.toFixed(1)}, they are currently ${formDesc}.`);
  }

  parts.push('This profile is based on the available dataset only.');

  return parts.join(' ');
}

function WikiSummary({ player }) {
  if (!player) return null;

  const summary = buildSummary(player);

  return (
    <Tile className="wiki-summary">
      <p className="wiki-summary__label">Player Summary</p>
      <p className="wiki-summary__text">{summary}</p>
      <p className="wiki-summary__source">This summary is based only on the loaded dataset.</p>
    </Tile>
  );
}

export default WikiSummary;
