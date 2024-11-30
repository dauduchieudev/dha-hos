const User = require('../../models/User.js');
const Patient = require('../../models/Patient.js')

class SignupController {

    // [GET] /signup
    show(req, res) {
        res.render('signup', { layout: false, errorMessage: null });
    }

    // [POST] /signup
    async submit(req, res) {
        const { username, password, fullname, birthdate, gender, phone_number, address, gmail } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!username || !password || !fullname || !birthdate || !phone_number || !address) {
            return res.render('signup', { layout: false, errorMessage: 'Vui lòng nhập đầy đủ thông tin!' });
        }

        // Kiểm tra định dạng
        if (!phone_number.match(/^\d{10,15}$/)) {
            return res.render('signup', { layout: false, errorMessage: 'Số điện thoại không hợp lệ!' });
        }

        if (gmail && !gmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return res.render('signup', { layout: false, errorMessage: 'Email không hợp lệ!' });
        }

        try {
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            const existingUser = await User.findOne({ where: { user_name: username } });
            if (existingUser) {
                return res.render('signup', { layout: false, errorMessage: 'Tên đăng nhập đã tồn tại!' });
            }

            // Lưu người dùng mới
            const user = await User.create({
                user_name: username,
                password, 
                role: "Bệnh nhân",
                full_name: fullname,
                birthdate,
                gender,
                phone_number,
                address,
                email: gmail || null,
            });
            
            await Patient.create({
                user_id: user.user_id,
                blood_type_id: null,
                allergies: null,
            }) 

            res.redirect('/login'); // Chuyển đến trang đăng nhập sau khi đăng ký thành công
        } catch (error) {
            console.error('Error during signup:', error);
            res.render('signup', { layout: false, errorMessage: 'Đã xảy ra lỗi, vui lòng thử lại!' });
        }
    }
}

module.exports = new SignupController;