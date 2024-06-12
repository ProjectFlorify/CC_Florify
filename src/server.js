require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const router = require('./routes');
const loadModel = require('./services/loadModel');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(fileUpload({
    limits: { fileSize: 1000000 }, // Limit file size to 1MB
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to Florify');
});

app.use('/', router);

loadModel().then(model => {
    app.locals.model = model;
    app.listen(port, () => {
        console.log(`Server is running on port:${port}`);
    });
}).catch(err => {
    console.error('Failed to load model:', err);
});
