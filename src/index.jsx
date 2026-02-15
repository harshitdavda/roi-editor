import React, { useCallback } from 'react';
import { ROIEditor } from './ROIEditor/components/ROIEditor';

export default function Imageeditorroi(props) {
  const { data, emitOnChange } = props;
  console.log('data', data);

  const onAction = useCallback((action) => {
    emitOnChange({ action });
  }, [emitOnChange]);

  return <ROIEditor data={data} onAction={onAction} />;
}
