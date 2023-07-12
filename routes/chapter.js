const express = require('express');
const router = express.Router();

const Part = require('../models/part');
const Chapter = require('../models/chapter');
const Section = require('../models/section');
const Reference = require('../models/reference');
const Exercise = require('../models/exercise');
const { getIndex } = require('../utils/getIndex');
const { getLinkObject } = require('../utils/getLinkObject');
const { isLoggedIn, isAdmin } = require('../utils/middleware');

// get route to each chapter page
router.get('/:id', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    const chapterID = req.params.id;

    // find chapter document
    const chapter = await Chapter.findById(chapterID).populate('references', 'title authors url');

    // get next and previous chapter if they exist
    const nextChapter = await Chapter.findOne({ index: chapter.index + 1, part: chapter.part });
    const previousChapter = await Chapter.findOne({ index: chapter.index - 1, part: chapter.part });

    // find all sections in chapter and polpulate equations array.
    let sections = await Section.find({ chapter: chapterID}).populate('equations');

    // if not logged in and not admin, filter out sections with published false
    if (!req.user || !(req.user._id.toString() === process.env.ADMIN_OID)) {
        sections = sections.filter(section => section.published);
    }

    const linkObject = await getLinkObject(chapter, 'chapter');
    
    // render chapter.ejs with chapter variable
    res.render('chapter/show', { chapter, sections, linkObject, nextChapter, previousChapter });
});

// get route to edit page of each chapter
router.get('/:id/edit', isLoggedIn, isAdmin, async (req, res) => {

    req.session.returnTo = req.originalUrl;

    const chapterID = req.params.id;

    // find chapter document
    const chapter = await Chapter.findById(chapterID).populate('references', 'title authors url');

    const linkObject = await getLinkObject(chapter, 'chapter');
    //render chapter_edit.ejs file with chapter variable
    res.render('chapter/edit', { chapter, linkObject });
});

// post route to edit chapter
router.post('/:id',isLoggedIn, isAdmin, async (req, res) => {
    const chapterID = req.params.id;

    // find chapter document
    const chapter = await Chapter.findById(chapterID);

    // update chapter document with new data
    chapter.title = req.body.title;
    chapter.body = req.body.body;
    chapter.published = req.body.published;

    // save updated chapter document
    await chapter.save();

    // redirect to chapter page
    res.redirect(`${chapter._id}`);
});

// delete route to delete chapter
router.delete('/:id',isLoggedIn, isAdmin, async (req, res) => {
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
        res.redirect(`/subject/${part._id}`);
    }
});

// post route to add section to chapter
router.post('/:id/section', isLoggedIn,isAdmin, async (req, res) => {
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
        index: getIndex(sections),
        published: false
    });

    // save new section document
    await newSection.save();

    // redirect to chapter page
    res.redirect(`/subject/part/${chapter._id}`);
});

// post route to add reference to chapter from addRef post route in chapter/edit.ejs
router.post('/:id/addRef',isLoggedIn, isAdmin, async (req, res) => {
    const chapterID = req.params.id;

    // find chapter document
    const chapter = await Chapter.findById(chapterID);

    // retrieve reference id array from request body. If only one reference is selected, it is not an array. So, we need to convert it to an array.
    const referenceIDs = Array.isArray(req.body.references) ? req.body.references : [req.body.references];

    // add reference id to chapter document reference array property, if it is not already present
    referenceIDs.forEach((referenceID) => {
        if (!chapter.references.includes(referenceID)) {
            chapter.references.push(referenceID);
        }
    });

    // save updated chapter document
    await chapter.save();

    // redirect to chapter edit page
    res.redirect(`/subject/part/${chapter._id}/edit`);
});

// post route to remove reference to chapter from removeRef post route in chapter/edit.ejs
router.post('/:id/removeRef',isLoggedIn, isAdmin, async (req, res) => {
    const chapterID = req.params.id;

    // find chapter document
    const chapter = await Chapter.findById(chapterID);

    // retrieve reference id array from request body. If only one reference is selected, it is not an array. So, we need to convert it to an array. 
    const referenceIDs = Array.isArray(req.body.references) ? req.body.references : [req.body.references];

    // remove reference id from chapter document reference array property
    chapter.references = chapter.references.filter((referenceID) => !referenceIDs.includes(referenceID._id.toString()));

    // save updated chapter document
    await chapter.save();

    // redirect to chapter edit page
    res.redirect(`/subject/part/${chapter._id}/edit`);
});

// get route to /exercises page
router.get('/:id/exercises', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    const chapterID = req.params.id;

    // find chapter document and populate exercises array field with all fields except answerExplanation
    const chapter = await Chapter.findById(chapterID).populate('exercises', '-answerExplanation');

    const linkObject = await getLinkObject(chapter, 'chapter');

    // get next and previous chapter if they exist
    const nextChapter = await Chapter.findOne({ index: chapter.index + 1, part: chapter.part });
    const previousChapter = await Chapter.findOne({ index: chapter.index - 1, part: chapter.part });

    // render exercises.ejs file with chapter variable
    res.render('chapter/exercise', { chapter, linkObject, nextChapter, previousChapter });
});

