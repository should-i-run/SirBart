import { AsyncStorage } from 'react-native';

export const LAUNCH_COUNT = 'launch_count';

export async function getLaunchCount(): Promise<number> {
  const launchCount = await AsyncStorage.getItem(LAUNCH_COUNT);
  return parseInt(launchCount ? launchCount : '0', 10);
}

export async function incrementLaunchCount() {
  const launchCount = await getLaunchCount();
  return await AsyncStorage.setItem(LAUNCH_COUNT, (launchCount + 1).toString());
}
