import useEventCallback from '../hooks/useEventCallback';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { PencilIcon } from '../icons/PencilIcon';
import { RedoIcon } from '../icons/RedoIcon';
import { UndoIcon } from '../icons/UndoIcon';
import { ColorPicker } from './ColorPicker';

const STYLES = {
  toolbarRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    flexShrink: 0,
    backgroundColor: '#1C212B',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1016',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 9999,
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 6,
    paddingBottom: 6,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    gap: 4,
  },
  iconButtonBase: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 9999,
    cursor: 'pointer',
    color: '#7E8A9A',
    transition: 'color 0.2s, background-color 0.2s',
  },
  iconButtonDisabled: {
    opacity: 0.3,
    pointerEvents: 'none',
    cursor: 'not-allowed',
  },
  pencilWrapper: { position: 'relative' },
  pencilDot: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 9999,
    border: '2px solid #0D1016',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  },
  colorPopover: {
    position: 'absolute',
    left: '50%',
    bottom: '100%',
    transform: 'translate(-50%, -12px)',
    zIndex: 10,
  },
  buttonReset: {
    margin: 0,
    border: 'none',
    background: 'none',
    font: 'inherit',
    cursor: 'pointer',
  },
};

export const ROIToolbar = memo(function ROIToolbar({
  canRedo,
  canUndo,
  currentColor,
  isDrawMode,
  onExitDrawMode,
  onRedo,
  onSelectColor,
  onUndo,
}) {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const pencilWrapperRef = useRef(null);

  useEffect(() => {
    if (isDrawMode) {
      setColorPickerOpen(false);
    }
  }, [isDrawMode]);

  const handlePencilClick = useEventCallback(() => {
    if (isDrawMode) {
      onExitDrawMode();
      setColorPickerOpen(false);
    } else {
      setColorPickerOpen(!colorPickerOpen);
    }
  });

  const handleColorSelect = useEventCallback((color) => {
    onSelectColor(color);
    setColorPickerOpen(false);
  });

  const handleClickOutside = useCallback(
    (e) => {
      if (
        colorPickerOpen &&
        pencilWrapperRef.current &&
        !pencilWrapperRef.current.contains(e.target)
      ) {
        setColorPickerOpen(false);
      }
    },
    [colorPickerOpen],
  );
  useEffect(() => {
    if (!colorPickerOpen) return;
    const t = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
    return () => {
      clearTimeout(t);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorPickerOpen, handleClickOutside]);

  const undoButtonStyle = {
    ...STYLES.buttonReset,
    ...STYLES.iconButtonBase,
    ...(canUndo ? {} : STYLES.iconButtonDisabled),
  };
  const redoButtonStyle = {
    ...STYLES.buttonReset,
    ...STYLES.iconButtonBase,
    ...(canRedo ? {} : STYLES.iconButtonDisabled),
  };
  const pencilButtonStyle = {
    ...STYLES.buttonReset,
    ...STYLES.iconButtonBase,
    position: 'relative',
    padding: 12,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: isDrawMode || colorPickerOpen ? '#2A303C' : '#20252E',
    color: isDrawMode || colorPickerOpen ? '#E0E6EB' : '#7E8A9A',
  };
  const pencilDotStyle = {
    ...STYLES.pencilDot,
    backgroundColor: currentColor,
  };

  return (
    <div style={STYLES.toolbarRow}>
      <div style={STYLES.buttonGroup}>
        <button
          disabled={!canUndo}
          onClick={onUndo}
          style={undoButtonStyle}
          title="Undo"
          type="button"
        >
          <UndoIcon className="w-5 h-5" />
        </button>

        <div ref={pencilWrapperRef} style={STYLES.pencilWrapper}>
          <button onClick={handlePencilClick} style={pencilButtonStyle} type="button">
            <PencilIcon className="w-5 h-5" />
            <div style={pencilDotStyle} />
          </button>

          {colorPickerOpen && (
            <div style={STYLES.colorPopover}>
              <ColorPicker currentColor={currentColor} onSelectColor={handleColorSelect} />
            </div>
          )}
        </div>

        <button
          disabled={!canRedo}
          onClick={onRedo}
          style={redoButtonStyle}
          title="Redo"
          type="button"
        >
          <RedoIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});
