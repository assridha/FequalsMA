const express = require('express');
const router = express.Router();
const Chapter = require('../models/chapter');
const Section = require('../models/section');
const { getIndex } = require('../utils/getIndex');



//delete route to delete section
router.delete('/:id', async (req, res) => {
    const sectionID = req.params.id;

    // find section document
    const section = await Section.findById(sectionID);

    // delete section document
    await Section.findByIdAndDelete(sectionID);

    // redirect to chapter page
    res.redirect(`/pola/subject/part/${section.chapter}`);
});

// post route to edit section
router.post('/:id', async (req, res) => {
    const sectionID = req.params.id;

    // find section document
    const section = await Section.findById(sectionID);

    // update section document with new data
    section.title = req.body.title;
    section.body = req.body.body;

    // save updated section document
    await section.save();

    // redirect to chapter page
    res.redirect(`/pola/subject/part/${section.chapter}`);
});

// get route to edit page of each section
router.get('/:id/edit', async (req, res) => {

    const sectionID = req.params.id;

    // find section document
    const section = await Section.findById(sectionID);

    // find chapter document
    const chapter = await Chapter.findById(section.chapter);

    //render section/edit.ejs file with section variable
    res.render('section/edit', { section, chapter });
});


module.exports = router;

