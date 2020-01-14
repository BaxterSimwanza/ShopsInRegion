if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const exphbs = require('express-handlebars')

const cors = require('cors')

const methodOverride = require('method-override')

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://ShopsInRegionUser:' + process.env.CONNECTION_PASSWORD + '@clusterone-ke8qn.mongodb.net/test?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use(cors());

app.use(methodOverride('_method')); //FOR DELETE

app.engine('handlebars', exphbs({ defaultLayout: 'index' }))
app.set('view engine', 'handlebars')


app.use('/', require('./routes/shops-router'))
app.use('/', require('./routes/users-router'))

const PORT = process.env.PORT || 5000
app.listen(PORT, '127.0.0.1', () => console.log("Running server..."))