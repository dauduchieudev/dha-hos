const path = require("path");
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./configs/passport.js');

const { initModel } = require("./models");
const route = require("./routes");

const app = express();
require("dotenv").config();

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

route(app);

const PORT = process.env.PORT || 3000;

initModel()
    .then(() => {   
        app.listen(PORT, () => {
            console.log(`Listening app in PORT ${PORT}`);
        });
    })
