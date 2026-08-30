import { useEffect, useMemo, useState } from 'react';
import type { Activity, SportFilter } from '../types';
import { extractUSState } from '../hooks/useActivities';

interface USMapProps {
  activities: Activity[];
  filter: SportFilter;
  onSelectState?: (state: string | null) => void;
  selectedState?: string | null;
}

type GeoFeature = {
  type: 'Feature';
  properties: { name: string };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
};

const CONTIGUOUS_BOUNDS = {
  minLng: -125,
  maxLng: -66,
  minLat: 24,
  maxLat: 50,
};

function project(
  lng: number,
  lat: number,
  state: string,
  w: number,
  h: number
): [number, number] {
  if (state === 'Alaska') {
    const x = ((lng + 190) / 62) * 86;
    const y = h - 50 + ((72 - lat) / 21) * 47;
    return [x, y];
  }

  if (state === 'Hawaii') {
    const x = 100 + ((lng + 161) / 8) * 54;
    const y = h - 29 + ((23 - lat) / 5) * 26;
    return [x, y];
  }

  const x =
    ((lng - CONTIGUOUS_BOUNDS.minLng) /
      (CONTIGUOUS_BOUNDS.maxLng - CONTIGUOUS_BOUNDS.minLng)) *
    w;
  const y =
    150 -
    ((lat - CONTIGUOUS_BOUNDS.minLat) /
      (CONTIGUOUS_BOUNDS.maxLat - CONTIGUOUS_BOUNDS.minLat)) *
      150;
  return [x, y];
}

function ringToPath(
  ring: number[][],
  state: string,
  w: number,
  h: number
): string {
  return (
    ring
      .map(([lng, lat], index) => {
        const [x, y] = project(lng, lat, state, w, h);
        return `${index === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ') + ' Z'
  );
}

function featureToPath(feature: GeoFeature, w: number, h: number): string {
  const state = feature.properties.name;
  if (feature.geometry.type === 'Polygon') {
    return (feature.geometry.coordinates as number[][][])
      .map((ring) => ringToPath(ring, state, w, h))
      .join(' ');
  }
  return (feature.geometry.coordinates as number[][][][])
    .flatMap((polygon) => polygon.map((ring) => ringToPath(ring, state, w, h)))
    .join(' ');
}

export function USMap({
  activities,
  filter,
  onSelectState,
  selectedState,
}: USMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [features, setFeatures] = useState<GeoFeature[]>([]);

  const SVG_W = 260;
  const SVG_H = 190;

  useEffect(() => {
    import('../assets/us-states.json').then((module) => {
      const states = (module.default as { features: GeoFeature[] }).features;
      setFeatures(
        states.filter((feature) => feature.properties.name !== 'Puerto Rico')
      );
    });
  }, []);

  const stateCount = useMemo(() => {
    const counts = new Map<string, number>();
    for (const activity of activities) {
      const state = extractUSState(activity.location_country);
      if (state) counts.set(state, (counts.get(state) ?? 0) + 1);
    }
    return counts;
  }, [activities]);

  const displayState = hoveredState ?? selectedState;
  const displayCount = displayState ? (stateCount.get(displayState) ?? 0) : 0;

  function handleClick(state: string) {
    if (!onSelectState || !stateCount.has(state)) return;
    onSelectState(selectedState === state ? null : state);
  }

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">US Footprint Map</h2>
        <div className="flex items-center gap-2 text-xs text-[var(--color-muted)]">
          {selectedState ? (
            <button
              type="button"
              onClick={() => onSelectState?.(null)}
              className="flex items-center gap-1 text-[var(--color-accent)] transition-opacity hover:opacity-70"
            >
              <svg
                className="h-3 w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Clear
            </button>
          ) : (
            <>
              <span className="font-mono font-bold text-[var(--color-accent)]">
                {stateCount.size}
              </span>
              <span>/ {features.length || 51} states &amp; DC</span>
            </>
          )}
        </div>
      </div>

      <div className="relative" style={{ aspectRatio: `${SVG_W} / ${SVG_H}` }}>
        <svg
          key={filter}
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          height="100%"
          style={{ display: 'block', position: 'absolute', inset: 0 }}
          aria-label="Map of US states visited through recorded activities"
          role="img"
        >
          {features.map((feature) => {
            const state = feature.properties.name;
            const visited = stateCount.has(state);
            const isHovered = hoveredState === state;
            const isSelected = selectedState === state;

            let fill: string;
            if (visited) {
              if (isSelected) {
                fill = 'var(--color-accent)';
              } else if (isHovered) {
                fill =
                  'color-mix(in srgb, var(--color-accent) 80%, transparent)';
              } else if (selectedState) {
                fill =
                  'color-mix(in srgb, var(--color-accent) 25%, transparent)';
              } else {
                fill =
                  'color-mix(in srgb, var(--color-accent) 55%, transparent)';
              }
            } else {
              fill = 'var(--color-border)';
            }

            return (
              <path
                key={state}
                d={featureToPath(feature, SVG_W, SVG_H)}
                fill={fill}
                stroke="var(--color-bg)"
                strokeWidth="0.5"
                className={`transition-all duration-150 ${visited ? 'cursor-pointer' : 'cursor-default'}`}
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
                onClick={() => handleClick(state)}
              />
            );
          })}
        </svg>
      </div>

      <div className="mt-1.5 h-4 text-xs text-[var(--color-muted)]">
        {displayState && (
          <>
            <span className="font-medium text-[var(--color-text)]">
              {displayState}
            </span>
            {displayCount > 0 && (
              <span className="ml-1.5">{displayCount} activities</span>
            )}
            {selectedState === displayState && !hoveredState && (
              <span className="ml-1.5 text-[var(--color-accent)]">
                (filtered)
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
