module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}


// function to check if user is Admin by comparing with the admin username in the .env file and the user id of the current user
module.exports.isAdmin = (req, res, next) => {
    if (req.user._id.toString() !== process.env.ADMIN_OID) {
        req.flash('error', 'you must be an admin to do that');
        return res.redirect('back');
    }
    next();
}


