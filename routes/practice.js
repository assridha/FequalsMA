const express = require('express');
const router = express.Router();

const Module = require('../models/module');

router.get('/latest', async (req, res) => {
    console.log('latest')
    const modules = await Module.find({ 'metaData.generation': 3 }).select('_id');
    // find latest module by creation date from id.getTimestamp()
    const latestModule = modules.reduce((a, b) => a._id.getTimestamp() > b._id.getTimestamp() ? a : b);

    res.redirect(`/practice#${latestModule._id}`);
});

router.get('/', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    // render practice.ejs file
    res.render('main/practice', { bgColor: 'primary-bg-color', 
    textColor: 'quaternary-color',
    title: 'Practice' ,
    subTitle: 'Apply your knowledge and skills to solve challenging problems.',
    thumbnail: '/src/assets/Trials.png'});
    }

);

// get route to send random module data
router.get('/data/:id', async (req, res) => {

    const moduleID = req.params.id;

    const module = await Module.findById(moduleID);
    const modules = await Module.find({ 'metaData.generation': 3 }, '_id');
    // remove current module from array
    const filteredModules = modules.filter(exercise => exercise._id.toString() !== moduleID);
    // get random exercise
    const randomExercise = filteredModules[Math.floor(Math.random() * filteredModules.length)];
    res.send({module,randomExercise});
    
});

module.exports = router;
