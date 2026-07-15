/**
 * @typedef {Object} Player
 * @property {string}      name        - Display name
 * @property {string}      photo       - URL of the player's photo
 * @property {string}      position    - Positional label (e.g. "Defender")
 * @property {number}      age
 * @property {string}      citizenship
 * @property {number|null} height      - Height in centimetres, or null
 * @property {string}      club
 * @property {number|null} rating      - Form rating, or null
 */

/**
 * Return 11 randomly selected players from the provided list.
 *
 * The source array is never mutated.
 *
 * @param {Player[]} allPlayers - Full list of available players.
 * @returns {Player[]} Exactly 11 players (or fewer if the list is smaller).
 */
export function generateRandomTeam(allPlayers) {
  const shuffled = [...allPlayers].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 11);
}
