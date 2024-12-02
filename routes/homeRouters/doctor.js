const doctorController = require("../../controllers/homeControllers/doctor.js")

const express = require("express");
const router = express.Router();

router.get("/", doctorController.showAppointment);
router.get("/appointment", doctorController.showAppointment);
router.get("/shift-schedule", doctorController.showShiftSchedule);
router.get("/search-shift-schedule", doctorController.searchShiftSchedule);

router.get("/edit-result/:appointment_id", doctorController.showEditResultPage);
router.get("/edit-result", doctorController.showResultPage);

router.get("/get-test-types", doctorController.getTestTypes);
router.get("/get-test-indicators/:test_type_id", doctorController.getTestIndicators);
router.get("/get-imaging-types", doctorController.getImagingTypes);
router.get("/get-medications", doctorController.getMedications);
router.get("/edit-test-indicator/:test_result_id", doctorController.showEditTestIndicator);

router.post("/submit-diagnosis", doctorController.submitDiagnosis);
router.post("/submit-test-result", doctorController.submitTestResult);
router.post("/save-image-result", doctorController.saveImageResult);
router.post("/check-and-create-prescription/:appointmentId", doctorController.checkAndCreatePrescription);
router.post("/delete-image-result", doctorController.deleteImageResult);
router.post("/delete-prescription", doctorController.deletePrescription);
router.post("/update-test-indicator/:test_result_id", doctorController.updateTestIndicator);

module.exports = router;