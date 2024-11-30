class UserHomeController {

    // [GET] /userhome
    show(req, res) {
        const isAuthenticated = req.isAuthenticated();
        const user = req.user || null;

        res.render('userhome', { layout: false, isAuthenticated, user });
    }

}

module.exports = new UserHomeController;