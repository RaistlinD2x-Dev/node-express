const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

// instantiates express
const app = express();

// setup morgan Middleware
// adds useful route response data in console
app.use(morgan('dev'));
// to tell express to expect JSON
app.use(express.json());

// 1) Middleware

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

// top level code to load all data from the file in a synchronous
// fashion so it is always available globally
// also parsed file input as JSON data
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
);

// 2) Route Handlers

// all functions written below were route handlers
// these will be moved to other files later
const getAllTours = (req, res) => {
  // tested req.requestTime and added to envelope here
  console.log(req.requestTime);

  res.status(200).json({
    status: 'Success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  //   console.log(req.params);
  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  //   if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(
    { id: newId },
    req.body
  );

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'Success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (parseInt(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (req, res) => {
  if (parseInt(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not implemented',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not implemented',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not implemented',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not implemented',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not implemented',
  });
};

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 3) Routes

// custom routers
const tourRouter = express.Router();
const userRouter = express.Router();

// refactored routes to reduced route strings and simplify code
tourRouter
  .route('/')
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter
  .route('/')
  .get(getAllUsers)
  .post(createUser);

userRouter
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// using custom routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) Start Server

const port = 3000;
app.listen(port, () => {
  console.log(
    `App is running on port ${port}...`
  );
});

// below was above, just used for exploring basic express concepts
// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from the server!',
//     app: 'Natours',
//   });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint');
// });

// sends a string back to client
// app.get('/', (req, res) => {
//   res.status(200).send('Hello from the server at root');
// });
