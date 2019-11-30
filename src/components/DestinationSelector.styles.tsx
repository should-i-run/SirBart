import { ViewStyle, TextStyle } from 'react-native';

import { genericText, colors } from '../styles';

const styles: { [k: string]: ViewStyle | TextStyle } = {
  wrapper: {
    backgroundColor: colors.layer1,
    shadowColor: colors.shadow,
    shadowRadius: 10,
    shadowOpacity: 1,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 10,
  },
  picker: {
    alignItems: 'center',
  },
  selectorItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
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
    height: 30,
    marginBottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destTokenLabel: {
    ...genericText,
    fontSize: 12,
  },
  destTokenContainer: {
    width: 100,
    alignItems: 'center',
  },
  disabledText: {
    color: colors.disabledText,
  },
};

export default styles;
