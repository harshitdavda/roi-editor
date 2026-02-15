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
    case 'RESET':
      return { snapshots: [action.polygons], index: 0 };
    default:
      return state;
  }
}

/**
 * Tracks polygon snapshots for operation-level undo/redo.
 * Detects external changes via length comparison.
 * Initial polygons (e.g. from network) are treated as the base state.
 * Only single-item additions (from drawing) and deletions are tracked as undoable operations.
 */
export function useROIHistory(polygons) {
  const safePolygons = polygons ?? [];

  const [state, dispatch] = useReducer(historyReducer, {
    snapshots: [safePolygons],
    index: 0,
  });

  // flag to skip recording changes caused by our own undo/redo
  const skipNextRef = useRef(false);
  const prevLengthRef = useRef(safePolygons.length);

  useEffect(() => {
    const currentLength = (polygons ?? []).length;
    const prevLength = prevLengthRef.current;
    prevLengthRef.current = currentLength;

    // no length change → nothing meaningful changed, skip
    if (currentLength === prevLength) return;

    // this change was from our own undo/redo → skip recording
    if (skipNextRef.current) {
      skipNextRef.current = false;
      return;
    }

    const diff = currentLength - prevLength;

    // bulk addition (more than 1 at once) = initial load or external reset → set as new base
    if (diff > 1) {
      dispatch({ type: 'RESET', polygons: polygons ?? [] });
    } else {
      // single addition (user drew) or any deletion (external) → track as operation
      dispatch({ type: 'PUSH', polygons: polygons ?? [] });
    }
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
