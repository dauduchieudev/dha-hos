const appointmentController = require("../controllers/appointment.js");

const express = require("express");
const router = express.Router();

router.get("/", appointmentController.showOld);
router.get("/old", appointmentController.showOld);
router.get("/pending", appointmentController.showPending);
router.get("/new", appointmentController.showNew);
router.get("/renew", appointmentController.showRenew);
router.post("/new/get-department", appointmentController.getDepartment);
router.get("/new/get-clinics", appointmentController.getClinics);
router.get("/renew/:appointment_id", appointmentController.getReVisit);
router.post("/new/get-available-doctors", appointmentController.getAvailableDoctors);
router.post("/new/create-appointment", appointmentController.createAppointment);
router.post("/pending/cancel", appointmentController.cancelAppointment);
router.post("/renew/create-reappointment", appointmentController.createReAppointment);

module.exports = router;