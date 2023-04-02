const express = require('express');
const router = express.Router();
const Chapter = require('../models/chapter');
const Section = require('../models/section');
const { getIndex } = require('../utils/getIndex');
const { getLinkObject } = require('../utils/getLinkObject');



//delete route to delete section
router.delete('/:id', async (req, res) => {
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
    res.redirect(`/pola/subject/part/chapter/${section._id}/edit`);
});

// get route to edit page of each section
router.get('/:id/edit', async (req, res) => {

    const sectionID = req.params.id;

    // find section document
    const section = await Section.findById(sectionID);

    // find chapter document
    const chapter = await Chapter.findById(section.chapter);

    const linkObject = await getLinkObject(chapter, 'chapter');

    //render section/edit.ejs file with section variable
    res.render('section/edit', { section, chapter, linkObject });
});


module.exports = router;

