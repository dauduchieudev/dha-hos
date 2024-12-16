const path = require("path");
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./configs/passport.js');

const { initModel } = require("./models");
const route = require("./routes");

const sequelize = require('./configs/database.js');
const { QueryTypes } = require('sequelize');

const app = express();
require("dotenv").config();

const http = require('http').Server(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
  socket.on('search', async ({ field, value }) => {
    console.log('Received search event:', { field, value });

    let colName = field === 'username' ? 'U.user_name' : 'U.full_name';

    try {
      const query = `
      SELECT 
        U.full_name AS full_name,
        U.role AS role,
        U.user_name AS username,
        U.password AS password,
        dept.department_name AS khoa
      FROM Users U
      LEFT JOIN Doctors doc ON U.user_id = doc.user_id
      LEFT JOIN Departments_Doctors dd ON dd.Doctors_doctor_id = doc.doctor_id
      LEFT JOIN Departments dept ON dept.department_id = dd.Departments_department_id
      WHERE ${colName} LIKE :searchValue
    `;

      const results = await sequelize.query(query, {
        replacements: { searchValue: `%${value}%` },
        type: QueryTypes.SELECT
      });

      socket.emit('searchResults', results);
    } catch (error) {
      console.error('Error searching users:', error);
      socket.emit('searchResults', { error: 'Có lỗi xảy ra khi tìm kiếm.' });
    }
  });

  // Bắt event disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
})

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set('views', './views');
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);
app.set('layout', 'layouts/layout.ejs');

app.use(
  session({
    secret: 'sessionOfDHA',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,  // Bảo vệ cookie
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get('/acc', (req, res) => {
  res.render('acc', { layout: false });
});

route(app);

const PORT = process.env.PORT || 3000;

initModel()
  .then(() => {
    http.listen(PORT, () => {
      console.log(`Listening app in PORT ${PORT}`);
    });
  })
