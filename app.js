const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
);

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  //   console.log(req.params);

  const id = parseInt(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

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
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
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
