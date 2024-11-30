class HomeController {

    // [GET] /home
    show(req, res) {
        if(req.isAuthenticated()) {
            if (req.user.role === 'Bệnh nhân') {
                res.redirect('/userhome');
            } else if (req.user.role === 'Bác sĩ') {
                res.redirect('/doctorhome');
            } else {
                res.redirect('/admin');
            }
        } else {
            return res.render('home', { layout: false });
        }
    }

}

module.exports = new HomeController;