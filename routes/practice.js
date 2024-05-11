const express = require('express');
const router = express.Router();

const Module = require('../models/module');
const Category = require('../models/category');

router.get('/latest', async (req, res) => {
    const modules = await Module.find({ 'metaData.generation': 3 }).select('_id');
    // find latest module by creation date from id.getTimestamp()
    const latestModule = modules.reduce((a, b) => a._id.getTimestamp() > b._id.getTimestamp() ? a : b);

    res.redirect(`/practice#${latestModule._id}`);
});

router.get('/', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    const allModules = await Module.find({ category: { $exists: true, $ne: null } }, 'title category type parent metaData index');
    const starterCategory = await Category.findOne({ title: 'Sides' });
    const mainsCategory = await Category.findOne({title: 'Mains'});
    const subjectCategories = await Category.find({parent: mainsCategory._id})

    // render practice.ejs file
    res.render('main/practice', { bgColor: 'primary-bg-color', 
    textColor: 'quaternary-color',
    title: 'Practice' ,
    subTitle: 'Test your knowledge.',
    thumbnail: '/src/assets/Trials.png',
    allModules,
    starterCategory,
    subjectCategories,
    mainsCategory
});
    }

);

// get route to send random module data
router.get('/data/:id', async (req, res) => {

    const moduleID = req.params.id;
    const data = await Module.findById(moduleID);
    
    const module = data? data : {
        title: "No exercise to display",
        body: {
        time: 1697289074525,
        blocks: [{
                    id: "xxxx",
                    type: "paragraph",
                    data: {
                    text: "-",
                    id: "xxx"}}],
          version: "2.28.0"}};
    
    res.send({module});
    
});

module.exports = router;
