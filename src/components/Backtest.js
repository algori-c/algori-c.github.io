// src/components/Backtest.js
import React from 'react';
import { Container, Typography } from '@mui/material';

const Backtest = () => {
  return (
    <Container sx={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        DSS 백테스트
      </Typography>
      <Typography variant="body1">
        DSS 백테스트 기능은 아직 구현되지 않았습니다.
      </Typography>
    </Container>
  );
};

export default Backtest;