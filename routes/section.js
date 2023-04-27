const express = require('express');
const router = express.Router();
const Chapter = require('../models/chapter');
const Section = require('../models/section');
const { getLinkObject } = require('../utils/getLinkObject');
const Equation = require('../models/equation');
const { isLoggedIn, isAdmin } = require('../utils/middleware');


//delete route to delete section
router.delete('/:id',isLoggedIn, isAdmin, async (req, res) => {
    const sectionID = req.params.id;

    // find section document
    const section = await Section.findById(sectionID);

    // find sections with index greater than the index of the section to be deleted
    const sections = await Section.find({ chapter: section.chapter, index: { $gt: section.index } });

    // decrement index of each section by 1
    sections.forEach(async (section) => {
        section.index = section.index - 1;
        await section.save();
    });


    // delete section document
    await Section.findByIdAndDelete(sectionID);

    // redirect to chapter page
    res.redirect(`/pola/subject/part/${section.chapter}`);
});

// post route to edit section
router.post('/:id',isLoggedIn, isAdmin, async (req, res) => {
    const sectionID = req.params.id;

    // find section document
    const section = await Section.findById(sectionID);

    // update section document with new data
    section.title = req.body.title;
    section.body = req.body.body;
    section.published = req.body.published;

    // save updated section document
    await section.save();

    // redirect to chapter page
    //res.redirect(`/pola/subject/part/chapter/${section._id}/edit`);
    res.send(section);
});

// get route to edit page of each section
router.get('/:id/edit',isLoggedIn, isAdmin, async (req, res) => {

    req.session.returnTo = req.originalUrl;

    const sectionID = req.params.id;

    // find section document. Populate equations field with equation documents
    const section = await Section.findById(sectionID).populate('equations');

    // find chapter document
    const chapter = await Chapter.findById(section.chapter);

    const linkObject = await getLinkObject(chapter, 'chapter');

    //render section/edit.ejs file with section variable
    res.render('section/edit', { section, chapter, linkObject });
   
});

// post route to create new equation and add it to section
router.post('/:id/addEquation',isLoggedIn, isAdmin, async (req, res) => {
    const sectionID = req.params.id;

    // find section document
    const section = await Section.findById(sectionID);

    // create new equation document
    const equation = new Equation({
        title: req.body.title,
        expression: req.body.expression
    });

    // save equation document
    await equation.save();

    // add equation document to section document
    section.equations.push(equation);

    // save section document
    await section.save();

    // redirect to edit page of section
    res.redirect(`/pola/subject/part/chapter/${section._id}/edit`);
});

// post route to delete equation from section
router.post('/:sId/deleteEquation/:eID',isLoggedIn, isAdmin, async (req, res) => {
    const sectionID = req.params.sId;
    const equationID = req.params.eID;

    // find section document
    const section = await Section.findById(sectionID);

    // find equation document
    const equation = await Equation.findById(equationID);

    // remove equation document from section document
    section.equations.pull(equation);

    // save section document
    await section.save();

    // delete equation document
    await Equation.findByIdAndDelete(equationID);

    // redirect to edit page of section
    res.redirect(`/pola/subject/part/chapter/${section._id}/edit`);
});

// post route to edit equation
router.post('/:sId/editEquation/:eID',isLoggedIn, isAdmin, async (req, res) => {
    const sectionID = req.params.sId;
    const equationID = req.params.eID;

    // find equation document
    const equation = await Equation.findById(equationID);

    // update equation document with new data
    equation.title = req.body.title;
    equation.expression = req.body.expression;

    // save updated equation document
    await equation.save();

    // redirect to edit page of section
    res.redirect(`/pola/subject/part/chapter/${sectionID}/edit`);
});

module.exports = router;

