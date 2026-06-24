/**
 * views/components/LoadingSpinner.tsx
 * -----------------------------------------------------------------------------
 * Tiny reusable loading indicator used by every dashboard while data resolves.
 */

import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  label?: string;
  height?: number;
}

export default function LoadingSpinner({ label = 'Loading…', height = 160 }: LoadingSpinnerProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={1.5}
      height={height}
    >
      <CircularProgress size={32} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}
