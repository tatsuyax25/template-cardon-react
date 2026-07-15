import React from 'react';

/**
 * @typedef {Object} FormationPlayer
 * @property {string}      name    - Display name
 * @property {string}      [photo] - URL of the player's photo
 * @property {string}      [position] - Positional label (e.g. "Defender")
 * @property {number}      [age]
 * @property {string}      [citizenship]
 * @property {string}      [club]
 * @property {number|null} [rating]
 */

/**
 * Slot descriptor: the percentage-based centre of each player token on the
 * pitch. Origin (0,0) is top-left. Slots are ordered 1–11.
 *
 * 4-4-2 formation (attack at top, GK at bottom):
 *   1        GK
 *   2–5      Defenders
 *   6–9      Midfielders
 *   10–11    Forwards
 *
 * @type {{ x: number; y: number }[]}
 */
const SLOTS = [
  // ── Forwards (top) ─────────────────────────────────────
  { x: 33, y: 15 }, // 1  – Left Forward
  { x: 67, y: 15 }, // 2  – Right Forward
  // ── Midfielders ────────────────────────────────────────
  { x: 15, y: 40 }, // 3  – Left Mid
  { x: 38, y: 40 }, // 4  – Centre-Left Mid
  { x: 62, y: 40 }, // 5  – Centre-Right Mid
  { x: 85, y: 40 }, // 6  – Right Mid
  // ── Defenders ──────────────────────────────────────────
  { x: 15, y: 65 }, // 7  – Left Back
  { x: 38, y: 65 }, // 8  – Centre-Left Back
  { x: 62, y: 65 }, // 9  – Centre-Right Back
  { x: 85, y: 65 }, // 10 – Right Back
  // ── Goalkeeper (bottom) ────────────────────────────────
  { x: 50, y: 87 }, // 11 – GK
];

// ─── Inline style objects ───────────────────────────────────────────────────

