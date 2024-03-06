const express = require('express');
const router = express.Router();

const Module = require('../models/module');
const Category = require('../models/category');

// get route to each module page
router.get('/', async (req, res) => {

    // get module id from query string
    const moduleID = req.query.id;

    // find module document
    const module = await Module.findById(moduleID, 'title category');

    // find category document of module
    const category = await Category.findById(module.category);

    // render module.ejs 
    res.render('module/show', { moduleID, category});
    
});

// get route to send module data
router.get('/data/:id', async (req, res) => {

    const moduleID = req.params.id;

    // find module document
    const module = await Module.findById(moduleID);
    // find parent module document and return only _id and title fields
    const parentModule = await Module.findById(module.parent, '_id index title metaData');
    // find previous module document by index number if index is greater than 0 and return only _id and title fields
    const previousModule = await Module.findOne({ index: module.index - 1, parent: module.parent }, '_id index title metaData');
    // find next module document by index number if it exists and return only _id and title fields
    const nextModule = await Module.findOne({ index: module.index + 1, parent: module.parent }, '_id index title metaData');
    // get all child modules
    const childModules = await Module.find({parent:module._id})
    // sort child modules by index
    childModules.sort((a, b) => a.index - b.index);

    // find category document of module
    const category = await Category.findById(module.category);

    let moduleCreateDate = module._id.getTimestamp();
    moduleCreateDate = moduleCreateDate.getDate() + ' ' + moduleCreateDate.toLocaleString('default', { month: 'short' }) + ' ' + moduleCreateDate.getFullYear();
    const updateDate = new Date(module.body.time);
    const moduleUpdateDate = updateDate.getDate() + ' ' + updateDate.toLocaleString('default', { month: 'short' }) + ' ' + updateDate.getFullYear();

    res.send({module,moduleCreateDate,moduleUpdateDate, parentModule, previousModule, nextModule, childModules, category});
    

});

// post route to send module data
router.post('/dataSimple/:id', async (req, res) => {

    const moduleID = req.params.id;

    // find module document
    const module = await Module.findById(moduleID).lean();

    res.send(module?.body);

});


module.exports = router;
