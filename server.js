const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
require('dotenv').config();


// create app
const app = express();

// connect to db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('Database connected'));

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
// routes

app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});