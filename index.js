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
const joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const fs = require('fs');
const bodyParser = require('body-parser');
const subjectRoute = require('./routes/subject');
const partRoute = require('./routes/part');
const chapterRoute = require('./routes/chapter');
const sectionRoute = require('./routes/section');
const referenceRoute = require('./routes/reference');
const userRoutes = require('./routes/user');
const pageRoutes = require('./routes/page');
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
const Subject = require('./models/subject');
const Part = require('./models/part');
const Chapter = require('./models/chapter');
const Reference = require('./models/reference');

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

// Send TOC (Table of Contents) array to all routes
app.use(async (req, res, next) => {
    let subjects = await Subject.find({}, 'title index published');
    let parts = await Part.find({}, 'title subject index published');
    let chapters = await Chapter.find({}, 'title part index published');

    // If user is not logged in or not an admin, filter out unpublished subjects, parts, and chapters
    if (!req.user || !(req.user._id.toString() === process.env.ADMIN_OID)) {
        subjects = subjects.filter(subject => subject.published);
        parts = parts.filter(part => part.published);
        chapters = chapters.filter(chapter => chapter.published);
    }

    const toc = { subjects, parts, chapters };
    res.locals.toc = toc;
    next();
});

// Send reference array to all routes
app.use(async (req, res, next) => {
    const references = await Reference.find({}, 'title authors url');
    res.locals.references = references;
    next();
});

// Subject routes
app.use('/', subjectRoute);

// Part routes
app.use('/subject', partRoute);

// Chapter routes
app.use('/subject/part', chapterRoute);

// Section routes
app.use('/subject/part/chapter', sectionRoute);

// Reference routes
app.use('/references', referenceRoute);

// User routes
app.use('/', userRoutes);

// Page routes
app.use('/', pageRoutes);

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});