// src/components/Calculator.js
import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Grid, Paper } from '@mui/material';

const Calculator = () => {
  const [buyOrder, setBuyOrder] = useState({ type: 'LOC', price: '', quantity: '' });
  const [sellOrders, setSellOrders] = useState([{ type: 'LOC', price: '', quantity: '' }]);
  const [result, setResult] = useState(null);

  const addSellOrder = () => {
    if (sellOrders.length < 10) {
      setSellOrders([...sellOrders, { type: 'LOC', price: '', quantity: '' }]);
    }
  };

  const removeSellOrder = (index) => {
    setSellOrders(sellOrders.filter((_, i) => i !== index));
  };

  const handleBuyChange = (e) => {
    setBuyOrder({ ...buyOrder, [e.target.name]: e.target.value });
  };

  const handleSellChange = (index, e) => {
    const updatedSellOrders = sellOrders.map((order, i) =>
      i === index ? { ...order, [e.target.name]: e.target.value } : order
    );
    setSellOrders(updatedSellOrders);
  };

  const performCalculation = () => {
    if (!buyOrder.price || !buyOrder.quantity) {
      alert('매수 주문의 가격과 수량을 입력하세요.');
      return;
    }

    const parsedBuyOrder = {
      type: buyOrder.type,
      price: parseFloat(buyOrder.price),
      quantity: parseInt(buyOrder.quantity),
      side: 'BUY'
    };

    const parsedSellOrders = sellOrders.map((order) => ({
      type: order.type,
      price: order.type.includes('LOC') ? parseFloat(order.price) : 0.0,
      quantity: parseInt(order.quantity),
      side: 'SELL'
    }));

    const { newSellOrders, newBuyOrders } = processOrders(parsedBuyOrder, parsedSellOrders);

    setResult({ newSellOrders, newBuyOrders });
  };

  const processOrders = (buy, sells) => {
    let sellOrders = [...sells];
    let buyOrders = [buy];

    if (sellOrders.length === 0 || buyOrders.length === 0) {
      return { newSellOrders: sellOrders, newBuyOrders: buyOrders };
    }

    let buyOrder = buyOrders[0];

    let filteredSellOrders = [];
    let newSellOrders = [];
    let newBuyOrders = [];

    let sellMocOrder = null;
    let bExistMoc = false;

    sellOrders.forEach((sellOrder) => {
      if (sellOrder.type === 'MOC') {
        sellMocOrder = sellOrder;
        bExistMoc = true;
      } else if (sellOrder.price <= buyOrder.price) {
        filteredSellOrders.push(sellOrder);
      } else {
        newSellOrders.push(sellOrder);
      }
    });

    if (!bExistMoc && filteredSellOrders.length === 0) {
      return { newSellOrders, newBuyOrders };
    }

    if (bExistMoc) {
      if (sellMocOrder.quantity > buyOrder.quantity) {
        newSellOrders.push({ ...sellMocOrder, quantity: sellMocOrder.quantity - buyOrder.quantity });
        buyOrder.quantity = 0;
      } else if (sellMocOrder.quantity === buyOrder.quantity) {
        buyOrder.quantity = 0;
      } else {
        buyOrder.quantity -= sellMocOrder.quantity;
        if (filteredSellOrders.length === 0) {
          newSellOrders.push({
            type: 'LOC',
            price: parseFloat((buyOrder.price + 0.01).toFixed(2)),
            quantity: sellMocOrder.quantity,
            side: 'SELL'
          });
        }
      }
    }

    filteredSellOrders.sort((a, b) => a.price - b.price);

    filteredSellOrders.forEach((sellOrder) => {
      if (buyOrder.quantity === 0) {
        newSellOrders.push(sellOrder);
        return;
      }

      if (sellOrder.quantity >= buyOrder.quantity) {
        const newBuyPrice = parseFloat((sellOrder.price - 0.01).toFixed(2));
        newBuyOrders.push({ type: 'LOC', price: newBuyPrice, quantity: buyOrder.quantity, side: 'BUY' });

        if (sellOrder.quantity > buyOrder.quantity) {
          const newSellQuantity = sellOrder.quantity - buyOrder.quantity;
          newSellOrders.push({ ...sellOrder, quantity: newSellQuantity });
        }
        buyOrder.quantity = 0;
      } else {
        const newBuyPrice = parseFloat((sellOrder.price - 0.01).toFixed(2));
        newBuyOrders.push({ type: 'LOC', price: newBuyPrice, quantity: sellOrder.quantity, side: 'BUY' });
        buyOrder.quantity -= sellOrder.quantity;
      }
    });

    if (buyOrder.quantity !== 0) {
      newBuyOrders.push({ ...buyOrder, price: parseFloat(buyOrder.price.toFixed(2)) });
      const sellQuant = filteredSellOrders.reduce((acc, order) => acc + order.quantity, 0);
      if (sellQuant !== 0) {
        const newSellPrice = parseFloat((buyOrder.price + 0.01).toFixed(2));
        newSellOrders.push({ type: 'LOC', price: newSellPrice, quantity: sellQuant, side: 'SELL' });
      }
    } else {
      const newSellPrice = parseFloat((buyOrder.price + 0.01).toFixed(2));
      newSellOrders.push({ type: 'LOC', price: newSellPrice, quantity: buyOrder.quantity, side: 'SELL' });
    }

    newSellOrders.sort((a, b) => b.price - a.price);
    newBuyOrders.sort((a, b) => b.price - a.price);

    return { newSellOrders, newBuyOrders };
  };

  return (
    <Container sx={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom align="center">
        퉁치기 계산기
      </Typography>
      <Paper sx={{ padding: '20px', marginBottom: '30px' }}>
        <Typography variant="h6" gutterBottom>
          매수 주문
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={3}>
            <TextField
              label="종류"
              name="type"
              value={buyOrder.type}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="가격"
              name="price"
              type="number"
              value={buyOrder.price}
              onChange={handleBuyChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="수량"
              name="quantity"
              type="number"
              value={buyOrder.quantity}
              onChange={handleBuyChange}
              fullWidth
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ padding: '20px', marginBottom: '30px' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">매도 주문</Typography>
          <Button variant="outlined" onClick={addSellOrder} disabled={sellOrders.length >= 10}>
            매도 주문 추가
          </Button>
        </Box>
        {sellOrders.map((order, index) => (
          <Grid container spacing={2} key={index} alignItems="center" mb={2}>
            <Grid item xs={12} sm={2}>
              <TextField
                label="종류"
                name="type"
                value={order.type}
                onChange={(e) => handleSellChange(index, e)}
                fullWidth
                select
                SelectProps={{ native: true }}
              >
                <option value="LOC">LOC</option>
                <option value="MOC">MOC</option>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="가격"
                name="price"
                type="number"
                value={order.price}
                onChange={(e) => handleSellChange(index, e)}
                fullWidth
                disabled={order.type !== 'LOC'}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="수량"
                name="quantity"
                type="number"
                value={order.quantity}
                onChange={(e) => handleSellChange(index, e)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="outlined" color="error" onClick={() => removeSellOrder(index)}>
                삭제
              </Button>
            </Grid>
          </Grid>
        ))}
      </Paper>

      <Box textAlign="center" mb={4}>
        <Button variant="contained" color="primary" onClick={performCalculation}>
          계산하기
        </Button>
      </Box>

      {result && (
        <Paper sx={{ padding: '20px', marginTop: '30px' }}>
          <Typography variant="h6" gutterBottom>
            계산 결과
          </Typography>
          <Typography variant="subtitle1">새로운 매수 주문:</Typography>
          {result.newBuyOrders.length > 0 ? (
            result.newBuyOrders.map((order, index) => (
              <Typography key={index}>
                {order.type} - 가격: {order.price}, 수량: {order.quantity}, 방향: {order.side}
              </Typography>
            ))
          ) : (
            <Typography>없음</Typography>
          )}

          <Typography variant="subtitle1" mt={2}>
            새로운 매도 주문:
          </Typography>
          {result.newSellOrders.length > 0 ? (
            result.newSellOrders.map((order, index) => (
              <Typography key={index}>
                {order.type} - 가격: {order.price}, 수량: {order.quantity}, 방향: {order.side}
              </Typography>
            ))
          ) : (
            <Typography>없음</Typography>
          )}
        </Paper>
      )}
    </Container>
  );
};

export default Calculator;