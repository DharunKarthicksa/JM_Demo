/**
 * views/pages/auth/LoginPage.tsx
 * -----------------------------------------------------------------------------
 * Login screen. Calls AuthContext.login (-> authService -> POST /api/auth/login)
 * and on success navigates to the originally requested page or the Executive
 * Dashboard. In demo/mock mode any credentials succeed.
 */

import { useState } from 'react';
import {
  Box, Paper, TextField, Button, Typography, Alert, Stack, CircularProgress,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../controllers/context/AuthContext';
import { ROUTES, APP } from '../../../config/constants';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: { pathname: string } } };

  const [email, setEmail] = useState('dana@jm.com');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      const dest = location.state?.from?.pathname ?? ROUTES.EXECUTIVE;
      navigate(dest, { replace: true });
    } catch {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper sx={{ p: 4, width: 380 }} elevation={3}>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h5" fontWeight={800} color="primary">
              {APP.NAME}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {APP.CLIENT} — sign in to continue
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            fullWidth
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>

          <Typography variant="caption" color="text.secondary" textAlign="center">
            Demo mode — any credentials are accepted.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
