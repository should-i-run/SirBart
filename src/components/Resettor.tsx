import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { resetStore } from '../actions/dataActions';

export default function Resettor() {
  const dispatch = useDispatch();
  const [appState, setAppState] = useState<AppStateStatus>('active');
  const [lastBackgroundTime, setLastBackgroundTime] = useState<Date>(
    new Date(),
  );
  function handleStateChange(nextAppState: AppStateStatus) {
    if (
      appState.match(/inactive|background/) &&
      nextAppState === 'active' &&
      new Date(Date.now() - 1000 * 60 * 30) > lastBackgroundTime
    ) {
      dispatch(resetStore());
    } else if (
      appState === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      setLastBackgroundTime(new Date());
    }
    setAppState(nextAppState);
  }

  useEffect(() => {
    AppState.addEventListener('change', handleStateChange);
    return () => AppState.removeEventListener('change', handleStateChange);
  }, [appState]);

  return null;
}
