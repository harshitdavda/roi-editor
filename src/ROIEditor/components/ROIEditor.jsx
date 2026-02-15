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

  return (
    <div style={STYLES.root}>
      <ROICanvas
        containerRef={editor.containerRef}
        currentColor={editor.currentColor}
        currentPoints={editor.currentPoints}
        imageUrl={data.imageUrl}
        isDrawMode={data.isDrawMode}
        mousePos={editor.mousePos}
        onCanvasClick={editor.handleCanvasClick}
        onMouseLeave={editor.handleMouseLeave}
        onMouseMove={editor.handleMouseMove}
        polygons={data.polygons}
      />
      <ROIToolbar
        canRedo={editor.canRedo}
        canUndo={editor.canUndo}
        currentColor={editor.currentColor}
        isDrawMode={data.isDrawMode}
        onExitDrawMode={editor.exitDrawMode}
        onRedo={editor.handleRedo}
        onSelectColor={editor.startDrawingWithColor}
        onUndo={editor.handleUndo}
      />
    </div>
  );
});
