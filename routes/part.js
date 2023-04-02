// router for part routes
const express = require('express');
const router = express.Router();
const Part = require('../models/part');
const Subject = require('../models/subject');
const Chapter = require('../models/chapter');
const { getIndex } = require('../utils/getIndex');
const { getLinkObject } = require('../utils/getLinkObject');

// get route to each part page
router.get('/:id', async (req, res) => {
    const partID = req.params.id;

    // find part document
    const part = await Part.findById(partID);

    // find all chapters in part
    const chapters = await Chapter.find({ part: partID });

    const linkObject = await getLinkObject(part, 'part');

    // render part.ejs with part variable
    res.render('part/show', { part, chapters, linkObject });
});


// get route to edit page of each part
router.get('/:id/edit', async (req, res) => {

    const partID = req.params.id;

    // find part document
    const part = await Part.findById(partID);

    // get all parts
    const parts = await Part.find({ subject: part.subject });

    // get subject
    const subject = await Subject.findById(part.subject);

    const linkObject = await getLinkObject(part, 'part');

    // render part_edit.ejs file with part and parts variables
    res.render('part/edit', { part, parts, subject, linkObject });
});

// post route to subject part quick-edit part
router.post('/:id', async (req, res) => {
    const partID = req.params.id;

    // find part document
    const part = await Part.findById(partID);

    // update part document with new data
    part.title = req.body.title;
    part.summary = req.body.summary;
    part.body = req.body.body;

    // save updated part document
    await part.save();

    // redirect to part page
    res.redirect(`/pola/subject/${part._id}/edit`);
});

// delete route to delete part
router.delete('/:id', async (req, res) => {
    const partID = req.params.id;

    // find chapter document related to part
    const chapters = await Chapter.find({ part: partID });

    // if chapters exist, then send error message
    if (chapters.length > 0) {
        res.send('Cannot delete part with chapters.');
    }
    else {

        //find part document
        const part = await Part.findById(partID);

        // get all parts with index greater than part index
        const parts = await Part.find({ subject: part.subject, index: { $gt: part.index } });

        // loop through parts and decrement index
        for (let i = 0; i < parts.length; i++) {
            parts[i].index--;
            await parts[i].save();
        }

        // delete part document
        await Part.findByIdAndDelete(partID);

        // redirect to subject page
        res.redirect(`/pola/${part.subject}`);
    }
});


// post route to add new chapter
router.post('/:id/chapter', async (req, res) => {
    const partID = req.params.id;

    // find all chapters in part
    const chapters = await Chapter.find({ part: partID });

    // create new chapter document
    const newChapter = new Chapter({
        title: req.body.title,
        body: 'Default body text.',
        index: getIndex(chapters),
        part: partID
    });

    // save new chapter document
    await newChapter.save();

    // redirect to part page or last chapter page if part has chapters
    if (chapters.length > 0) {
        res.redirect(`/pola/subject/part/${chapters[chapters.length - 1]._id}`);
    }
    else {
        res.redirect(`/pola/subject/${partID}`);
    }
});


module.exports = router;