import { memo } from 'react';

const STYLES = {
  polygon: {
    fillOpacity: 0.08,
    strokeWidth: 1.5,
    vectorEffect: 'non-scaling-stroke',
  },
};

export const PolygonOverlay = memo(function PolygonOverlay({ polygons }) {
  return (
    <>
      {polygons.map((poly) => (
        <polygon
          fill={poly.color}
          key={poly.id}
          points={poly.points.map((p) => `${p[0] * 1000},${p[1] * 1000}`).join(' ')}
          stroke={poly.color}
          style={{ filter: `drop-shadow(0 0 4px ${poly.color})` }}
          {...STYLES.polygon}
        />
      ))}
    </>
  );
});
