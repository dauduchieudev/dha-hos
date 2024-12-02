const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Medication = require('../models/Medication');

// [GET] /medicine - Hiển thị danh sách thuốc với phân trang
router.get("/", async (req, res) => {
    if (req.isAuthenticated() && req.user.role !== 'Quản lý') { // Kiểm tra người dùng bình thường
        try {
            const page = parseInt(req.query.page) || 1; // Lấy số trang từ query string, mặc định là trang 1
            const limit = 10; // Số lượng thuốc mỗi trang
            const offset = (page - 1) * limit; // Tính toán offset để phân trang

            // Đếm tổng số thuốc trong cơ sở dữ liệu
            const totalMedications = await Medication.count();

            const totalPages = Math.ceil(totalMedications / limit); // Tính tổng số trang

            // Lấy danh sách thuốc từ cơ sở dữ liệu với phân trang
            const medications = await Medication.findAll({
                limit,
                offset,
                order: [
                    ['medication_id', 'ASC'],  // Sắp xếp theo ID thuốc
                ],
            });

            res.render('medicines', {
                layout: 'layouts/layout',
                title: 'Medication List',
                isAuthenticated: true,
                user: req.user,
                medications: medications,
                errorMessage: null,
                currentPage: page,
                totalPages: totalPages  // Số trang tổng cộng để phân trang
            });
        } catch (error) {
            console.error('Error fetching medications:', error);
            res.redirect('/home');
        }
    } else {
        res.redirect('/login'); // Nếu người dùng không hợp lệ, chuyển hướng về trang chủ
    }
});

// [POST] /medicine/search - Tìm kiếm thuốc theo tên
router.post("/search", async (req, res) => {
    if (req.isAuthenticated() && req.user.role !== 'Quản lý') { // Kiểm tra người dùng bình thường
        try {
            const { medication_name } = req.body;

            if (!medication_name) {
                return res.redirect('/medicine');  // Nếu không có tên thuốc, redirect về trang danh sách thuốc
            }

            // Tìm kiếm thuốc theo tên (có phân trang nếu cần)
            const medications = await Medication.findAll({
                where: {
                    medication_name: {
                        [Op.like]: `${medication_name}%`  // Tìm kiếm theo tên thuốc bắt đầu với medication_name
                    }
                },
                order: [
                    ['medication_id', 'ASC']
                ]
            });

            // Nếu không có thuốc nào tìm thấy
            if (medications.length === 0) {
                return res.render('medicines', {
                    layout: 'layouts/layout',
                    title: 'Medication List',
                    isAuthenticated: true,
                    user: req.user,
                    medications: [], // Không có kết quả tìm kiếm
                    errorMessage: `No medications found with name starting with "${medication_name}".`,
                    currentPage: 1,
                    totalPages: 1
                });
            }

            // Nếu tìm thấy medications, render danh sách thuốc tìm được
            res.render('medicines', {
                layout: 'layouts/layout',
                title: 'Medication List',
                isAuthenticated: true,
                user: req.user,
                medications: medications, // Hiển thị danh sách thuốc tìm được
                errorMessage: null,
                currentPage: 1,
                totalPages: 1
            });
        } catch (error) {
            console.error('Error searching for medication:', error);
            res.redirect('/medicine');
        }
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
