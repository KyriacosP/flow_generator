import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';
import morgan from 'morgan'

const PORT = 5000;

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);



app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
