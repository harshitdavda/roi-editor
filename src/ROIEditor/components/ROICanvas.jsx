import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { DrawingAnnotations } from './DrawingAnnotations';
import { DrawingOverlay } from './DrawingOverlay';
import { PolygonAnnotations } from './PolygonAnnotations';
import { PolygonOverlay } from './PolygonOverlay';

const STYLES = {
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  canvasBoxBase: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgLayer: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  img: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    userSelect: 'none',
    pointerEvents: 'none',
  },
};

/**
 * Compute the largest width/height that fits inside (parentW, parentH) with exact aspect ratio.
 * Keeps the coordinate box stable across viewport changes so polygon positions stay accurate.
 */
function fitBoxWithRatio(parentW, parentH, ratio) {
  if (parentW <= 0 || parentH <= 0 || ratio <= 0) return { width: 0, height: 0 };
  if (parentW / parentH > ratio) {
    return { width: parentH * ratio, height: parentH };
  }
  return { width: parentW, height: parentW / ratio };
}

export const ROICanvas = memo(function ROICanvas({
  containerRef,
  currentColor,
  currentPoints,
  imageUrl,
  isDrawMode,
  mousePos,
  onCanvasClick,
  onMouseLeave,
  onMouseMove,
  polygons,
}) {
  const [aspectRatio, setAspectRatio] = useState(null);
  const [canvasSize, setCanvasSize] = useState(null);
  const wrapperRef = useRef(null);

  const handleImageLoad = useCallback((e) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
  }, []);

  // size the canvas box to exact image aspect ratio so normalized (0-1) coords map correctly
  useEffect(() => {
    if (aspectRatio === null || !wrapperRef.current) return;
    const wrapper = wrapperRef.current;
    const updateSize = () => {
      const rect = wrapper.getBoundingClientRect();
      setCanvasSize(fitBoxWithRatio(rect.width, rect.height, aspectRatio));
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [aspectRatio]);

  const wrapperStyle = {
    ...STYLES.wrapper,
    cursor: isDrawMode ? 'crosshair' : 'default',
  };

  const canvasBoxStyle = {
    ...STYLES.canvasBoxBase,
    ...(canvasSize !== null
      ? { width: canvasSize.width, height: canvasSize.height }
      : { width: '100%', height: '100%' }),
  };

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <div
        onClick={onCanvasClick}
        onKeyDown={handleKeyDown}
        onMouseLeave={onMouseLeave}
        onMouseMove={onMouseMove}
        ref={containerRef}
        role="application"
        style={canvasBoxStyle}
        tabIndex={0}
      >
        {/* biome-ignore lint/performance/noImgElement: using native img for onLoad aspect ratio detection */}
        <img alt="CCTV" onLoad={handleImageLoad} src={imageUrl} style={STYLES.img} />

        <svg preserveAspectRatio="none" style={STYLES.svgLayer} viewBox="0 0 1000 1000">
          <PolygonOverlay polygons={polygons} />
          <DrawingOverlay
            currentColor={currentColor}
            currentPoints={currentPoints}
            mousePos={mousePos}
          />
        </svg>

        <PolygonAnnotations polygons={polygons} />
        <DrawingAnnotations currentColor={currentColor} currentPoints={currentPoints} />
      </div>
    </div>
  );
});
