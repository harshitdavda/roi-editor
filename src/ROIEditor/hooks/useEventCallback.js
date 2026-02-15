// ref: https://github.com/mui/material-ui/blob/57a59692df1d7016a4e46d540eb5b4ff56d83f62/packages/mui-utils/src/useEventCallback/useEventCallback.ts
/** biome-ignore-all lint/complexity/noCommaOperator: not needed */

'use client';
import * as React from 'react';
import useEnhancedEffect from './useEnhancedEffect';

/**
 * Inspired by https://github.com/facebook/react/issues/14099#issuecomment-440013892
 * See RFC in https://github.com/reactjs/rfcs/pull/220
 */
function useEventCallback(fn) {
  const ref = React.useRef(fn);
  useEnhancedEffect(() => {
    ref.current = fn;
  });
  return React.useRef((...args) => (0, ref.current)(...args)).current;
}

export default useEventCallback;
