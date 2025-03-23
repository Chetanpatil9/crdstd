const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
require('dotenv').config();

const studentrouter = require('./router/studentrouter');

const port = process.env.PORT || 8000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 


app.get('/', (req, res) => {
    res.send('Server is running...');
});


app.use('/api', studentrouter);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
