/**
 * views/components/GlobalFilters.tsx
 * -----------------------------------------------------------------------------
 * Shared filter bar (date range + region) bound to the global plantContext.
 * Every dashboard renders this, and changing a value here updates the shared
 * filter state that all dashboards read — a clear shared-component + shared-
 * state dependency.
 */

import { Paper, Stack, TextField, MenuItem, Button } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { usePlantContext } from '../../controllers/context/plantContext';

const REGIONS = ['all', 'North America', 'Europe', 'Asia Pacific'];

export default function GlobalFilters() {
  const { globalFilters, setGlobalFilters, resetFilters } = usePlantContext();

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
        <TextField
          label="From"
          type="date"
          size="small"
          value={globalFilters.dateFrom}
          onChange={(e) => setGlobalFilters({ dateFrom: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="To"
          type="date"
          size="small"
          value={globalFilters.dateTo}
          onChange={(e) => setGlobalFilters({ dateTo: e.target.value })}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Region"
          select
          size="small"
          value={globalFilters.region}
          onChange={(e) => setGlobalFilters({ region: e.target.value })}
          sx={{ minWidth: 180 }}
        >
          {REGIONS.map((r) => (
            <MenuItem key={r} value={r}>
              {r === 'all' ? 'All Regions' : r}
            </MenuItem>
          ))}
        </TextField>
        <Button startIcon={<RestartAltIcon />} onClick={resetFilters} size="small">
          Reset
        </Button>
      </Stack>
    </Paper>
  );
}
