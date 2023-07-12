const express = require('express');
const router = express.Router();

const Page = require('../models/page');

const { getIndex } = require('../utils/getIndex');
const { getLinkObject } = require('../utils/getLinkObject');
const { isLoggedIn, isAdmin } = require('../utils/middleware');

// get route to page
router.get('/page/:id', async (req, res) => {

    const page = await Page.findById(req.params.id);
    
    if(!page) {
        req.flash('error', 'Page not found');
        return res.redirect('/');
    }

    res.render('page/show', {page});
}
);

// post route to create blog
router.post('/blog', isLoggedIn, isAdmin, async (req, res) => {
        
        const title = 'New page';
        const content = '<p> new page content </p>';
        const summary = 'New page summary';
        const category = 'blog';
        const published = false;
        const page = new Page({ title, content , summary, category, published });
        await page.save();
        req.flash('success', 'Page created');
        res.redirect(`/`);
    }
);

// post route to create side page
router.post('/side', isLoggedIn, isAdmin, async (req, res) => {
            
            const title = 'New page';
            const content = '<p> New page content </p>';
            const summary = 'New page summary';
            const category = 'side';
            const published = false;
            const page = new Page({ title, content , summary,category, published });
            await page.save();
            req.flash('success', 'Page created');
            res.redirect(`/`);
        }
);

// get route to edit page
router.get('/page/:id/edit', isLoggedIn, isAdmin, async (req, res) => {

    const page = await Page.findById(req.params.id);
    if(!page) {
        req.flash('error', 'Page not found');
        return res.redirect('/');
    }
    res.render('page/edit', {page});
}
);


// post route to submit edited page
router.post('/page/:id', isLoggedIn, isAdmin, async (req, res) => {
                
                const page = await Page.findById(req.params.id);
                if(!page) {
                    req.flash('error', 'Page not found');
                    return res.redirect('/');
                }
                page.title = req.body.title;
                page.content = req.body.content;
                page.summary = req.body.summary;
                page.published = req.body.published;
                page.updated = Date.now();
                await page.save();
                req.flash('success', 'Page updated');
                res.redirect(`/page/${page._id}`);
            }
);

// delete route to delete page
router.delete('/page/:id', isLoggedIn, isAdmin, async (req, res) => {

    const page = await Page.findById(req.params.id);
    if(!page) {
        req.flash('error', 'Page not found');
        return res.redirect('/');
    }
    await page.delete();
    req.flash('success', 'Page deleted');
    res.redirect(`/`);
}
);




module.exports = router;