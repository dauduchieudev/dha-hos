const authorizeRoles = require("../middlewares/authorizeRoles.js");

const loginRouter = require("./authenRouters/login.js");
const signupRouter = require("./authenRouters/signup.js");
const logoutRouter = require("./authenRouters/logout.js");
const homeRouter = require("./homeRouters/home.js");
const userHomeRouter = require("./homeRouters/userhome.js");
const doctorRouter = require("./homeRouters/doctor.js");
const adminRouter = require("./homeRouters/admin.js");
const appointmentRouter = require("./appointment.js");
const viewResultRouter = require("./viewresult.js");
const symptomSearchRouter = require("./homeRouters/symptomSearch.js")
const medicinesRouter = require('./medicines.js')

function route(app) {

    app.use('/login', loginRouter);

    app.use('/signup', signupRouter);

    app.use('/logout', logoutRouter);

    app.use('/home', homeRouter);

    app.use('/userhome', authorizeRoles('Bệnh nhân'), userHomeRouter);

    app.use('/doctor', authorizeRoles('Bác sĩ'), doctorRouter);

    app.use('/admin', authorizeRoles('Quản lý'), adminRouter);

    app.use('/appointment', authorizeRoles('Bệnh nhân'), appointmentRouter);

    app.use('/view-result', authorizeRoles('Bệnh nhân'), viewResultRouter);
    
    app.use("/symptom-search", symptomSearchRouter)

    app.use('/medicines', medicinesRouter)

    app.use('/', homeRouter);

}

module.exports = route;
