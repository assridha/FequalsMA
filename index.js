if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
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
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// set view engine to ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//connect to mongodb and console log if connected or not. Set strictQuery to true to prevent deprecation warning.
mongoose.set('strictQuery', true);
 mongoose.connect(`mongodb+srv://ashwinsridhara:${process.env.MONGODB_ADMIN_PASSWORD}@knowledge-library.5haz12m.mongodb.net/fEqaulsMA?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => console.log('Connected to MongoDB Atlas...'))
     .catch(err => console.error('Could not connect to MongoDB...'));

//mongoose.connect('mongodb://localhost:27017/fequalsma', { useNewUrlParser: true, useUnifiedTopology: true })
//    .then(() => console.log('Connected to MongoDB...'))
//    .catch(err => console.error('Could not connect to MongoDB...'));

const sessionConfig = {
        secret: 'fequalsma',
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
}


app.use(express.urlencoded({ extended: true }));
app.use(session(sessionConfig));
app.use(flash());
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.json())

// import all models
const Subject = require('./models/subject');
const Part = require('./models/part');
const Chapter = require('./models/chapter');
const Reference = require('./models/reference');

app.use(passport.initialize());
app.use(passport.session());        
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// setup flash messages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// send toc array to all routes. retrieve all subjects, parts and chapters. Only retrieve title and parent fields.
app.use(async (req, res, next) => {

    let subjects = await Subject.find({}, 'title index published');
    let parts = await Part.find({}, 'title subject index published');
    let chapters = await Chapter.find({}, 'title part index published');
    
    // if user is not logged in and is not admin, filter out unpublished subjects, parts and chapters
    if(!req.user || !req.user === process.env.ADMIN_OID) {
        subjects = subjects.filter(subject => subject.published);
        parts = parts.filter(part => part.published);
        chapters = chapters.filter(chapter => chapter.published);
    }
    
    const toc = { subjects, parts, chapters };
    res.locals.toc = toc;
    next();
});

// send reference array to all routes. retrieve all references. Only retrieve title, authors and url fields.
app.use(async (req, res, next) => {
    const references = await Reference.find({}, 'title authors url');
    res.locals.references = references;
    next();
});

//--------------------- SUJECT ROUTES---------------------//
app.use('/pola', subjectRoute);
//--------------------- PART ROUTES---------------------//
app.use('/pola/subject', partRoute);
// //--------------------- CHAPTER ROUTES---------------------//
app.use('/pola/subject/part', chapterRoute);
// //--------------------- SECTION ROUTES---------------------//
app.use('/pola/subject/part/chapter', sectionRoute);
// //--------------------- REFERENCE ROUTES---------------------//
app.use('/references', referenceRoute);
// //--------------------- USER ROUTES---------------------//
app.use('/', userRoutes);

// get route to /template
app.get('/template', (req, res) => {
    res.render('template');
});

// post route to /template/edit
app.post('/template/edit', (req, res) => {
    console.log(req.body);
    res.send('it worked');
});


// listen on port 8080
app.listen(8080, () => {
    console.log('listening on port 8080');
});