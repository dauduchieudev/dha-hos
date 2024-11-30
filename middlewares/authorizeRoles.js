function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const userRole = req.user?.role; // Giả định `req.user` chứa thông tin người dùng

        if (!userRole || !allowedRoles.includes(userRole)) {
            
            if (!userRole) {
                return res.redirect('/login');
            } else if (userRole === 'Bệnh nhân') {
                return res.redirect('/userhome');
            } else if (userRole === 'Quản lý') {
                return res.redirect('/admin');
            }
                
            return res.redirect('/doctor');

        }

        next(); // Tiếp tục xử lý nếu vai trò hợp lệ
    };
}

module.exports = authorizeRoles;