// post route to add exercise to chapter
router.post('/:id/exercises',isLoggedIn, isAdmin, async (req, res) => {
    const chapterID = req.params.id;

    // find chapter document. populate the index field of exercises array
    const chapter = await Chapter.findById(chapterID).populate('exercises', 'index');

    // find the highest index of exercise in chapter
    const index = chapter.exercises.reduce((max, exercise) => exercise.index > max ? exercise.index : max, -1);

    // create new exercise document
    const newExercise = new Exercise({
        problem: 'Problem description goes here', 
        type: req.body.type,
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        answerIndex: 0,
        answerExplanation: 'Explanation goes here',
        answerNumber: 0,
        index: index + 1,
    });

    // save new exercise document
    await newExercise.save();

    // add exercise id to chapter document exercise array property
    chapter.exercises.push(newExercise._id);

    // save updated chapter document
    await chapter.save();

    // redirect to chapter exercises page
    res.redirect(`/subject/part/${chapter._id}/exercises/#addExerciseTitle`);
});

// get route to edit exercise page (chapter/exercise_edit.ejs)
router.get('/chapter/:exerciseID/editExercise',isLoggedIn, isAdmin, async (req, res) => {

    req.session.returnTo = req.originalUrl;

    const exerciseID = req.params.exerciseID;

    // find exercise document
    const exercise = await Exercise.findById(exerciseID);

    const linkObject = [];

    // render exercise_edit.ejs file with exercise variable
    res.render('chapter/exercise_edit', { exercise, linkObject });
});

// post route to edit exercise (route is /chapter/:exerciseID/editExercise)
router.post('/chapter/:exerciseID/editExercise',isLoggedIn, isAdmin, async (req, res) => {
    const exerciseID = req.params.exerciseID;
    
    // find exercise document
    const exercise = await Exercise.findById(exerciseID);
    
    // find chapter document whose exercise array property contains exercise id
    const chapter = await Chapter.findOne({ exercises: exerciseID });


    // update exercise document with new data
    exercise.problem = req.body.problem;
    exercise.type = req.body.type;
    exercise.question = req.body.question;
    //break options into array via newline
    exercise.options = req.body.options.split('\r\n');
    // break answerIndex into array via semi-colon and convert to number
    exercise.answerIndex = req.body.answerIndex.split(';').map((index) => Number(index));
    exercise.answerExplaination = req.body.answerExplaination;
    exercise.answerNumber = req.body.answerNumber;
    exercise.figure = req.body.figure;

    // save updated exercise document
    await exercise.save();

    // redirect to chapter exercises page
    res.redirect(`/subject/part/${chapter._id}/exercises`);
});

// delete route to delete exercise
router.delete('/chapter/:exerciseID/deleteExercise',isLoggedIn, isAdmin, async (req, res) => {
    const exerciseID = req.params.exerciseID;

    // find exercise document
    const exercise = await Exercise.findById(exerciseID);

    // find chapter document whose exercise array property contains exercise id
    const chapter = await Chapter.findOne({ exercises: exerciseID });

    // remove exercise id from chapter document exercise array property
    chapter.exercises = chapter.exercises.filter((exerciseID) => exerciseID.toString() !== exercise._id.toString());

    // save updated chapter document
    await chapter.save();

    // delete exercise document
    await Exercise.findByIdAndDelete(exerciseID);

    // redirect to chapter exercises page
    res.redirect(`/subject/part/${chapter._id}/exercises`);
});

// post route to <exerciseID>/answer 
router.post('/chapter/:exerciseID/answer', async (req, res) => {
    const exerciseID = req.params.exerciseID;

    // find exercise document
    const exercise = await Exercise.findById(exerciseID);

    var isCorrect = false;
    // check if answer type is MCQ
    if (exercise.type === 'MCQ') {
    // check if answer value matches exercise.answerIndex
       isCorrect = exercise.answerIndex.includes(Number(req.body.answer)); 
    } else if (exercise.type === 'Numeric') {
    // check if answer value matches exercise.answerNumber. round the number to 2 decimal places in case user enters a number with more than 2 decimal places
       isCorrect = Number(req.body.answer).toFixed(2) === Number(exercise.answerNumber).toFixed(2);
    } else if (exercise.type === 'MAQ') { 
    // get answer from request body and convert the string array to number array
         const answer = req.body.answer.map((index) => Number(index));
        // check if answer array matches exercise.answerIndex array exactly
       isCorrect = JSON.stringify(exercise.answerIndex) === JSON.stringify(answer);
    }

    // send back isCorrect and answerExplaination
    res.send({ isCorrect, answerExplaination: exercise.answerExplaination });
    


});



module.exports = router;
