const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Module = require('../models/module');


router.get('/', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    const bgColor = 'quaternary-bg-color';
    const textColor = 'secondary-color';

    res.render('main/landing', { bgColor, textColor });

});

router.get('/learn', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    // Mains ----------------------------------------
    // get the category with title 'Mains'
    const mainsCategory = await Category.findOne({ title: 'Mains' });
    // find all child categories of mainsCategory
    const categories = await Category.find({ parent: mainsCategory._id });
    // get all modules with whose category is in categories array and whose metaData.generation is 0 and sort by index
    let mains = await Module.find({ category: { $in: categories }, 'metaData.generation': 0 }).sort({ index: 1 });

    // Math starter ----------------------------------------
    // get the category with title 'Sides'
    const starterCategory = await Category.findOne({ title: 'Sides' });
    // get all modules with category starterCategory and sort by index
    let starters = await Module.find({ category: starterCategory }).sort({ index: 1 });


    // render learn.ejs file
    res.render('main/learn', { bgColor: 'primary-bg-color', 
    textColor: 'quaternary-color',
    title: 'Learn' ,
    subTitle: 'Self study courses on topics in applied mathematics.',
    thumbnail: '/src/assets/Trove.png',
    categories,starters,mains});


});


router.get('/about', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    // render about.ejs file
    res.render('main/about', { bgColor: 'primary-bg-color', 
    textColor: 'quaternary-color',
    title: 'About' ,
    subTitle: 'Find out more about this website.',
    thumbnail: '/src/assets/about.png'});


});

router.get('/soup', async (req, res) => {

    req.session.returnTo = req.originalUrl;

     // Articles ----------------------------------------
    // get the category with title 'Soup'
    const soupCategory = await Category.findOne({ title: 'Soup' });
    // find all child categories of soupCategory
    const categories = await Category.find({ parent: soupCategory._id });
    categories.push(soupCategory);
    // get all modules with whose category is in categories array and whose metaData.generation is 0 and sort by index
    let articles = await Module.find({ category: { $in: categories }, 'metaData.generation': 0}).sort({ index: 1 });
    let articleCreateDates = articles.map(article => article._id.getTimestamp());
    articleCreateDates = articleCreateDates.map(date => date.getDate() + ' ' + date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear());
    
    // render soup.ejs file
    res.render('main/soup', { bgColor: 'primary-bg-color', 
    textColor: 'quaternary-color',
    title: 'Soup' ,
    subTitle: 'Single page articles on applied math.',
    thumbnail: '/src/assets/Soup.png',
    categories,articles,articleCreateDates});


});


module.exports = router;