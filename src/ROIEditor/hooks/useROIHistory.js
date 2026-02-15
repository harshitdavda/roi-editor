import useEventCallback from './useEventCallback';
import { useEffect, useReducer, useRef } from 'react';

function historyReducer(state, action) {
  switch (action.type) {
    case 'PUSH':
      return {
        // discard any future snapshots (redo stack) before pushing
        snapshots: [...state.snapshots.slice(0, state.index + 1), action.polygons],
        index: state.index + 1,
      };
    case 'UNDO':
      if (state.index <= 0) return state;
      return { ...state, index: state.index - 1 };
    case 'REDO':
      if (state.index >= state.snapshots.length - 1) return state;
      return { ...state, index: state.index + 1 };
  }
}

/**
 * Tracks polygon snapshots for operation-level undo/redo.
 * Lives inside the editor — detects external changes (deletes) via reference comparison
 * and records polygon-complete results as they arrive from the parent.
 * On undo/redo, returns the target snapshot so the caller can emit SET_POLYGONS.
 */
export function useROIHistory(polygons) {
  const [state, dispatch] = useReducer(historyReducer, {
    snapshots: [polygons],
    index: 0,
  });

  // flag to skip recording changes caused by our own undo/redo
  const skipNextRef = useRef(false);
  const prevPolygonsRef = useRef(polygons);

  // detect external changes (sidebar delete, or parent processing our POLYGON_COMPLETE)
  useEffect(() => {
    // same reference — nothing changed (also handles mount & strict-mode double-invoke)
    if (polygons === prevPolygonsRef.current) return;
    prevPolygonsRef.current = polygons;

    if (skipNextRef.current) {
      skipNextRef.current = false;
      return;
    }

    dispatch({ type: 'PUSH', polygons });
  }, [polygons]);

  const undo = useEventCallback(() => {
    if (state.index <= 0) return null;
    skipNextRef.current = true;
    dispatch({ type: 'UNDO' });
    return state.snapshots[state.index - 1];
  });

  const redo = useEventCallback(() => {
    if (state.index >= state.snapshots.length - 1) return null;
    skipNextRef.current = true;
    dispatch({ type: 'REDO' });
    return state.snapshots[state.index + 1];
  });

  return {
    canUndo: state.index > 0,
    canRedo: state.index < state.snapshots.length - 1,
    undo,
    redo,
  };
}
