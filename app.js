const express = require('express');
const morgan = require('morgan');

// custom route files in routes folder
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// instantiates express
const app = express();

// setup morgan Middleware
// adds useful route response data in console
app.use(morgan('dev'));
// to tell express to expect JSON
app.use(express.json());

// middleware
// location matters, acts on all routes in current location
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

// adds the requestTime property to request giving current modified time string
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// using custom routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
