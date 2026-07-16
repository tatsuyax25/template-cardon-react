import React from 'react';

/**
 * @typedef {Object} FormationPlayer
 * @property {string}      name       - Display name
 * @property {string}      [photo]    - URL of the player's photo
 * @property {string}      [position] - Positional label
 * @property {number}      [age]
 * @property {string}      [citizenship]
 * @property {string}      [club]
 * @property {number|null} [rating]
 */

// ─── Pitch geometry constants (SVG viewBox: 500 × 780) ───────────────────────
//
// Real pitch: 68 m wide × 105 m long  →  scale factors:
//   scaleX = 460 / 68  ≈ 6.765   scaleY = 710 / 105 ≈ 6.762
// Field border sits at (20, 35) with playable area 460 × 710.
//
// All values derived from official FIFA/UEFA measurements.

const VW = 500;   // viewBox width
const VH = 780;   // viewBox height
const ML = 20;    // left margin  (field border x)
const MT = 35;    // top margin   (field border y)
const FW = 460;   // field width
const FH = 710;   // field height
const FR = ML + FW; // field right  = 480
const FB = MT + FH; // field bottom = 745

const CX = ML + FW / 2;  // 250  – horizontal centre
const CY = MT + FH / 2;  // 390  – vertical centre (halfway line)

// Centre circle – radius 9.15 m → 9.15/68 * 460 ≈ 62
const CC_R = 62;

// Round to even so CX ± half-width is always a whole pixel
const roundEven = (n) => Math.round(n / 2) * 2;

// Penalty box – 40.32 m wide, 16.5 m deep
const PB_W = roundEven(40.32 / 68 * FW); // 272
const PB_D = Math.round(16.5 / 105 * FH); // 112
const PB_X = CX - PB_W / 2;               // 114  (whole pixel)

// Goal area (six-yard box) – 18.32 m wide, 5.5 m deep
const GA_W = roundEven(18.32 / 68 * FW); // 124
const GA_D = Math.round(5.5  / 105 * FH); // 37
const GA_X = CX - GA_W / 2;               // 188  (whole pixel)

// Penalty spot – 11 m from goal line
const PS_D = Math.round(11 / 105 * FH);   // 74

// Penalty arc – same radius as centre circle (9.15 m)
const PA_R = CC_R; // 62

// Corner arc radius – 1 m
const CORNER_R = Math.round(1 / 68 * FW); // 7

// Goal – 7.32 m wide, depth ~2 m (visual only, outside field)
const GOAL_W = roundEven(7.32 / 68 * FW); // 50
const GOAL_D = 14;
const GOAL_X = CX - GOAL_W / 2;           // 225  (whole pixel)

// ─── 4-4-2 formation slot positions (% of pitch wrapper) ─────────────────────
//
// Expressed as percentages of the wrapper div's total size (which equals
// the SVG viewBox). Attack at top, GK at bottom.
// Computed against (VW=500, VH=780) so tokens align with the pitch geometry.

const toX = (svgX) => (svgX / VW * 100);
const toY = (svgY) => (svgY / VH * 100);

const SLOTS = [
  // ── Forwards (top) ───────────────────────────────────────────────────────
  { x: toX(CX - FW * 0.17), y: toY(MT + FH * 0.13) }, // LF  ~33 % x
  { x: toX(CX + FW * 0.17), y: toY(MT + FH * 0.13) }, // RF  ~67 % x
  // ── Midfielders ──────────────────────────────────────────────────────────
  { x: toX(ML + FW * 0.10), y: toY(CY - FH * 0.08) }, // LM
  { x: toX(ML + FW * 0.35), y: toY(CY - FH * 0.08) }, // CM-L
  { x: toX(ML + FW * 0.65), y: toY(CY - FH * 0.08) }, // CM-R
  { x: toX(ML + FW * 0.90), y: toY(CY - FH * 0.08) }, // RM
  // ── Defenders ────────────────────────────────────────────────────────────
  { x: toX(ML + FW * 0.10), y: toY(CY + FH * 0.16) }, // LB
  { x: toX(ML + FW * 0.35), y: toY(CY + FH * 0.16) }, // CB-L
  { x: toX(ML + FW * 0.65), y: toY(CY + FH * 0.16) }, // CB-R
  { x: toX(ML + FW * 0.90), y: toY(CY + FH * 0.16) }, // RB
  // ── Goalkeeper (bottom) ──────────────────────────────────────────────────
  { x: toX(CX),             y: toY(FB - FH * 0.09) }, // GK
];

// ─── Inline styles ────────────────────────────────────────────────────────────

