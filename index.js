const express = require ('express');

const exphbs = require('express-handlebars');

const app = express();

app.use(express.static('public'));

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.get ('/', (req, res) => {
    res.render('index');
});

app.listen(5000);

console.log("Running app");