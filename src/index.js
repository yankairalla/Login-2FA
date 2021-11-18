const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 4000


app.use(express.urlencoded({ extended: true }))

const router = require('./routes');



//Template Engines
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(router);

app.listen(port, () => console.log('Connected on port:' + port))