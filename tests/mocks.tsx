jest.mock('react-native-code-push', () => {
  const cp = (_: any) => (app: any) => app;
  Object.assign(cp, {
    InstallMode: {},
    CheckFrequency: {},
    SyncStatus: {},
    UpdateState: {},
    DeploymentStatus: {},
    DEFAULT_UPDATE_DIALOG: {},

    checkForUpdate: jest.fn(),
    codePushify: jest.fn(),
    getConfiguration: jest.fn(),
    getCurrentPackage: jest.fn(),
    getUpdateMetadata: jest.fn(),
    log: jest.fn(),
    notifyAppReady: jest.fn(),
    notifyApplicationReady: jest.fn(),
    sync: jest.fn(),
  });
  return cp;
});

jest.mock('react-native-vector-icons/FontAwesome', () => () => 'Icon');

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  requestAuthorization: jest.fn(),
};

(global as any).navigator = { geolocation: mockGeolocation };

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
(global as any).localStorage = localStorageMock;

(global as any).fetch = jest.fn(() => Promise.reject());

jest.mock('Animated', () => {
  return {
    createTimer: jest.fn(),
    timing: jest.fn(() => {
      return {
        start: jest.fn(),
      };
    }),
    Value: jest.fn(() => {
      return {
        interpolate: jest.fn(),
      };
    }),
  };
});
