/**
 * views/components/Sidebar.tsx
 * -----------------------------------------------------------------------------
 * Primary navigation. Supply Chain and Sustainability are reachable directly
 * from here (per the brief), while the Executive -> Plant -> Asset flow is also
 * navigable in-page. Uses React Router's NavLink for active styling.
 */

import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FactoryIcon from '@mui/icons-material/Factory';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import { NavLink } from 'react-router-dom';
import { ROUTES, APP } from '../../config/constants';

const DRAWER_WIDTH = 248;

const NAV_ITEMS = [
  { label: 'Executive', to: ROUTES.EXECUTIVE, icon: <DashboardIcon /> },
  { label: 'Plant Performance', to: ROUTES.PLANTS, icon: <FactoryIcon /> },
  { label: 'Asset Health', to: ROUTES.ASSETS, icon: <PrecisionManufacturingIcon /> },
  { label: 'Supply Chain', to: ROUTES.SUPPLY_CHAIN, icon: <LocalShippingIcon /> },
  { label: 'Sustainability', to: ROUTES.SUSTAINABILITY, icon: <EnergySavingsLeafIcon /> },
];

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
      }}
    >
      <Toolbar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} color="primary">
            {APP.NAME}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {APP.CLIENT}
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            sx={{
              '&.active': {
                bgcolor: 'action.selected',
                borderRight: '3px solid',
                borderColor: 'primary.main',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}

export { DRAWER_WIDTH };
