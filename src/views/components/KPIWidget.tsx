/**
 * views/components/KPIWidget.tsx
 * -----------------------------------------------------------------------------
 * Reusable KPI card. Used across the Executive and Sustainability dashboards to
 * render a headline metric with an optional delta and accent color.
 */

import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import type { ReactNode } from 'react';

interface KPIWidgetProps {
  title: string;
  value: string;
  changePct?: number;
  icon?: ReactNode;
  accent?: string;
}

export default function KPIWidget({ title, value, changePct, icon, accent = '#0B5394' }: KPIWidgetProps) {
  const positive = (changePct ?? 0) >= 0;

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          {icon && <Box sx={{ color: accent }}>{icon}</Box>}
        </Stack>

        <Typography variant="h4" fontWeight={700} sx={{ mt: 1, color: accent }}>
          {value}
        </Typography>

        {changePct !== undefined && (
          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 1 }}>
            {positive ? (
              <ArrowUpwardIcon fontSize="small" color="success" />
            ) : (
              <ArrowDownwardIcon fontSize="small" color="error" />
            )}
            <Typography variant="body2" color={positive ? 'success.main' : 'error.main'}>
              {Math.abs(changePct)}% vs prior period
            </Typography>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
