/**
 * views/pages/dashboard/ExecutiveDashboard.tsx
 * -----------------------------------------------------------------------------
 * Route: /dashboard/executive
 *
 * Top-level KPIs for Johns Manville. Demonstrates:
 *   - Four cached GET calls (via useExecutiveData hooks).
 *   - Shared GlobalFilters + KPIWidget + ChartContainer components.
 *   - Cross-page navigation: clicking a plant sets selectedPlantId in the
 *     shared plantContext and routes to the Plant Performance dashboard
 *     (Executive -> Plant Performance, carrying the selected plant).
 *
 * API calls:
 *   GET /api/executive/kpis
 *   GET /api/plants/utilization
 *   GET /api/safety/incidents
 *   GET /api/geo/manufacturing-sites
 */

import { Grid, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Button, Chip } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import SpeedIcon from '@mui/icons-material/Speed';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import PublicIcon from '@mui/icons-material/Public';
import { useNavigate } from 'react-router-dom';

import GlobalFilters from '../../components/GlobalFilters';
import KPIWidget from '../../components/KPIWidget';
import ChartContainer from '../../components/ChartContainer';
import { usePlantContext } from '../../../controllers/context/plantContext';
import { ROUTES } from '../../../config/constants';
import {
  useExecutiveKpis,
  usePlantUtilization,
  useSafetyIncidents,
  useManufacturingSites,
} from '../../../controllers/hooks/useExecutiveData';

const fmtUsd = (n: number) => `$${(n / 1e9).toFixed(2)}B`;
const fmtTons = (n: number) => `${(n / 1e6).toFixed(2)}M t`;

export default function ExecutiveDashboard() {
  const navigate = useNavigate();
  const { setSelectedPlantId } = usePlantContext();

  const kpis = useExecutiveKpis();
  const utilization = usePlantUtilization();
  const incidents = useSafetyIncidents();
  const sites = useManufacturingSites();

  /** Cross-page navigation: carry the chosen plant to Plant Performance. */
  const goToPlant = (plantId: string) => {
    setSelectedPlantId(plantId);
    navigate(ROUTES.PLANTS);
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Executive Dashboard
      </Typography>
      <GlobalFilters />

      {/* KPI row */}
      <Grid container spacing={2} sx={{ mb: 1, width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPIWidget
            title="Revenue"
            value={kpis.data ? fmtUsd(kpis.data.revenue.valueUsd) : '—'}
            changePct={kpis.data?.revenue.changePct}
            icon={<AttachMoneyIcon />}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPIWidget
            title="Production"
            value={kpis.data ? fmtTons(kpis.data.production.tons) : '—'}
            changePct={kpis.data?.production.changePct}
            icon={<PrecisionManufacturingIcon />}
            accent="#2E7D32"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPIWidget
            title="Plant Utilization"
            value={kpis.data ? `${kpis.data.plantUtilizationPct}%` : '—'}
            icon={<SpeedIcon />}
            accent="#ED6C02"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPIWidget
            title="Safety Incidents"
            value={kpis.data ? String(kpis.data.safetyIncidents) : '—'}
            icon={<HealthAndSafetyIcon />}
            accent="#C62828"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 0, width: '100%' }}>
        {/* Plant utilization — click to drill into Plant Performance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer
            title="Plant Utilization"
            subheader="Click a plant to view performance"
            loading={utilization.loading}
            error={utilization.error}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Plant</TableCell>
                  <TableCell align="right">Utilization</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {utilization.data?.map((p) => (
                  <TableRow key={p.plantId} hover>
                    <TableCell>{p.plantName}</TableCell>
                    <TableCell align="right">{p.utilizationPct}%</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => goToPlant(p.plantId)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartContainer>
        </Grid>

        {/* Safety incidents */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer
            title="Recent Safety Incidents"
            loading={incidents.loading}
            error={incidents.error}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Plant</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incidents.data?.map((inc) => (
                  <TableRow key={inc.id}>
                    <TableCell>{inc.date}</TableCell>
                    <TableCell>{inc.plantId}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={inc.severity}
                        color={inc.severity === 'high' ? 'error' : inc.severity === 'medium' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>{inc.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartContainer>
        </Grid>

        {/* Global manufacturing map (rendered as a site list for the demo) */}
        <Grid size={12}>
          <ChartContainer
            title="Global Manufacturing Sites"
            subheader="GET /api/geo/manufacturing-sites"
            loading={sites.loading}
            error={sites.error}
            action={<PublicIcon color="action" />}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Site</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Coordinates</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sites.data?.map((s) => (
                  <TableRow key={s.plantId} hover>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.country}</TableCell>
                    <TableCell>
                      {s.lat.toFixed(2)}, {s.lng.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={s.status}
                        color={s.status === 'operational' ? 'success' : s.status === 'maintenance' ? 'warning' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
