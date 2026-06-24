/**
 * views/pages/dashboard/PlantPerformanceDashboard.tsx
 * -----------------------------------------------------------------------------
 * Route: /dashboard/plants
 *
 * Monitors plant-wise production. Demonstrates:
 *   - Receiving the selected plant from the Executive Dashboard via the shared
 *     plantContext (defaults to the first plant if arrived at directly).
 *   - Parameterized API calls keyed on plantId.
 *   - Cross-page navigation to the Asset Health Dashboard for the same plant.
 *
 * API calls:
 *   GET /api/plants
 *   GET /api/plants/{plantId}/production
 *   GET /api/plants/{plantId}/downtime
 *   GET /api/plants/{plantId}/oee
 */

import { useEffect } from 'react';
import {
  Grid, Typography, Box, MenuItem, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, LinearProgress, Stack,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { useNavigate } from 'react-router-dom';

import GlobalFilters from '../../components/GlobalFilters';
import ChartContainer from '../../components/ChartContainer';
import { usePlantContext } from '../../../controllers/context/plantContext';
import { ROUTES } from '../../../config/constants';
import {
  usePlants, usePlantProduction, usePlantDowntime, usePlantOee,
} from '../../../controllers/hooks/usePlantData';

export default function PlantPerformanceDashboard() {
  const navigate = useNavigate();
  const { selectedPlantId, setSelectedPlantId } = usePlantContext();

  const plants = usePlants();
  const production = usePlantProduction(selectedPlantId);
  const downtime = usePlantDowntime(selectedPlantId);
  const oee = usePlantOee(selectedPlantId);

  // If we landed here without a selection, default to the first plant.
  useEffect(() => {
    if (!selectedPlantId && plants.data && plants.data.length > 0) {
      setSelectedPlantId(plants.data[0].id);
    }
  }, [selectedPlantId, plants.data, setSelectedPlantId]);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Plant Performance
        </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          disabled={!selectedPlantId}
          onClick={() => navigate(ROUTES.ASSETS)}
        >
          View Asset Health
        </Button>
      </Stack>

      <GlobalFilters />

      {/* Plant selector */}
      <TextField
        select
        label="Plant"
        size="small"
        sx={{ minWidth: 260, mb: 2 }}
        value={selectedPlantId ?? ''}
        onChange={(e) => setSelectedPlantId(e.target.value)}
      >
        {plants.data?.map((p) => (
          <MenuItem key={p.id} value={p.id}>
            {p.name} ({p.region})
          </MenuItem>
        ))}
      </TextField>

      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer title="Production Trend (tons)" loading={production.loading} error={production.error}>
            {production.data && (
              <LineChart
                height={260}
                xAxis={[{ scaleType: 'point', data: production.data.map((d) => d.date) }]}
                series={[{ data: production.data.map((d) => d.tons), label: 'Tons', color: '#0B5394' }]}
              />
            )}
          </ChartContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer title="Downtime (minutes)" loading={downtime.loading} error={downtime.error}>
            {downtime.data && (
              <BarChart
                height={260}
                xAxis={[{ scaleType: 'band', data: downtime.data.map((d) => d.date) }]}
                series={[{ data: downtime.data.map((d) => d.minutes), label: 'Minutes', color: '#ED6C02' }]}
              />
            )}
          </ChartContainer>
        </Grid>

        <Grid size={12}>
          <ChartContainer title="Equipment Efficiency (OEE)" loading={oee.loading} error={oee.error}>
            {oee.data && (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Metric</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell width="50%">Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {[
                    ['Availability', oee.data.availabilityPct],
                    ['Performance', oee.data.performancePct],
                    ['Quality', oee.data.qualityPct],
                    ['Overall OEE', oee.data.oeePct],
                  ].map(([label, val]) => (
                    <TableRow key={label as string}>
                      <TableCell>{label}</TableCell>
                      <TableCell>{val}%</TableCell>
                      <TableCell>
                        <LinearProgress variant="determinate" value={val as number} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
