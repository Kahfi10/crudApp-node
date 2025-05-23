// imports 
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const app =  express();
const PORT = process.env.PORT || 4000;

// database connection
const url = process.env.MONGO_URL || 'mongodb://localhost:27017/crudApp_node';
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected successfully');
}).catch((err) => {
    console.log('Database connection failed', err);
});


// middleware
app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(session({
    secret: 'my secret key',
    saveUninitialized: true,
    resave: false
}));

app.use((req, res, next)=>{
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

// set template engine
app.set('view engine', 'ejs');

// route prefix
app.use('', require('./routes/routes.js'));


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

