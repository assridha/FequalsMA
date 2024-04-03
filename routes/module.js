const express = require('express');
const router = express.Router();

const Module = require('../models/module');
const Category = require('../models/category');

// get route to each module page
router.get('/:id', async (req, res) => {

    const moduleID = req.params.id;
    
    // render module.ejs 
    res.render('module/show',{moduleID});
    
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


    //
    
    let mainCategory = await Category.findOne({ title: 'Mains' });
    let courseCategories = await Category.find({ parent: mainCategory._id });
    let courseModules = await Module.find({ category: { $in: courseCategories } }, 'title index parent metaData');

    let subjects = courseModules.filter(module => module.metaData.generation === 0).sort((a, b) => a.index - b.index);
    let parts = courseModules.filter(module => module.metaData.generation === 1).sort((a, b) => a.index - b.index);
    let chapters = courseModules.filter(module => module.metaData.generation === 2).sort((a, b) => a.index - b.index);

    toc = { subjects, parts, chapters };

    //


    res.send({module,moduleCreateDate,moduleUpdateDate, parentModule, previousModule, nextModule, childModules, category,toc});
    

});

// post route to send module data
router.post('/dataSimple/:id', async (req, res) => {

    const moduleID = req.params.id;

    // find module document
    const module = await Module.findById(moduleID).lean();

    res.send(module?.body);

});


module.exports = router;
