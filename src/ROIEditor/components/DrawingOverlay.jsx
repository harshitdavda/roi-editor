import { memo } from 'react';

const STYLES = {
  stroke: {
    strokeDasharray: '5,3',
    strokeWidth: 1.5,
    vectorEffect: 'non-scaling-stroke',
  },
};

export const DrawingOverlay = memo(function DrawingOverlay({
  currentPoints,
  currentColor,
  mousePos,
}) {
  if (currentPoints.length === 0) return null;

  return (
    <g>
      <polyline
        fill="none"
        points={currentPoints.map((p) => `${p[0] * 1000},${p[1] * 1000}`).join(' ')}
        stroke={currentColor}
        {...STYLES.stroke}
      />
      {mousePos ? (
        <line
          stroke={currentColor}
          x1={currentPoints[currentPoints.length - 1][0] * 1000}
          x2={mousePos[0] * 1000}
          y1={currentPoints[currentPoints.length - 1][1] * 1000}
          y2={mousePos[1] * 1000}
          {...STYLES.stroke}
        />
      ) : null}
    </g>
  );
});
