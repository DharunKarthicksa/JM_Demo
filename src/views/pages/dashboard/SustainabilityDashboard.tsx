/**
 * views/pages/dashboard/SustainabilityDashboard.tsx
 * -----------------------------------------------------------------------------
 * Route: /dashboard/sustainability
 *
 * Tracks ESG metrics. Demonstrates:
 *   - Uses the selected plant from the shared plantContext (data carried over
 *     from Plant Performance) to scope energy/emissions/water series.
 *   - Uses the shared date filters (GlobalFilters).
 *
 * API calls:
 *   GET /api/esg/energy
 *   GET /api/esg/emissions
 *   GET /api/esg/water
 *   GET /api/esg/score
 */

import { Grid, Typography, Box } from '@mui/material';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import Co2Icon from '@mui/icons-material/Co2';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { LineChart } from '@mui/x-charts/LineChart';

import GlobalFilters from '../../components/GlobalFilters';
import ChartContainer from '../../components/ChartContainer';
import KPIWidget from '../../components/KPIWidget';
import { usePlantContext } from '../../../controllers/context/plantContext';
import {
  useEnergyUsage, useEmissions, useWaterConsumption, useSustainabilityScore,
} from '../../../controllers/hooks/useSustainabilityData';

export default function SustainabilityDashboard() {
  const { selectedPlantId } = usePlantContext();

  const energy = useEnergyUsage(selectedPlantId);
  const emissions = useEmissions(selectedPlantId);
  const water = useWaterConsumption(selectedPlantId);
  const score = useSustainabilityScore();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Sustainability
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {selectedPlantId ? `Scoped to plant ${selectedPlantId}` : 'All plants'} (carried from Plant Performance)
      </Typography>
      <GlobalFilters />

      {/* Score KPIs */}
      <Grid container spacing={2} sx={{ mb: 1, width: '100%' }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPIWidget title="Sustainability Score" value={score.data ? String(score.data.overall) : '—'} icon={<EmojiEventsIcon />} accent="#2E7D32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPIWidget title="Environmental" value={score.data ? String(score.data.environmental) : '—'} accent="#2E7D32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPIWidget title="Social" value={score.data ? String(score.data.social) : '—'} accent="#0B5394" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <KPIWidget title="Governance" value={score.data ? String(score.data.governance) : '—'} accent="#6A1B9A" />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ChartContainer title="Energy Usage (kWh)" action={<EnergySavingsLeafIcon color="action" />} loading={energy.loading} error={energy.error}>
            {energy.data && (
              <LineChart
                height={240}
                xAxis={[{ scaleType: 'point', data: energy.data.series.map((d) => d.date) }]}
                series={[{ data: energy.data.series.map((d) => d.kwh), label: 'kWh', color: '#2E7D32' }]}
              />
            )}
          </ChartContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ChartContainer title="Carbon Emissions (t CO₂)" action={<Co2Icon color="action" />} loading={emissions.loading} error={emissions.error}>
            {emissions.data && (
              <LineChart
                height={240}
                xAxis={[{ scaleType: 'point', data: emissions.data.series.map((d) => d.date) }]}
                series={[{ data: emissions.data.series.map((d) => d.co2Tons), label: 't CO₂', color: '#616161' }]}
              />
            )}
          </ChartContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <ChartContainer title="Water Consumption (m³)" action={<WaterDropIcon color="action" />} loading={water.loading} error={water.error}>
            {water.data && (
              <LineChart
                height={240}
                xAxis={[{ scaleType: 'point', data: water.data.series.map((d) => d.date) }]}
                series={[{ data: water.data.series.map((d) => d.cubicMeters), label: 'm³', color: '#0288D1' }]}
              />
            )}
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
