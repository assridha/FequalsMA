const express = require('express');
const router = express.Router();

const Module = require('../models/module');

router.get('/', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    const moduleID = req.query.id;
    const modules = await Module.find({ 'metaData.generation': 4 }, '_id');

    if (moduleID === 'latest') {
        // retrieve all modules (only _id field) with generation 4 
      

        res.redirect(`/practice?id=${modules[modules.length-1]._id}`);

        

    } else {

    // remove current module from array
    const filteredModules = modules.filter(exercise => exercise._id.toString() !== moduleID);

    // get random exercise
    const randomExercise = filteredModules[Math.floor(Math.random() * filteredModules.length)];
    

    // render practice.ejs file
    res.render('main/practice', { bgColor: 'primary-bg-color', 
    textColor: 'quaternary-color',
    title: 'Practice' ,
    subTitle: 'Apply your knowledge and skills to solve challenging problems.',
    thumbnail: 'https://onedrive.live.com/embed?resid=1ca1eb3abf73ac72%2118240&authkey=%21ANJVXbdHltXdFY4&width=419&height=421',
    nextModule: randomExercise._id});
    
    }

});

// post route to send module data
router.post('/data/:id', async (req, res) => {

    const moduleID = req.params.id;

    let module = null;

    if (moduleID === 'latest') {
        // get the most recently created module with generation 4
        module = await Module.findOne({ 'metaData.generation': 4 }).sort({ createdAt: -1 });
    } else {
        // find module document
        module = await Module.findById(moduleID);
    }

    res.send({module});
    

});

module.exports = router;
