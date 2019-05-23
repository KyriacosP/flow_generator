import express from 'express';
import bodyParser from 'body-parser';

const PORT = 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).send({
    success: 'true',
    message: 'Hello World'
  });
});

app.post('/generate',(req, res)=>{
  if(Object.keys(req.body).length === 0){
    return res.status(400).send({
      success: 'false',
      message: 'No CAF description provided'
    });
  } else {
    return  res.status(200).send({
      success: 'true',
      message: 'CAF description provided successfully'
    });
  }
});


app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
