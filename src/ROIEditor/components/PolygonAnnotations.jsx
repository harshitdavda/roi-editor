import { Fragment, memo } from 'react';
import { getPolygonCentroid } from '../utils';

const STYLES = {
  overlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    userSelect: 'none',
  },
  vertexDot: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 9999,
    transform: 'translate(-50%, -50%)',
  },
  labelWrapper: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  labelBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingLeft: 6,
    paddingRight: 6,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 4,
    border: '1px solid',
    whiteSpace: 'nowrap',
  },
  labelText: {
    fontSize: 8,
    fontWeight: 700,
    textTransform: 'uppercase',
  },
};

export const PolygonAnnotations = memo(function PolygonAnnotations({ polygons }) {
  if (!polygons?.length) return null;

  return (
    <div style={STYLES.overlay}>
      {polygons.map((poly) => {
        const centroid = getPolygonCentroid(poly.points);
        const labelWrapperStyle = {
          ...STYLES.labelWrapper,
          left: `${centroid[0] * 100}%`,
          top: `${centroid[1] * 100}%`,
        };
        const labelBoxStyle = {
          ...STYLES.labelBox,
          color: poly.color,
          borderColor: `${poly.color}44`,
        };
        return (
          <Fragment key={poly.id}>
            {poly.points.map((p, pIdx) => {
              const vertexDotStyle = {
                ...STYLES.vertexDot,
                left: `${p[0] * 100}%`,
                top: `${p[1] * 100}%`,
                backgroundColor: poly.color,
              };
              return <div key={`${poly.id}-${pIdx}-${p[0]}-${p[1]}`} style={vertexDotStyle} />;
            })}
            <div style={labelWrapperStyle}>
              <div style={labelBoxStyle}>
                <span style={STYLES.labelText}>{poly.name ?? poly.id}</span>
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
});
