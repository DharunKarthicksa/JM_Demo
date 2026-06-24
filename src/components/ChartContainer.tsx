/**
 * components/ChartContainer.tsx
 * -----------------------------------------------------------------------------
 * Consistent titled container for charts/tables. Handles the loading and error
 * presentation in one place so dashboards stay declarative.
 */

import { Card, CardContent, CardHeader, Divider, Alert } from '@mui/material';
import type { ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';
import type { ApiError } from '../services/apiService';

interface ChartContainerProps {
  title: string;
  subheader?: string;
  loading?: boolean;
  error?: ApiError | null;
  action?: ReactNode;
  children: ReactNode;
}

export default function ChartContainer({
  title,
  subheader,
  loading,
  error,
  action,
  children,
}: ChartContainerProps) {
  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader title={title} subheader={subheader} action={action} titleTypographyProps={{ variant: 'h6' }} />
      <Divider />
      <CardContent>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Alert severity="error">
            {error.message} {error.url ? `(${error.url})` : ''}
          </Alert>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}
