import { memo, useCallback } from 'react';
import { COLORS } from '../constants';

const STYLES = {
  pickerWrapper: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'rgba(28, 33, 43, 0.95)',
    backdropFilter: 'blur(12px)',
    padding: 8,
    borderRadius: 9999,
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    gap: 8,
  },
  swatchBase: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  swatchSelected: {
    boxShadow: '0 0 0 2px white',
    outline: '2px solid #1C212B',
    outlineOffset: 2,
  },
  buttonReset: {
    margin: 0,
    border: 'none',
    padding: 0,
    font: 'inherit',
    cursor: 'pointer',
  },
};

export const ColorPicker = memo(function ColorPicker({
  currentColor,
  onSelectColor,
}) {
  const handleSwatchClick = useCallback(
    (e) => {
      const color = e.currentTarget.dataset.color;
      if (color) onSelectColor(color);
    },
    [onSelectColor],
  );

  return (
    <div style={STYLES.pickerWrapper}>
      {COLORS.map((color) => {
        const isSelected = currentColor === color;
        const swatchStyle = {
          ...STYLES.buttonReset,
          ...STYLES.swatchBase,
          backgroundColor: color,
          ...(isSelected ? STYLES.swatchSelected : {}),
        };
        return (
          <button
            data-color={color}
            key={color}
            onClick={handleSwatchClick}
            style={swatchStyle}
            type="button"
          />
        );
      })}
    </div>
  );
});