const styles = {
  /** Outer wrapper – fixed aspect ratio matching VW:VH */
  wrapper: {
    width: '100%',
    maxWidth: 500,
    marginTop: '2rem',
  },

  /** Pitch container – uses padding-bottom trick for 500:780 aspect ratio */
  pitch: {
    position: 'relative',
    width: '100%',
    paddingBottom: `${(VH / VW) * 100}%`, // 156%
    background: 'linear-gradient(180deg, #3a9e3a 0%, #45b545 12.5%, #3a9e3a 25%, #45b545 37.5%, #3a9e3a 50%, #45b545 62.5%, #3a9e3a 75%, #45b545 87.5%, #3a9e3a 100%)',
    borderRadius: 4,
    border: '3px solid #1e6b1e',
    boxShadow: 'inset 0 0 40px rgba(0,0,0,0.25), 0 6px 24px rgba(0,0,0,0.4)',
    overflow: 'visible', // goals protrude outside
  },

  /** SVG overlay – fills the pitch exactly */
  markings: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'visible',
  },

  /** Empty-state label */
  emptyMsg: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.85)',
    fontSize: '0.95rem',
    fontWeight: 500,
    textAlign: 'center',
    padding: '0 2rem',
    pointerEvents: 'none',
  },

  /** Absolute-positioned player token */
  token: (xPct, yPct) => ({
    position: 'absolute',
    left: `${xPct}%`,
    top: `${yPct}%`,
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 3,
    width: 52,
    zIndex: 2,
  }),

  /** Circular photo frame */
  avatar: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: '50%',
    overflow: 'hidden',
    border: '2px solid rgba(255,255,255,0.95)',
    background: 'rgba(0,0,0,0.25)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.55)',
    flexShrink: 0,
  },

  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },

  avatarFallback: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '1.1rem',
  },

  /** Number badge – bottom-right of avatar */
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#f0c000',
    color: '#111',
    fontSize: '0.5rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    border: '1px solid #fff',
  },

  /** Name label below avatar */
  nameLabel: {
    color: '#fff',
    fontSize: '0.52rem',
    fontWeight: 700,
    textAlign: 'center',
    textShadow: '0 1px 4px rgba(0,0,0,0.9)',
    lineHeight: 1.2,
    maxWidth: 52,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
};

// ─── Field Markings SVG ───────────────────────────────────────────────────────

/**
 * All official pitch markings as a single SVG overlay.
 *
 * Coordinate reference:
 *   viewBox 0 0 500 780
 *   Field border:  (20, 35) → (480, 745)   width=460  height=710
 *   Halfway line y = 390
 *   Centre circle: cx=250, cy=390, r=62
 */
