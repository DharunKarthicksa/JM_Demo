/**
 * views/pages/dashboard/AssetHealthDashboard.tsx
 * -----------------------------------------------------------------------------
 * Route: /dashboard/assets
 *
 * Monitors equipment condition. Demonstrates:
 *   - Triggered from the Plant Performance page (assets filtered by the shared
 *     selectedPlantId).
 *   - Uses the shared authentication service (current user shown; all calls
 *     carry the JWT via the apiService request interceptor).
 *   - A POST mutation (failure prediction) alongside GETs.
 *
 * API calls:
 *   GET  /api/assets
 *   GET  /api/assets/{assetId}/health
 *   GET  /api/assets/{assetId}/maintenance
 *   POST /api/assets/predict-failure
 */

import { useState } from 'react';
import {
  Grid, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, Alert, Stack, LinearProgress,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';

import ChartContainer from '../../components/ChartContainer';
import { usePlantContext } from '../../../controllers/context/plantContext';
import { useAuth } from '../../../controllers/context/AuthContext';
import {
  useAssets, useAssetHealth, useAssetMaintenance, usePredictFailure,
} from '../../../controllers/hooks/useAssetData';

const statusColor = (s: string) =>
  s === 'critical' ? 'error' : s === 'warning' ? 'warning' : 'success';

export default function AssetHealthDashboard() {
  const { selectedPlantId } = usePlantContext();
  const { user } = useAuth(); // shared auth service in use

  const assets = useAssets(selectedPlantId);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const health = useAssetHealth(selectedAssetId);
  const maintenance = useAssetMaintenance(selectedAssetId);
  const prediction = usePredictFailure();

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Asset Health
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {selectedPlantId ? `Showing assets for plant ${selectedPlantId}` : 'Showing all assets'} · Signed in as {user?.name ?? 'unknown'}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 0, width: '100%' }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <ChartContainer title="Assets" loading={assets.loading} error={assets.error}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {assets.data?.map((a) => (
                  <TableRow key={a.id} hover selected={a.id === selectedAssetId}>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.type}</TableCell>
                    <TableCell>
                      <Chip size="small" label={a.status} color={statusColor(a.status)} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => setSelectedAssetId(a.id)}>
                        Inspect
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <ChartContainer
            title="Asset Health"
            subheader={selectedAssetId ?? 'Select an asset'}
            loading={health.loading}
            error={health.error}
          >
            {health.data ? (
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="body2">Health Score</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={health.data.healthScore}
                    color={health.data.healthScore < 50 ? 'error' : health.data.healthScore < 75 ? 'warning' : 'success'}
                  />
                  <Typography variant="caption">{health.data.healthScore}/100</Typography>
                </Box>
                <Typography variant="body2">Vibration: {health.data.vibration} mm/s</Typography>
                <Typography variant="body2">Temperature: {health.data.temperatureC} °C</Typography>

                <Button
                  variant="contained"
                  startIcon={<InsightsIcon />}
                  disabled={!selectedAssetId || prediction.loading}
                  onClick={() => selectedAssetId && prediction.predict({ assetId: selectedAssetId, horizonDays: 30 })}
                >
                  {prediction.loading ? 'Predicting…' : 'Predict Failure'}
                </Button>

                {prediction.result && (
                  <Alert severity={prediction.result.failureProbabilityPct > 50 ? 'warning' : 'success'}>
                    Failure probability: {prediction.result.failureProbabilityPct}% — {prediction.result.recommendedAction}
                  </Alert>
                )}
              </Stack>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Select an asset to view health details.
              </Typography>
            )}
          </ChartContainer>
        </Grid>

        <Grid size={12}>
          <ChartContainer
            title="Maintenance History"
            subheader={selectedAssetId ?? 'Select an asset'}
            loading={maintenance.loading}
            error={maintenance.error}
          >
            {maintenance.data ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Technician</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {maintenance.data.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{m.date}</TableCell>
                      <TableCell>{m.type}</TableCell>
                      <TableCell>{m.technician}</TableCell>
                      <TableCell>{m.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No asset selected.
              </Typography>
            )}
          </ChartContainer>
        </Grid>
      </Grid>
    </Box>
  );
}
