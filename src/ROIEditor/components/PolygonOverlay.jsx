import { memo, useCallback } from 'react';

const STYLES = {
  polygon: {
    fillOpacity: 0.08,
    strokeWidth: 1.5,
    vectorEffect: 'non-scaling-stroke',
  },
  polygonSelected: {
    fillOpacity: 0.2,
    strokeWidth: 1.5,
    vectorEffect: 'non-scaling-stroke',
  },
};

export const PolygonOverlay = memo(function PolygonOverlay({
  isDrawMode,
  onPolygonClick,
  polygons,
  selectedPolygonId,
}) {
  const handleClick = useCallback(
    (e, polyId) => {
      e.stopPropagation();
      onPolygonClick?.(polyId);
    },
    [onPolygonClick],
  );

  if (!polygons?.length) return null;

  return (
    <>
      {polygons.map((poly) => {
        const isSelected = poly.id === selectedPolygonId;
        return (
          <polygon
            cursor={isDrawMode ? 'crosshair' : 'pointer'}
            fill={poly.color}
            key={poly.id}
            onClick={(e) => handleClick(e, poly.id)}
            pointerEvents={isDrawMode ? 'none' : 'auto'}
            points={poly.points.map((p) => `${p[0] * 1000},${p[1] * 1000}`).join(' ')}
            stroke={poly.color}
            style={{ filter: `drop-shadow(0 0 ${isSelected ? '8' : '4'}px ${poly.color})` }}
            {...(isSelected ? STYLES.polygonSelected : STYLES.polygon)}
          />
        );
      })}
    </>
  );
});
