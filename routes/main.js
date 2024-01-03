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
    thumbnail: 'https://onedrive.live.com/embed?resid=1ca1eb3abf73ac72%2118239&authkey=%21ABL4kRuPBtIHaKc&width=419&height=415',
    categories,starters,mains});


});


router.get('/about', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    // render about.ejs file
    res.render('main/about', { bgColor: 'primary-bg-color', 
    textColor: 'quaternary-color',
    title: 'About' ,
    subTitle: 'Find out more about this website.',
    thumbnail: 'https://onedrive.live.com/embed?resid=1ca1eb3abf73ac72%2118671&authkey=%21ADC87HuZjrtB1Hg&width=245&height=245'});


});

router.get('/soup', async (req, res) => {

    req.session.returnTo = req.originalUrl;

    // render soup.ejs file
    res.render('main/soup', { bgColor: 'primary-bg-color', 
    textColor: 'quaternary-color',
    title: 'Soup' ,
    subTitle: 'Single page articles on applied math.',
    thumbnail: 'https://onedrive.live.com/embed?resid=1ca1eb3abf73ac72%2118241&authkey=%21APmG771_O9kjENQ&width=419&height=421'});


});


module.exports = router;