/**
 * App.tsx
 * -----------------------------------------------------------------------------
 * Application root. Composes the global providers and the router:
 *
 *   ThemeProvider
 *     └ AuthProvider          (shared auth state)
 *         └ PlantProvider     (shared plant + filter state)
 *             └ RouterProvider (routes from config/routes.tsx)
 *
 * The provider nesting is itself part of the architecture the analysis tool can
 * read: every page sits inside both contexts.
 */

import { ThemeProvider, CssBaseline } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import theme from './config/theme';
import routes from './controllers/routes';
import { AuthProvider } from './controllers/context/AuthContext';
import { PlantProvider } from './controllers/context/plantContext';

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PlantProvider>
          <RouterProvider router={router} />
        </PlantProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
