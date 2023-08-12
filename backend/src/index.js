const express = require('express');
const articleController = require('./controllers/articleController');
const ConceptController = require('./controllers/conceptController');
const cors = require('cors');
const app = express();

app.use(express.json());

const corsOptions = {
    "origin": "http://localhost:3000",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"
};
  
app.use(cors(corsOptions));

app.use(articleController);
app.use(ConceptController);



const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
