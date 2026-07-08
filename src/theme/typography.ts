import { TextStyle } from 'react-native';

export const typography = {
  hero: { fontSize: 48, fontWeight: '700' as TextStyle['fontWeight'], letterSpacing: -1 },
  title: { fontSize: 28, fontWeight: '700' as TextStyle['fontWeight'], letterSpacing: -0.5 },
  heading: { fontSize: 20, fontWeight: '600' as TextStyle['fontWeight'] },
  subheading: { fontSize: 16, fontWeight: '600' as TextStyle['fontWeight'] },
  body: { fontSize: 15, fontWeight: '400' as TextStyle['fontWeight'] },
  caption: { fontSize: 13, fontWeight: '400' as TextStyle['fontWeight'] },
  small: { fontSize: 11, fontWeight: '500' as TextStyle['fontWeight'] },
  tab: { fontSize: 10, fontWeight: '500' as TextStyle['fontWeight'] },
};
