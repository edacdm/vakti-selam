

const tintColorLight = '#0a7ea4';
const tintColorDark = '#ffffff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#ffffff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
  luxury: {
    midnight: '#05070A',
    midnightDeep: '#0B101E',
    gold: '#D4AF37',
    goldGlow: 'rgba(212, 175, 55, 0.4)',
    goldLight: '#FFD700',
    glass: 'rgba(255, 255, 255, 0.03)',
    textGold: '#E2C275',
  }
} as const;

