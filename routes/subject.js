const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const Part = require('../models/part');
const Course = require('../models/course');
const Page = require('../models/page');
const { getIndex } = require('../utils/getIndex');
const { getLinkObject } = require('../utils/getLinkObject');
const { isLoggedIn, isAdmin } = require('../utils/middleware');
const Category = require('../models/category');
const Module = require('../models/module');

// get route on home page
//router.get('/', async (req, res) => {

//    req.session.returnTo = req.originalUrl;

//    // get all subject documents and sort by index
//    let subjects = await Subject.find()
//        .sort({ index: 1 });

//    // if user is not logged in and is not admin then filter out subjects with status hide
//    if (!req.user || !(req.user._id.toString() === process.env.ADMIN_OID)) {
//        subjects = subjects.filter(subject => subject.status !== 'hide');
//    }

//    // get all courses
//    const courses = await Course.find();
//    // get all blogs 
//    let blogs = await Page.find({ category: 'blog' });
//    // get all side pages
//    let sidePages = await Page.find({ category: 'side' });

//    // if user is not logged in and is not admin then filter out blogs and side pages which are not published
//    if (!req.user || !(req.user._id.toString() === process.env.ADMIN_OID)) {
//        blogs = blogs.filter(blog => blog.published === true);
//        sidePages = sidePages.filter(sidePage => sidePage.published === true);
//    }

//    const linkObject = [];
//    // render subject_home.ejs file with subjects variable
//    res.render('subject/home2', { subjects, linkObject,courses, blogs, sidePages });

//});

router.get('/', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    // get the category with title 'Mains'
    const mainsCategory = await Category.findOne({ title: 'Mains' });
    // find all child categories of mainsCategory
    const categories = await Category.find({ parent: mainsCategory._id });

    // get all modules with whose category is in categories array and whose metaData.generation is 0 and sort by index
    let subjects = await Module.find({ category: { $in: categories }, 'metaData.generation': 0 }).sort({ index: 1 });

    const linkObject = [];
    // render subject_home.ejs file with subjects variable
    res.render('subject/home2', { subjects, linkObject,categories });

});

// route to about page
router.get('/about', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    // retrieve about page from database with title 'About'
    const aboutPage = await Page.findOne({ title: 'About' });

    // render about.ejs file
    res.render('page/show', { page: aboutPage });
});


// post route to add new subject
router.post('/mains/',isLoggedIn, isAdmin, async (req, res) => {

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
    res.redirect('/');
});

// get route to edit page of each subject
router.get('/mains/:id/edit',isLoggedIn, isAdmin, async (req, res) => {

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
router.post('/mains/:id',isLoggedIn, isAdmin, async (req, res) => {
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
    res.redirect(`/mains/${subjectID}`);
});

// delete route to delete subject
router.delete('/mains/:id',isLoggedIn, isAdmin, async (req, res) => {
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
        res.redirect('/');
    }
});

// get route to each subject page
router.get('/mains/:id', async (req, res) => {

    req.session.returnTo = req.originalUrl;
    
    const subjectID = req.params.id;

    const subject = await Subject.findById(subjectID);

    // find all part documents with reference to subjectID
    let parts = await Part.find({ subject: subjectID })

    // if user is not logged in and is not admin then filter out parts with status hide
    if (!req.user || !(req.user._id.toString() === process.env.ADMIN_OID)) {
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
    res.redirect(`/mains/${subjectID}`);
});

module.exports = router;