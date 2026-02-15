import { Fragment, memo } from 'react';

const STYLES = {
  overlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  dotBase: {
    position: 'absolute',
    borderRadius: 9999,
    transform: 'translate(-50%, -50%)',
  },
  glowRing: {
    width: 28,
    height: 28,
    opacity: 0.4,
    filter: 'blur(6px)',
  },
  dotDefault: {
    width: 8,
    height: 8,
    border: '1px solid white',
  },
  dotClosable: {
    width: 12,
    height: 12,
    border: '2px solid white',
    filter: 'brightness(1.5) drop-shadow(0 0 4px white)',
  },
};

export const DrawingAnnotations = memo(function DrawingAnnotations({
  currentPoints,
  currentColor,
}) {
  if (currentPoints.length === 0) return null;

  return (
    <div style={STYLES.overlay}>
      {currentPoints.map((p, idx) => {
        const isClosable = idx === 0 && currentPoints.length >= 3;
        const glowStyle = {
          ...STYLES.dotBase,
          ...STYLES.glowRing,
          left: `${p[0] * 100}%`,
          top: `${p[1] * 100}%`,
          backgroundColor: currentColor,
        };
        const dotStyle = {
          ...STYLES.dotBase,
          ...(isClosable ? STYLES.dotClosable : STYLES.dotDefault),
          left: `${p[0] * 100}%`,
          top: `${p[1] * 100}%`,
          backgroundColor: currentColor,
        };
        return (
          <Fragment key={`${idx}-${p[0]}-${p[1]}`}>
            {isClosable ? <div style={glowStyle} /> : null}
            <div style={dotStyle} />
          </Fragment>
        );
      })}
    </div>
  );
});