const styles = {
  /** Outer wrapper constrains the board width and enables perspective */
  wrapper: {
    width: '100%',
    maxWidth: 800,
    marginTop: '2rem',
  },

  /** The pitch itself */
  pitch: {
    position: 'relative',
    width: '100%',
    paddingBottom: '75%', // keeps 800×600 aspect ratio (600/800 = 75%)
    background: 'linear-gradient(175deg, #1a7a1a 0%, #2d9e2d 30%, #1e8a1e 50%, #2d9e2d 70%, #1a7a1a 100%)',
    borderRadius: 12,
    boxShadow: '0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3)',
    overflow: 'hidden',
    transform: 'perspective(900px) rotateX(4deg)',
    transformOrigin: 'top center',
  },

  /** SVG overlay for field markings — stretched to fill the pitch */
  markings: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },

  /** Empty-state message centred on the pitch */
  emptyMsg: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.75)',
    fontSize: '1rem',
    fontWeight: 500,
    textAlign: 'center',
    padding: '0 2rem',
    pointerEvents: 'none',
  },

  /**
   * Returns the absolute-positioned style for a player token.
   * @param {number} xPct - Horizontal centre (0–100 %)
   * @param {number} yPct - Vertical centre (0–100 %)
   * @returns {React.CSSProperties}
   */
  token: (xPct, yPct) => ({
    position: 'absolute',
    left: `${xPct}%`,
    top: `${yPct}%`,
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    width: 64,
  }),

  /** Circular photo / placeholder */
  avatar: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2.5px solid rgba(255,255,255,0.9)',
    background: 'rgba(255,255,255,0.15)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
    flexShrink: 0,
  },

  /** Photo inside the avatar circle */
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  /** Fallback silhouette shown when there is no photo */
  avatarFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '1.4rem',
  },

  /** Number badge in the bottom-right of the avatar */
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: '50%',
    background: '#f0c000',
    color: '#111',
    fontSize: '0.6rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    border: '1.5px solid #fff',
  },

  /** Name label below the avatar */
  nameLabel: {
    color: '#fff',
    fontSize: '0.6rem',
    fontWeight: 600,
    textAlign: 'center',
    textShadow: '0 1px 3px rgba(0,0,0,0.8)',
    lineHeight: 1.25,
    maxWidth: 64,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

/**
 * Field markings rendered as an SVG overlay.
 * The viewBox matches a notional 800×600 coordinate space.
 */
function FieldMarkings() {
  const s = { fill: 'none', stroke: 'rgba(255,255,255,0.45)', strokeWidth: 1.5 };
  return (
    <svg viewBox="0 0 800 600" style={styles.markings} aria-hidden="true">
      {/* Outer boundary */}
      <rect x="30" y="20" width="740" height="560" rx="2" {...s} />

      {/* Centre line */}
      <line x1="30" y1="300" x2="770" y2="300" {...s} />

      {/* Centre circle */}
      <circle cx="400" cy="300" r="70" {...s} />
      <circle cx="400" cy="300" r="3" fill="rgba(255,255,255,0.45)" />

      {/* ── Top penalty area ──────────────────────────────── */}
      <rect x="215" y="20" width="370" height="100" {...s} />
      {/* Top goal area */}
      <rect x="305" y="20" width="190" height="45" {...s} />
      {/* Top penalty spot */}
      <circle cx="400" cy="90" r="3" fill="rgba(255,255,255,0.45)" />
      {/* Top penalty arc */}
      <path d="M 330 120 A 70 70 0 0 1 470 120" {...s} />

      {/* ── Bottom penalty area ───────────────────────────── */}
      <rect x="215" y="480" width="370" height="100" {...s} />
      {/* Bottom goal area */}
      <rect x="305" y="535" width="190" height="45" {...s} />
      {/* Bottom penalty spot */}
      <circle cx="400" cy="510" r="3" fill="rgba(255,255,255,0.45)" />
      {/* Bottom penalty arc */}
      <path d="M 330 480 A 70 70 0 0 0 470 480" {...s} />

      {/* Corner arcs */}
      <path d="M 30 40 A 14 14 0 0 1 44 20"  {...s} />
      <path d="M 756 20 A 14 14 0 0 1 770 40" {...s} />
      <path d="M 770 560 A 14 14 0 0 1 756 580" {...s} />
      <path d="M 44 580 A 14 14 0 0 1 30 560"  {...s} />
    </svg>
  );
}

/**
 * A single player token rendered at the given slot position.
 *
 * @param {{ player: FormationPlayer; slotNumber: number; x: number; y: number }} props
 */
function PlayerToken({ player, slotNumber, x, y }) {
  return (
    <div style={styles.token(x, y)}>
      <div style={styles.avatar}>
        {player.photo ? (
          <img src={player.photo} alt={player.name} style={styles.avatarImg} />
        ) : (
          <div style={styles.avatarFallback}>👤</div>
        )}
        <div style={styles.badge}>{slotNumber}</div>
      </div>
      <span style={styles.nameLabel}>{player.name}</span>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

/**
 * FormationBoard
 *
 * Renders a football pitch with a 4-4-2 formation.
 * Attack is shown at the top; the goalkeeper is at the bottom.
 *
 * @param {{ players: FormationPlayer[] }} props
 *   Pass up to 11 players; surplus entries are ignored.
 *   Pass an empty array (or omit) to show the empty-state message.
 */
function FormationBoard({ players = [] }) {
  const visible = players.slice(0, 11);

  return (
    <div style={styles.wrapper}>
      <div style={styles.pitch}>
        <FieldMarkings />

        {visible.length === 0 ? (
          <div style={styles.emptyMsg}>
            Click Generate Random Team to see the formation
          </div>
        ) : (
          visible.map((player, i) => (
            <PlayerToken
              key={player.name}
              player={player}
              slotNumber={i + 1}
              x={SLOTS[i].x}
              y={SLOTS[i].y}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FormationBoard;
