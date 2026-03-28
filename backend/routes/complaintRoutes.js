const express = require("express");
const router = express.Router();
const complaintController = require("../controllers/complaintController");
const protect = require("../utils/authMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", protect, complaintController.createComplaint);
router.get("/", protect, complaintController.getComplaints);
router.get("/analytics", protect, complaintController.getAnalytics);
router.put("/:id", protect, complaintController.updateComplaint);
router.delete("/:id", protect, complaintController.deleteComplaint);
router.post(
  "/upload-csv",
  protect,
  upload.single("file"),
  complaintController.uploadCSV,
);

module.exports = router;
