/**
 * views/pages/dashboard/SupplyChainDashboard.tsx
 * -----------------------------------------------------------------------------
 * Route: /dashboard/supplychain
 *
 * Tracks raw material supply. Demonstrates:
 *   - Shared GlobalFilters component reuse.
 *   - Centralized apiService usage (all calls go through `api`).
 *   - A POST mutation (expedite shipment) that refetches afterward.
 *
 * API calls:
 *   GET  /api/inventory
 *   GET  /api/suppliers/performance
 *   GET  /api/shipments
 *   POST /api/shipments/expedite
 */

import {
  Grid, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button,
} from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';

import GlobalFilters from '../../components/GlobalFilters';
import ChartContainer from '../../components/ChartContainer';
import {
  useInventory, useSupplierPerformance, useShipments, useExpediteShipment,
} from '../../../controllers/hooks/useSupplyChainData';

const invColor = (s: string) => (s === 'critical' ? 'error' : s === 'low' ? 'warning' : 'success');
const shipColor = (s: string) => (s === 'delayed' ? 'error' : s === 'delivered' ? 'success' : 'info');

export default function SupplyChainDashboard() {
  const inventory = useInventory();
  const suppliers = useSupplierPerformance();
  const shipments = useShipments();
  const { expedite, loading: expediting } = useExpediteShipment();

  const handleExpedite = async (shipmentId: string) => {
    await expedite(shipmentId);
    shipments.refetch();
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Supply Chain
      </Typography>
      <GlobalFilters />

      <Grid container spacing={2} sx={{ width: '100%' }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer title="Inventory Status" loading={inventory.loading} error={inventory.error}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Material</TableCell>
                  <TableCell>Plant</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {inventory.data?.map((i) => (
                  <TableRow key={i.sku}>
                    <TableCell>{i.material}</TableCell>
                    <TableCell>{i.plantId}</TableCell>
                    <TableCell align="right">{i.quantity} {i.unit}</TableCell>
                    <TableCell>
                      <Chip size="small" label={i.status} color={invColor(i.status)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartContainer>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer title="Supplier Performance" loading={suppliers.loading} error={suppliers.error}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Supplier</TableCell>
                  <TableCell align="right">On-Time %</TableCell>
                  <TableCell align="right">Quality</TableCell>
                  <TableCell align="right">Open Issues</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {suppliers.data?.map((s) => (
                  <TableRow key={s.supplierId}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell align="right">{s.onTimeDeliveryPct}%</TableCell>
                    <TableCell align="right">{s.qualityScore}</TableCell>
                    <TableCell align="right">{s.openIssues}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ChartContainer>
        </Grid>

        <Grid size={12}>
          <ChartContainer title="Shipment Tracking" loading={shipments.loading} error={shipments.error}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Shipment</TableCell>
                  <TableCell>Material</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>ETA</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {shipments.data?.map((sh) => (
                  <TableRow key={sh.id}>
                    <TableCell>{sh.id}</TableCell>
                    <TableCell>{sh.material}</TableCell>
                    <TableCell>
                      <Chip size="small" label={sh.status.replace('_', ' ')} color={shipColor(sh.status)} />
                    </TableCell>
                    <TableCell>{sh.eta}{sh.expedited ? ' (expedited)' : ''}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        startIcon={<BoltIcon />}
                        disabled={expediting || sh.expedited}
                        onClick={() => handleExpedite(sh.id)}
                      >
                        Expedite
                      </Button>
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
