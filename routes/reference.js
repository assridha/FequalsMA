const express = require('express');
const router = express.Router();

const Reference = require('../models/reference');
const { isLoggedIn, isAdmin } = require('../utils/middleware');

// get route to editor page
router.get('/editor',isLoggedIn, isAdmin, async (req, res) => {

    // obtain all references
    const references = await Reference.find({});

    let linkObject = [];
    // render editor.ejs with references variable
    res.render('reference/editor', { references, linkObject });


});
// post route to create new reference
router.post('/',isLoggedIn, isAdmin, async (req, res) => {


    // create new reference document
    const reference = new Reference({
        title: req.body.title,
        url: req.body.url,
        // authors is an array of strings. Split the string into an array of strings
        authors: req.body.authors.split(','),
        // tags is an array of strings. Split the string into an array of strings
        tags: req.body.tags.split(','),
        mediatype: req.body.mediatype,
        metastring: req.body.metastring,
    });

    // save new reference document
    await reference.save();

    // redirect to editor page
    res.redirect('/references/editor');
});


// export router
module.exports = router;