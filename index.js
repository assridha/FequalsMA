// Load environment variables if not in production
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Import required packages and modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const mainRoutes = require('./routes/main');
const moduleRoutes = require('./routes/module');
const practiceRoutes = require('./routes/practice');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Set view engine to EJS
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to MongoDB Atlas
mongoose.set('strictQuery', true);
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

// Configure session
const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

// Set session options for production environment
if (process.env.NODE_ENV === "production") {
    sessionConfig.cookie.secure = true;
    sessionConfig.cookie.sameSite = 'none';
    app.set('trust proxy', 1);
}

// Middleware and configurations
app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(flash());
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

// Import models
const Module = require('./models/module');
const Category = require('./models/category');

// Configure Passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up flash messages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});


// Module routes
app.use('/module', moduleRoutes);

// User routes
//app.use('/', userRoutes);

// Main routes
app.use('/', mainRoutes);

// Practice routes
app.use('/practice', practiceRoutes);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});