import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index.js';
import morgan from 'morgan'
import cors from 'cors'

const PORT = 5000;

const app = express();

//server entry point
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//use the routes defined in ./routes/index.js
app.use(router);



app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
