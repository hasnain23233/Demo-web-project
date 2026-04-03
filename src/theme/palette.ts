// palette.ts
// The app is dark-first. Light mode uses clean whites, dark mode uses deep blacks.

const getPalette = (mode: 'light' | 'dark') => ({
  mode,                              // ← CRITICAL: tells MUI which mode is active
  common: { black: '#000', white: '#fff' },

  primary: {
    main:          mode === 'light' ? '#000000' : '#ffffff',
    contrastText:  mode === 'light' ? '#ffffff' : '#000000',
  },

  background: {
    default: mode === 'light' ? '#ffffff' : '#040404', // page bg
    paper:   mode === 'light' ? '#f5f5f5' : '#080808', // card / surface bg
  },

  text: {
    primary:   mode === 'light' ? '#0a0a0a' : '#ffffff',
    secondary: mode === 'light' ? '#555555' : '#888888',
    disabled:  mode === 'light' ? '#aaaaaa' : '#444444',
  },

  divider: mode === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.07)',

  // Custom tokens — access via theme.palette.custom.*
  custom: {
    // Surfaces
    surfaceSubtle:  mode === 'light' ? '#f0f0f0' : '#0a0a0a',
    surfaceCard:    mode === 'light' ? '#f7f7f7' : '#0d0d0d',
    surfaceDarker:  mode === 'light' ? '#e8e8e8' : '#060606',

    // Borders
    borderFaint:    mode === 'light' ? 'rgba(0,0,0,0.08)'  : 'rgba(255,255,255,0.06)',
    borderSubtle:   mode === 'light' ? 'rgba(0,0,0,0.12)'  : 'rgba(255,255,255,0.10)',
    borderDefault:  mode === 'light' ? 'rgba(0,0,0,0.18)'  : 'rgba(255,255,255,0.15)',

    // Text
    textMuted:      mode === 'light' ? '#888888' : '#444444',
    textFaint:      mode === 'light' ? '#aaaaaa' : '#dac9c9',
    textLabel:      mode === 'light' ? '#333333' : '#666666',

    // Glows / accents
    glowColor:      mode === 'light'
      ? 'rgba(0,0,0,0.04)'
      : 'rgba(255,255,255,0.04)',
    topGlow:        mode === 'light'
      ? 'linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)'
      : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.10), transparent)',
    gridPattern:    mode === 'light'
      ? 'rgba(0,0,0,0.04)'
      : 'rgba(255,255,255,0.03)',
  },
});

// Extend MUI types so TypeScript knows about custom tokens
declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      surfaceSubtle:  string;
      surfaceCard:    string;
      surfaceDarker:  string;
      borderFaint:    string;
      borderSubtle:   string;
      borderDefault:  string;
      textMuted:      string;
      textFaint:      string;
      textLabel:      string;
      glowColor:      string;
      topGlow:        string;
      gridPattern:    string;
    };
  }
  interface PaletteOptions {
    custom?: Partial<Palette['custom']>;
  }
}

export default getPalette;  