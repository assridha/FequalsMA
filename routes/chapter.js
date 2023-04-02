const express = require('express');
const router = express.Router();

const Part = require('../models/part');
const Chapter = require('../models/chapter');
const Section = require('../models/section');
const { getIndex } = require('../utils/getIndex');
const { getLinkObject } = require('../utils/getLinkObject');
const { link } = require('joi');

// get route to each chapter page
router.get('/:id', async (req, res) => {

    const chapterID = req.params.id;

    // find chapter document
    const chapter = await Chapter.findById(chapterID);

    // get next and previous chapter if they exist
    const nextChapter = await Chapter.findOne({ index: chapter.index + 1, part: chapter.part });
    const previousChapter = await Chapter.findOne({ index: chapter.index - 1, part: chapter.part });

    // find all sections in chapter
    const sections = await Section.find({ chapter: chapterID });

    const linkObject = await getLinkObject(chapter, 'chapter');

    // render chapter.ejs with chapter variable
    res.render('chapter/show', { chapter, sections, linkObject, nextChapter, previousChapter });
});

// get route to edit page of each chapter
router.get('/:id/edit', async (req, res) => {

    const chapterID = req.params.id;

    // find chapter document
    const chapter = await Chapter.findById(chapterID);

    const linkObject = await getLinkObject(chapter, 'chapter');
    //render chapter_edit.ejs file with chapter variable
    res.render('chapter/edit', { chapter, linkObject });
});

// post route to edit chapter
router.post('/:id', async (req, res) => {
    const chapterID = req.params.id;

    // find chapter document
    const chapter = await Chapter.findById(chapterID);

    // update chapter document with new data
    chapter.title = req.body.title;
    chapter.body = req.body.body;

    // save updated chapter document
    await chapter.save();

    // redirect to chapter page
    res.redirect(`${chapter._id}`);
});

// delete route to delete chapter
router.delete('/:id', async (req, res) => {
    const chapterID = req.params.id;

    // find section documents
    const sections = await Section.find({ chapter: chapterID });

    // if sections exist, send error message
    if (sections.length > 0) {
        res.send('Cannot delete chapter with sections');
    }
    else {

        // find chapter document
        const chapter = await Chapter.findById(chapterID);

        // find part document
        const part = await Part.findById(chapter.part);

        // delete chapter document
        await Chapter.findByIdAndDelete(chapterID);

        // redirect to part page
        res.redirect(`/pola/subject/${part._id}`);
    }
});

// post route to add section to chapter
router.post('/:id/section', async (req, res) => {
    const chapterID = req.params.id;

    // find chapter document
    const chapter = await Chapter.findById(chapterID);

    //find all sections in chapter
    const sections = await Section.find({ chapter: chapterID });

    // create new section document
    const newSection = new Section({
        title: req.body.title,
        body: req.body.body,
        chapter: chapter._id,
        index: getIndex(sections)
    });

    // save new section document
    await newSection.save();

    // redirect to chapter page
    res.redirect(`/pola/subject/part/${chapter._id}`);
});


module.exports = router;
