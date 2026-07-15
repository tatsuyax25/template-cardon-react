// scripts/fetchPlayers.js
// Downloads Premier League player data (2023 season) from API-Football
// and saves it to src/data/players.json.

'use strict';

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const API_KEY    = process.env.API_FOOTBALL_KEY;
const BASE_URL   = 'https://v3.football.api-sports.io';
const SEASON     = 2023;
const PL_ID      = 39; // Premier League league ID
const DELAY_MS   = 600; // gap between requests to stay within rate limit

// Top Premier League clubs and their API-Football team IDs
const TEAMS = [
  { id: 50,  name: 'Manchester City'   },
  { id: 33,  name: 'Manchester United' },
  { id: 40,  name: 'Liverpool'         },
  { id: 42,  name: 'Arsenal'           },
  { id: 49,  name: 'Chelsea'           },
  { id: 47,  name: 'Tottenham'         },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTeamPlayers(teamId, teamName) {
  const url = `${BASE_URL}/players?team=${teamId}&season=${SEASON}`;
  const res = await fetch(url, {
    headers: { 'x-apisports-key': API_KEY },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching team ${teamName} (id=${teamId})`);
  }

  const json = await res.json();

  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(
      `API error for team ${teamName}: ${JSON.stringify(json.errors)}`
    );
  }

  return json.response || [];
}

function extractPlayer(entry) {
  const { player, statistics } = entry;

  if (!statistics || statistics.length === 0) return null;

  // Only keep the entry for Premier League stats (league.id === 39)
  const plStats = statistics.find((s) => s.league && s.league.id === PL_ID);
  if (!plStats) return null;

  const ratingRaw = plStats.games && plStats.games.rating;
  const rating    = ratingRaw ? parseFloat(ratingRaw) : null;

  const heightRaw = player.height; // e.g. "185 cm"
  const height    = heightRaw
    ? parseInt(heightRaw.replace(/\D/g, ''), 10)
    : null;

  return {
    name:        player.name,
    photo:       player.photo,
    position:    plStats.games.position,
    age:         player.age,
    citizenship: player.nationality,
    height,
    club:        plStats.team.name,
    rating,
  };
}

async function main() {
  if (!API_KEY) {
    console.error('❌  API_FOOTBALL_KEY is not set. Check your .env file.');
    process.exit(1);
  }

  // Ensure output directory exists
  const dataDir = path.join(__dirname, '..', 'src', 'data');
  fs.mkdirSync(dataDir, { recursive: true });

  const allRaw = [];

  for (const team of TEAMS) {
    console.log(`⏳  Fetching players for ${team.name} (id=${team.id}) …`);
    const entries = await fetchTeamPlayers(team.id, team.name);
    allRaw.push(...entries);
    console.log(`   → ${entries.length} entries received`);

    // Rate-limit guard between requests
    if (team !== TEAMS[TEAMS.length - 1]) await sleep(DELAY_MS);
  }

  console.log(`\n📦  Total raw entries fetched: ${allRaw.length}`);

  // Extract and filter
  const players = allRaw
    .map(extractPlayer)
    .filter(Boolean);

  // Deduplicate by name (keep first occurrence)
  const seen = new Set();
  const unique = players.filter(({ name }) => {
    if (seen.has(name)) return false;
    seen.add(name);
    return true;
  });

  console.log(`✅  Players with PL stats:     ${players.length}`);
  console.log(`🔁  After deduplication:       ${unique.length}`);

  const outPath = path.join(dataDir, 'players.json');
  fs.writeFileSync(outPath, JSON.stringify(unique, null, 2), 'utf8');
  console.log(`\n💾  Saved ${unique.length} players → ${outPath}`);
}

main().catch((err) => {
  console.error('❌  Fatal error:', err.message);
  process.exit(1);
});
