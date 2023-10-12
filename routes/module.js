const express = require('express');
const router = express.Router();

const Module = require('../models/module');

// get route to each module page
router.get('/', async (req, res) => {
    // render module.ejs 
    res.render('module/show');
    
});

// get route to send module data
router.get('/data/:id', async (req, res) => {

    const moduleID = req.params.id;

    // find module document
    const module = await Module.findById(moduleID);

    res.send(module);

});






module.exports = router;
