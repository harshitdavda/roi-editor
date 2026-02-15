import useEventCallback from './useEventCallback';
import { useEffect, useRef, useState } from 'react';
import { useROIHistory } from './useROIHistory';

/** minimum distance (in normalized coords) to snap to the start point and close the polygon */
const CLOSE_THRESHOLD = 0.02;

export function useROIEditor({ data, onAction }) {
  const { isDrawMode } = data;

  const [currentPoints, setCurrentPoints] = useState([]);
  const [redoPoints, setRedoPoints] = useState([]);
  const [currentColor, setCurrentColor] = useState('#DF00FF');
  const [mousePos, setMousePos] = useState(null);

  const containerRef = useRef(null);
  const history = useROIHistory(data.polygons);

  /** clear drawing state when exiting draw mode (cancel, complete, or parent-driven) */
  useEffect(() => {
    if (!isDrawMode) {
      setCurrentPoints([]);
      setRedoPoints([]);
      setMousePos(null);
    }
  }, [isDrawMode]);

  /** Esc key cancels drawing */
  useEffect(() => {
    if (!isDrawMode) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onAction({ type: 'DRAW_MODE_CHANGE', isDrawMode: false });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawMode, onAction]);

  const handleUndo = useEventCallback(() => {
    if (isDrawMode) {
      if (currentPoints.length === 1) {
        // undoing the last point — cancel drawing entirely
        onAction({ type: 'DRAW_MODE_CHANGE', isDrawMode: false });
      } else if (currentPoints.length > 0) {
        const lastPoint = currentPoints[currentPoints.length - 1];
        setRedoPoints((prev) => [...prev, lastPoint]);
        setCurrentPoints((prev) => prev.slice(0, -1));
      }
    } else {
      const polygons = history.undo();
      if (polygons) {
        onAction({ type: 'SET_POLYGONS', polygons });
      }
    }
  });

  const handleRedo = useEventCallback(() => {
    if (isDrawMode) {
      if (redoPoints.length > 0) {
        const point = redoPoints[redoPoints.length - 1];
        setRedoPoints((prev) => prev.slice(0, -1));
        setCurrentPoints((prev) => [...prev, point]);
      }
    } else {
      const polygons = history.redo();
      if (polygons) {
        onAction({ type: 'SET_POLYGONS', polygons });
      }
    }
  });

  const handleCanvasClick = useEventCallback((e) => {
    if (!isDrawMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // snap to start point to close the polygon when >= 3 points exist
    if (currentPoints.length >= 3) {
      const startPoint = currentPoints[0];
      const dist = Math.sqrt((x - startPoint[0]) ** 2 + (y - startPoint[1]) ** 2);
      if (dist < CLOSE_THRESHOLD) {
        onAction({
          type: 'POLYGON_COMPLETE',
          polygon: { points: currentPoints, color: currentColor },
        });
        return;
      }
    }

    setCurrentPoints((prev) => [...prev, [x, y]]);
    setRedoPoints([]);
  });

  const handleMouseMove = useEventCallback((e) => {
    if (!isDrawMode || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    if (x < 0 || x > 1 || y < 0 || y > 1) {
      setMousePos(null);
    } else {
      setMousePos([x, y]);
    }
  });

  const handleMouseLeave = useEventCallback(() => {
    setMousePos(null);
  });

  const exitDrawMode = useEventCallback(() => {
    onAction({ type: 'DRAW_MODE_CHANGE', isDrawMode: false });
  });

  const startDrawingWithColor = useEventCallback((color) => {
    setCurrentColor(color);
    onAction({ type: 'DRAW_MODE_CHANGE', isDrawMode: true });
  });

  return {
    currentPoints,
    currentColor,
    mousePos,
    canUndo: isDrawMode ? currentPoints.length > 0 : history.canUndo,
    canRedo: isDrawMode ? redoPoints.length > 0 : history.canRedo,

    handleUndo,
    handleRedo,
    handleCanvasClick,
    handleMouseMove,
    handleMouseLeave,
    exitDrawMode,
    startDrawingWithColor,

    containerRef,
  };
}
