// routes for user authentication
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// get route to /register
router.get('/register', (req, res) => {
    const linkObject = [];
    res.render('users/register', { linkObject });
});


// post route to /register
router.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Pola!');
            res.redirect('/pola');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});

// get route to /login
router.get('/login', (req, res) => {
    const linkObject = [];
    res.render('users/login', { linkObject });
});

// post route to /login using passport.authenticate middleware
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login',keepSessionInfo: true }), (req, res) => {
    req.flash('success', 'Welcome back!');
    // redirect pola    
    res.redirect(req.session.returnTo || '/pola');
});



// get route to /logout using passport.authenticate middleware and req.logout() method. Add callback function to logout
router.get('/logout', (req, res) => {
    req.logout(
        (err) => {
            if (err) {
                console.log(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('back')
        });
});




// export router
module.exports = router;