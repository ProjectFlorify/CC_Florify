const express = require('express')
const app = express();
const router = require('./routes');
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Welcome to Florify');
});

app.use(router)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App is listening on url http://localhost:${PORT}`));