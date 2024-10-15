// src/components/Home.js
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

  const navigateTo = (path) => {
    navigate(path); // history.push 대신 navigate 함수 사용
  };

  return (
    <Container sx={{ textAlign: 'center', marginTop: '50px' }}>
      <Box>
        <img
          src={process.env.PUBLIC_URL + '/dss.png'}
          alt="DSS"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      </Box>
      <Typography variant="h4" gutterBottom sx={{ marginTop: '20px' }}>
        동적파도타기법(동파법) 홈페이지
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        <Button variant="contained" color="primary" onClick={() => navigateTo('/backtest')}>
          동파법 백테스트
        </Button>
        <Button variant="contained" color="secondary" onClick={() => navigateTo('/calculator')}>
          퉁치기 계산기
        </Button>
      </Box>
    </Container>
  );
};

export default Home;