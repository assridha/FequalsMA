const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const Part = require('../models/part');
const Course = require('../models/course');
const { getIndex } = require('../utils/getIndex');
const { getLinkObject } = require('../utils/getLinkObject');
const { isLoggedIn, isAdmin } = require('../utils/middleware');
const course = require('../models/course');

// get route on home page
router.get('/', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    // get all subject documents and sort by index
    let subjects = await Subject.find()
        .sort({ index: 1 });

    // if user is not logged in and is not admin then filter out subjects with status hide
    if (!req.user || !req.user === process.env.ADMIN_OID) {
        subjects = subjects.filter(subject => subject.status !== 'hide');
    }

    // get all courses
    const courses = await Course.find();

    const linkObject = [];
    // render subject_home.ejs file with subjects variable
    res.render('subject/home', { subjects, linkObject,courses });

});

// route to about page
router.get('/about', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    // render about.ejs file
    res.render('home/about');
});


// post route to add new subject
router.post('/',isLoggedIn, isAdmin, async (req, res) => {

    // get subjects
    const subjects = await Subject.find();

    let imageURL = req.body.image;
    if (req.body.image === '') {
        imageURL = 'https://www.wolflair.com/wp-content/uploads/2017/01/placeholder.jpg';
    };

    // create new content document
    const newSubject = new Subject({
        title: req.body.title,
        summary: req.body.summary,
        index: getIndex(subjects),
        image: imageURL,
        published: false,
        course  : req.body.course
    });

    // save new content document
    await newSubject.save();

    // redirect to home page
    res.redirect('/pola');
});

// get route to edit page of each subject
router.get('/:id/edit',isLoggedIn, isAdmin, async (req, res) => {

    req.session.returnTo = req.originalUrl;

    const subjectID = req.params.id;

    // find subject document
    const subject = await Subject.findById(subjectID);

    // get all subjects
    const subjects = await Subject.find();

    // get courses
    const courses = await Course.find();

    const linkObject = await getLinkObject(subject, 'subject');

    // render subject_edit.ejs file with subject and parts variables
    res.render('subject/edit', { subject, subjects, linkObject, courses });
});


// post route to edit subject
router.post('/:id',isLoggedIn, isAdmin, async (req, res) => {
    const subjectID = req.params.id;

    // find subject document
    const subject = await Subject.findById(subjectID);

    // get subject with same index
    const subjectToSwap = await Subject.find({ index: req.body.index });

    // swap index of subject and subjectToSwap
    subjectToSwap[0].index = subject.index;

    // update subject document with new data
    subject.title = req.body.title;
    subject.summary = req.body.summary;
    subject.image = req.body.image;
    subject.index = req.body.index;
    subject.body = req.body.body;
    subject.published = req.body.published;
    subject.status = req.body.status;
    subject.course = req.body.course;

    // save updated subject document
    await subject.save();
    // save updated subjectToSwap document
    await subjectToSwap[0].save();

    // redirect to home page
    res.redirect(`/pola/${subjectID}`);
});

// delete route to delete subject
router.delete('/:id',isLoggedIn, isAdmin, async (req, res) => {
    const subjectID = req.params.id;

    // query to find all part documents with reference to subjectID
    const parts = await Part.find({ subject: subjectID });

    // if parts exist, send error message
    if (parts.length > 0) {
        res.send('Cannot delete. Subject has parts.');
    }
    else {

        // find all subjects with index greater than subject index
        const subjects = await Subject.find({ index: { $gt: req.body.index } });

        // decrease index of all subjects with index greater than subject index
        subjects.forEach(async (subject) => {
            subject.index -= 1;
            await subject.save();
        });

        // delete subject document
        await Subject.findByIdAndDelete(subjectID);

        // redirect to home page
        res.redirect('/pola');
    }
});

// get route to each subject page
router.get('/:id', async (req, res) => {

    req.session.returnTo = req.originalUrl;
    
    const subjectID = req.params.id;

    const subject = await Subject.findById(subjectID);

    // find all part documents with reference to subjectID
    let parts = await Part.find({ subject: subjectID })

    // if user is not logged in and is not admin then filter out parts with status hide
    if (!req.user || !req.user === process.env.ADMIN_OID) {
        parts = parts.filter(part => part.status !== 'hide');
    }

    const linkObject = await getLinkObject(subject, 'subject');

    // render subject.ejs with subject and parts variables
    res.render('subject/show', { subject, parts, linkObject });
});

//post route to add new part
router.post('/:id/part',isLoggedIn, isAdmin, async (req, res) => {
    const subjectID = req.params.id;

    // get parts
    const parts = await Part.find({ subject: subjectID });

    // create new part document
    const newPart = new Part({
        title: req.body.title,
        summary: req.body.summary,
        index: getIndex(parts),
        subject: subjectID,
        published: false
    });

    // save new part document
    await newPart.save();

    // redirect to subject page
    res.redirect(`/pola/${subjectID}`);
});

module.exports = router;