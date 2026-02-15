import { memo } from 'react';
import { useROIEditor } from '../hooks/useROIEditor';
import { ROICanvas } from './ROICanvas';
import { ROIToolbar } from './ROIToolbar';

const STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    height: '100%',
    backgroundColor: '#10141D',
    overflow: 'hidden',
  },
};

export const ROIEditor = memo(function ROIEditor({ data, onAction }) {
  const editor = useROIEditor({ data, onAction });

  const isDrawMode = data.isDrawMode ?? false;
  const polygons = data.polygons ?? [];

  return (
    <div style={STYLES.root}>
      <ROICanvas
        containerRef={editor.containerRef}
        currentColor={editor.currentColor}
        currentPoints={editor.currentPoints}
        imageUrl={data.imageUrl}
        isDrawMode={isDrawMode}
        mousePos={editor.mousePos}
        onCanvasClick={editor.handleCanvasClick}
        onMouseLeave={editor.handleMouseLeave}
        onMouseMove={editor.handleMouseMove}
        onPolygonClick={editor.handlePolygonClick}
        polygons={polygons}
        selectedPolygonId={editor.selectedPolygonId}
      />
      <ROIToolbar
        canRedo={editor.canRedo}
        canUndo={editor.canUndo}
        currentColor={editor.currentColor}
        isDrawMode={isDrawMode}
        onChangeColor={editor.changeColor}
        onExitDrawMode={editor.exitDrawMode}
        onRedo={editor.handleRedo}
        onSelectColor={editor.startDrawingWithColor}
        onUndo={editor.handleUndo}
      />
    </div>
  );
});
