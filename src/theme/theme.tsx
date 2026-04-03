// theme.tsx
import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { FC, ReactNode, useMemo, createContext, useContext, useState } from 'react';
import getComponents from './components';
import getPalette from './palette';
import typography from './typography';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeModeContext = createContext<{
  toggleMode: () => void;
  mode: 'light' | 'dark';
}>({
  toggleMode: () => {},
  mode: 'dark',                       // ← default to dark (matches redesign)
});

export const useThemeMode = () => useContext(ThemeModeContext);

const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark'); // ← dark by default

  const toggleMode = () =>
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));

  // Step 1: build palette + typography first
  const baseTheme = useMemo(
    () =>
      createTheme({
        typography,
        palette: getPalette(mode),
      }),
    [mode],
  );

  // Step 2: inject component overrides that reference the resolved theme
  const theme = useMemo(
    () =>
      createTheme(baseTheme, {
        components: getComponents(baseTheme),
      }),
    [baseTheme]
  );

  return (
    <ThemeModeContext.Provider value={{ toggleMode, mode }}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export default ThemeProvider;