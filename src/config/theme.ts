/**
 * config/theme.ts
 * -----------------------------------------------------------------------------
 * MUI theme for the portal. Johns Manville brand-leaning palette (deep blue
 * primary, green secondary for sustainability accents).
 */

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0B5394' },
    secondary: { main: '#2E7D32' },
    background: { default: '#F5F6F8', paper: '#FFFFFF' },
  },
  typography: {
    fontFamily: 'Inter, Roboto, system-ui, Arial, sans-serif',
    h4: { fontWeight: 700 },
  },
  shape: { borderRadius: 10 },
});

export default theme;
