/**
 * views/components/Header.tsx
 * -----------------------------------------------------------------------------
 * Top app bar. Shows the active plant (from shared context) and the logged-in
 * user, and exposes logout. Consumes both AuthContext and plantContext.
 */

import { AppBar, Toolbar, Typography, Box, Chip, IconButton, Tooltip, Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import FactoryIcon from '@mui/icons-material/Factory';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/context/AuthContext';
import { usePlantContext } from '../../controllers/context/plantContext';
import { ROUTES } from '../../config/constants';

export default function Header() {
  const { user, logout } = useAuth();
  const { selectedPlantId } = usePlantContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <AppBar position="sticky" color="inherit" elevation={1}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Manufacturing Analytics
        </Typography>

        {selectedPlantId && (
          <Chip icon={<FactoryIcon />} label={`Active plant: ${selectedPlantId}`} color="primary" variant="outlined" />
        )}

        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar sx={{ width: 30, height: 30, bgcolor: 'primary.main' }}>
              {user.name.charAt(0)}
            </Avatar>
            <Typography variant="body2">{user.name}</Typography>
          </Box>
        )}

        <Tooltip title="Log out">
          <IconButton onClick={handleLogout} size="small">
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
