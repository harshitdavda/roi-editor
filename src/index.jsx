import React, { useCallback } from 'react';
import { ROIEditor } from './ROIEditor/components/ROIEditor';
import './style.css';

const STYLES = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
};

export default function Imageeditorroi(props) {
  const { data, emitOnChange } = props;
  console.log('data', data);

  const onAction = useCallback((action) => {
    emitOnChange({ action });
  }, [emitOnChange]);

  if (!data?.imageUrl) {
    return null;
  }

  return (
    <div style={STYLES.root}>
      <ROIEditor data={data} onAction={onAction} />
    </div>
  );
}
