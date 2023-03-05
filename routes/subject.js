const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const Part = require('../models/part');
const { getIndex } = require('../utils/getIndex');

// get route on home page
router.get('/', async (req, res) => {

    // get all subject documents and sort by index
    const subjects = await Subject.find()
        .sort({ index: 1 });

    res.render('subject/home', { subjects });
});


// post route to add new subject
router.post('/', async (req, res) => {

    // get subjects
    const subjects = await Subject.find();

    // create new content document
    const newSubject = new Subject({
        title: req.body.title,
        summary: req.body.summary,
        index: getIndex(subjects),
        image: req.body.image
    });

    // save new content document
    await newSubject.save();

    // redirect to home page
    res.redirect('/pola');
});

// get route to edit page of each subject
router.get('/:id/edit', async (req, res) => {

    const subjectID = req.params.id;

    // find subject document
    const subject = await Subject.findById(subjectID);

    // get all subjects
    const subjects = await Subject.find();

    // render subject_edit.ejs file with subject and parts variables
    res.render('subject/edit', { subject, subjects });
});


// post route to edit subject
router.post('/:id', async (req, res) => {
    const subjectID = req.params.id;

    // find subject document
    const subject = await Subject.findById(subjectID);

    // update subject document with new data
    subject.title = req.body.title;
    subject.summary = req.body.summary;
    subject.image = req.body.image;

    // save updated subject document
    await subject.save();

    // redirect to home page
    res.redirect('/pola');
});

// delete route to delete subject
router.delete('/:id', async (req, res) => {
    const subjectID = req.params.id;

    // delete subject document
    await Subject.findByIdAndDelete(subjectID);

    // redirect to home page
    res.redirect('/pola');
});

// post route to reduce index of subject
router.post('/:id/reduce', async (req, res) => {
    const subjectID = req.params.id;

    // find subject document
    const subject = await Subject.findById(subjectID);

    // find subject document with index one less than subject
    const subjectToSwap = await Subject.find({ index: subject.index - 1 });

    // swap index of subject and subjectToSwap
    subject.index = subject.index - 1;
    subjectToSwap[0].index = subjectToSwap[0].index + 1;

    // save updated subject documents
    await subject.save();
    await subjectToSwap[0].save();

    // redirect to home page
    res.redirect('/pola');
});

// post route to increase index of subject
router.post('/:id/increase', async (req, res) => {
    const subjectID = req.params.id;

    // find subject document
    const subject = await Subject.findById(subjectID);

    // find subject document with index one less than subject
    const subjectToSwap = await Subject.find({ index: subject.index + 1 });

    // swap index of subject and subjectToSwap
    subject.index = subject.index + 1;
    subjectToSwap[0].index = subjectToSwap[0].index - 1;

    // save updated subject documents
    await subject.save();
    await subjectToSwap[0].save();

    // redirect to home page
    res.redirect('/pola');
});

// get route to each subject page
router.get('/:id', async (req, res) => {
    const subjectID = req.params.id;

    const subject = await Subject.findById(subjectID);

    // find all part documents with reference to subjectID
    const parts = await Part.find({ subject: subjectID })

    // render subject.ejs with subject and parts variables
    res.render('subject/show', { subject, parts });
});

//post route to add new part
router.post('/:id/part', async (req, res) => {
    const subjectID = req.params.id;

    // get parts
    const parts = await Part.find({ subject: subjectID });

    // create new part document
    const newPart = new Part({
        title: req.body.title,
        summary: req.body.summary,
        index: getIndex(parts),
        subject: subjectID
    });

    // save new part document
    await newPart.save();

    // redirect to subject page
    res.redirect(`/pola/${subjectID}`);
});

module.exports = router;