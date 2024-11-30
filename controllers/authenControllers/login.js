class LoginController {

    // [GET] /login
    show(req, res) {
        res.render('login', { layout: false, errorMessage: null });
    }

    // [POST] /login
    submit(passport) {
        return (req, res, next) => {
            passport.authenticate('local', (err, user, info) => {
                if (err) {
                    return next(err); // Xử lý lỗi nếu có
                }
                if (!user) {
                    return res.render('login', { layout: false, errorMessage: 'Tài khoản mật khẩu không đúng!' });
                }
                // Xác thực thành công
                req.logIn(user, (err) => {
                    if (err) {
                        return next(err);
                    }
                    
                    return res.redirect('/userhome'); 
                });
            })(req, res, next); // Gọi hàm authenticate với req, res, next
        };
    }

}

module.exports = new LoginController;