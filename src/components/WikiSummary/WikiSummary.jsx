import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tile, InlineLoading } from '@carbon/react';
import './WikiSummary.scss';

/**
 * Trim an extract to the first `n` sentences.
 * Splits on ". ", "! " or "? " boundaries.
 */
function firstSentences(text, n = 3) {
  if (!text) return text;
  // Match sentence-ending punctuation followed by a space or end-of-string.
  const re = /[.!?](?:\s|$)/g;
  let count = 0;
  let lastIndex = text.length;
  let match;
  while ((match = re.exec(text)) !== null) {
    count += 1;
    if (count === n) {
      lastIndex = match.index + 1; // include the punctuation mark
      break;
    }
  }
  return text.slice(0, lastIndex).trim();
}

async function fetchWikiSummary(playerName) {
  // Best-effort: replace spaces with underscores for the URL slug.
  const slug = encodeURIComponent(playerName.replace(/ /g, '_'));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return null; // no article found — not an error
    throw new Error(`Wikipedia returned ${res.status}`);
  }
  const data = await res.json();
  if (data.type === 'disambiguation') return null; // skip disambiguation pages
  return data.extract || null;
}

function WikiSummary({ player }) {
  const { data, isFetching, isError } = useQuery({
    queryKey: ['wiki', player?.name],
    queryFn: () => fetchWikiSummary(player.name),
    enabled: Boolean(player?.name),
    staleTime: 1000 * 60 * 10, // cache for 10 min
    retry: 1,
  });

  if (!player) return null;

  return (
    <Tile className="wiki-summary">
      <p className="wiki-summary__label">Player Information</p>

      {isFetching && (
        <InlineLoading description="Loading Wikipedia summary…" />
      )}

      {!isFetching && isError && (
        <p className="wiki-summary__text wiki-summary__text--muted">
          Could not load summary at this time.
        </p>
      )}

      {!isFetching && !isError && data && (
        <p className="wiki-summary__text">{firstSentences(data, 3)}</p>
      )}

      {!isFetching && !isError && !data && (
        <p className="wiki-summary__text wiki-summary__text--muted">
          No Wikipedia article found for this player.
        </p>
      )}

      <p className="wiki-summary__source">Source: Wikipedia</p>
    </Tile>
  );
}

export default WikiSummary;
