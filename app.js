const userRouter = require('./routes/userRoutes');
const orderRouter = require('./routes/orderRoutes');
const globalErrorHandler = require('./controllers/errorController');
const appError = require('./utils/appError');

const express = require('express');
const morgan = require('morgan');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/orders', orderRouter);

app.all('*', (req, res, next) => {
  next(new appError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