function FieldMarkings() {
  // Common stroke style for all white lines
  const L = { fill: 'none', stroke: 'rgba(255,255,255,0.92)', strokeWidth: 2 };
  // Solid white fill for spots
  const DOT = { fill: 'rgba(255,255,255,0.92)' };

  // ── Penalty area geometry ──────────────────────────────────────────────────
  // TOP box: top edge flush with field top (MT=35), extends DOWN by PB_D
  const topPB_y  = MT;
  const topPB_y2 = MT + PB_D;            // inner edge of top penalty box

  // TOP goal area: top edge flush with field top, extends DOWN by GA_D
  const topGA_y2 = MT + GA_D;

  // TOP penalty spot: PS_D from goal line (top)
  const topPS_cy = MT + PS_D;            // 35 + 74 = 109

  // TOP penalty arc: centred on penalty spot, radius PA_R=62
  // The arc curves AWAY from the goal (downward, into the field).
  // It is clipped so only the part OUTSIDE the penalty box shows.
  // Arc endpoints where |x - CX| = sqrt(PA_R² - (topPB_y2 - topPS_cy)²)
  //   topPB_y2 - topPS_cy = 111-74 = 37
  //   half_chord = sqrt(62²-37²) = sqrt(3844-1369) = sqrt(2475) ≈ 49.7 → 50
  const topArc_dx = Math.round(Math.sqrt(PA_R * PA_R - (topPB_y2 - topPS_cy) ** 2));
  const topArc_x1 = CX - topArc_dx;     // 200
  const topArc_x2 = CX + topArc_dx;     // 300
  const topArc_y  = topPB_y2;           // arc endpoints sit ON the penalty box line

  // BOTTOM box: bottom edge flush with field bottom (FB=745), extends UP by PB_D
  const botPB_y  = FB - PB_D;           // inner edge of bottom penalty box
  const botPB_y2 = FB;

  // BOTTOM goal area
  const botGA_y  = FB - GA_D;

  // BOTTOM penalty spot
  const botPS_cy = FB - PS_D;           // 745 - 74 = 671

  // Bottom arc: curves AWAY from goal (upward, into the field)
  const botArc_dx = topArc_dx;          // same geometry, symmetric
  const botArc_x1 = CX - botArc_dx;
  const botArc_x2 = CX + botArc_dx;
  const botArc_y  = botPB_y;

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      style={styles.markings}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* ── Grass stripe bands (darker alternating stripes) ─────────────── */}
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={ML} y={MT + i * (FH / 9)}
          width={FW} height={FH / 9}
          fill={i % 2 === 0 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.04)'}
        />
      ))}

      {/* ── Field outer border ───────────────────────────────────────────── */}
      <rect x={ML} y={MT} width={FW} height={FH} {...L} />

      {/* ── Halfway line ─────────────────────────────────────────────────── */}
      <line x1={ML} y1={CY} x2={FR} y2={CY} {...L} />

      {/* ── Centre circle & spot ─────────────────────────────────────────── */}
      <circle cx={CX} cy={CY} r={CC_R} {...L} />
      <circle cx={CX} cy={CY} r={3.5} {...DOT} />

      {/* ════════════════════ TOP (attacking) END ════════════════════════ */}

      {/* Penalty box */}
      <rect x={PB_X} y={topPB_y} width={PB_W} height={PB_D} {...L} />

      {/* Goal area */}
      <rect x={GA_X} y={topPB_y} width={GA_W} height={GA_D} {...L} />

      {/* Penalty spot */}
      <circle cx={CX} cy={topPS_cy} r={3} {...DOT} />

      {/* Penalty arc – curves away from goal (downward), outside the box */}
      <path
        d={`M ${topArc_x1} ${topArc_y} A ${PA_R} ${PA_R} 0 0 0 ${topArc_x2} ${topArc_y}`}
        {...L}
        clipPath="url(#clip-top-arc)"
      />
      {/* clip so only the part below topPB_y2 (outside the penalty box) shows */}
      <defs>
        <clipPath id="clip-top-arc">
          <rect x={0} y={topPB_y2} width={VW} height={VH} />
        </clipPath>
        <clipPath id="clip-bot-arc">
          <rect x={0} y={0} width={VW} height={botPB_y} />
        </clipPath>
        {/* Goal net pattern – diagonal hatching */}
        <pattern id="net-pattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M 0 6 L 6 0" stroke="rgba(180,180,180,0.6)" strokeWidth="0.8" />
          <path d="M -1 1 L 1 -1" stroke="rgba(180,180,180,0.6)" strokeWidth="0.8" />
          <path d="M 5 7 L 7 5" stroke="rgba(180,180,180,0.6)" strokeWidth="0.8" />
        </pattern>
      </defs>

      {/* Top goal (outside field boundary) */}
      <rect
        x={GOAL_X} y={MT - GOAL_D}
        width={GOAL_W} height={GOAL_D}
        fill="url(#net-pattern)"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={2}
      />

      {/* ════════════════════ CORNER ARCS ════════════════════════════════ */}
      {/* Top-left */}
      <path d={`M ${ML} ${MT + CORNER_R} A ${CORNER_R} ${CORNER_R} 0 0 0 ${ML + CORNER_R} ${MT}`} {...L} />
      {/* Top-right */}
      <path d={`M ${FR - CORNER_R} ${MT} A ${CORNER_R} ${CORNER_R} 0 0 0 ${FR} ${MT + CORNER_R}`} {...L} />
      {/* Bottom-left */}
      <path d={`M ${ML} ${FB - CORNER_R} A ${CORNER_R} ${CORNER_R} 0 0 1 ${ML + CORNER_R} ${FB}`} {...L} />
      {/* Bottom-right */}
      <path d={`M ${FR - CORNER_R} ${FB} A ${CORNER_R} ${CORNER_R} 0 0 1 ${FR} ${FB - CORNER_R}`} {...L} />

      {/* ════════════════════ BOTTOM (defending) END ═════════════════════ */}

      {/* Penalty box */}
      <rect x={PB_X} y={botPB_y} width={PB_W} height={PB_D} {...L} />

      {/* Goal area */}
      <rect x={GA_X} y={botGA_y} width={GA_W} height={GA_D} {...L} />

      {/* Penalty spot */}
      <circle cx={CX} cy={botPS_cy} r={3} {...DOT} />

      {/* Penalty arc – curves away from goal (upward), outside the box */}
      <path
        d={`M ${botArc_x1} ${botArc_y} A ${PA_R} ${PA_R} 0 0 1 ${botArc_x2} ${botArc_y}`}
        {...L}
        clipPath="url(#clip-bot-arc)"
      />

      {/* Bottom goal (outside field boundary) */}
      <rect
        x={GOAL_X} y={FB}
        width={GOAL_W} height={GOAL_D}
        fill="url(#net-pattern)"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={2}
      />
    </svg>
  );
}

// ─── PlayerToken ──────────────────────────────────────────────────────────────

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

// ─── FormationBoard ───────────────────────────────────────────────────────────

/**
 * Renders an official-proportion football pitch with a 4-4-2 formation.
 * Attack is at the top, goalkeeper at the bottom.
 *
 * @param {{ players: FormationPlayer[] }} props
 */
function FormationBoard({ players = [] }) {
  const visible = players.slice(0, 11);

  return (
    <div style={styles.wrapper}>
      <div style={styles.pitch}>
        <FieldMarkings />

        {visible.length === 0 ? (
          <div style={styles.emptyMsg}>
            Click "Generate Random Team" to see the formation
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
