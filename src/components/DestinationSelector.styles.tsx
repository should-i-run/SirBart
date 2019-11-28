import { Platform, ViewStyle, TextStyle } from 'react-native';

import { genericText, colors } from '../styles';

const styles: { [k: string]: ViewStyle | TextStyle } = {
  wrapper: {
    ...(Platform.OS === 'ios' ? { zIndex: 100 } : {}),
    justifyContent: 'flex-start',
    backgroundColor: colors.layer1,
    shadowColor: colors.shadow,
    shadowRadius: 10,
    shadowOpacity: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  pickerContainer: {
    padding: 10,
  },
  picker: {
    alignItems: 'center',
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  genericText,
  label: {
    ...genericText,
  },
  leftRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destToken: {
    height: 60,
    width: 60,
    borderRadius: 60,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.button,
  },
  destTokenLabel: {
    ...genericText,
    fontSize: 12,
  },
  destTokenIcon: {
    fontSize: 24,
  },
  destTokenContainer: {
    width: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    borderColor: colors.lightText,
  },
  disabledText: {
    color: colors.disabledText,
  },
};

export default styles;
