const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const joi = require('joi');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const fs = require('fs');
const bodyParser = require('body-parser');
const subjectRoute = require('./routes/subject');
const partRoute = require('./routes/part');
const chapterRoute = require('./routes/chapter');
const sectionRoute = require('./routes/section');


// set view engine to ejs
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//connect to mongodb and console log if connected or not. Set strictQuery to true to prevent deprecation warning.
mongoose.set('strictQuery', true);
// mongoose.connect('mongodb+srv://ashwinsridhara:kLhBq7cjKzxbAwvD@alphasandbox.niws52d.mongodb.net/fEqaulsMA?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connected to MongoDB...'))
//     .catch(err => console.error('Could not connect to MongoDB...'));

mongoose.connect('mongodb://localhost:27017/fequalsma', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.json())

// import all models
const Subject = require('./models/subject');
const Part = require('./models/part');
const Chapter = require('./models/chapter');



// send toc array to all routes. retrieve all subjects, parts and chapters. Only retrieve title and parent fields.
app.use(async (req, res, next) => {
    const subjects = await Subject.find({}, 'title index');
    const parts = await Part.find({}, 'title subject index');
    const chapters = await Chapter.find({}, 'title part index');
    const toc = { subjects, parts, chapters };
    res.locals.toc = toc;
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