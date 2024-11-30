class LogoutController {

    // [GET] /logout
    show(req, res) {
        if(req.isAuthenticated()) {
            req.logout(async function(err) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.clearCookie(); // Xóa tất cả các cookie
                res.redirect('/login'); // Chuyển hướng người dùng đến trang đăng nhập
            });
        } else {
            res.redirect('/home');
        } 
    }

}

module.exports = new LogoutController;