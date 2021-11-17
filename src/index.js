const path = require('path')
const express = require('express')
const app = express();
const port = process.env.PORT || 3000

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.get('/', (req, res) => {
    res.render('login')
})

app.listen(port, () => console.log('Connected on port:' + port))