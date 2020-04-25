const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require('./routes/braintree');
const orderRoutes = require('./routes/order');


// create app
const app = express();
const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/ecommerce";

// connect to db
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('Database connected'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
// routes

app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api/braintree', braintreeRoutes);
app.use('/api/order', orderRoutes);

// app.use(express.static(path.join(__dirname, '..', 'build')));
// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
});