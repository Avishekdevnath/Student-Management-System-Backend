const express = require("express");
// const multer = require("multer");
const {
    addStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    permanentlyDeleteStudent,
    assignBatchToStudent,
    removeStudentFromBatch,
    markAttendance,
    bulkUpdateAttendance,
    updateTaskStatus,
    bulkUpdateTaskStatus,
    calculateQualityPercentage,
    getTopStudents,
    uploadStudentsFromExcel
} = require("../controllers/studentController");

const router = express.Router();
// const upload = multer({ dest: "uploads/" });

/* ============================ CRUD Student Management ============================ */
// ✅ Add a New Student (Auto-Generates Student ID)
router.post("/add", addStudent);

// ✅ Get All Students
router.get("/all", getAllStudents);

// ✅ Get a Student by ID
router.get("/:studentId", getStudentById);

// ✅ Update Student Details
router.put("/update/:studentId", updateStudent);

// ✅ Soft Delete a Student
router.delete("/delete/:studentId", deleteStudent);

// ❗ Permanently Delete a Student (Hard Delete)
router.delete("/delete-permanent/:studentId", permanentlyDeleteStudent);

/* ============================ Batch & Task Sync ============================ */
// ✅ Assign Student to Batch & Sync Tasks
router.put("/assign-batch", assignBatchToStudent);

// ✅ Remove Student from Batch (Resets Progress)
router.put("/remove-from-batch", removeStudentFromBatch);

/* ============================ Attendance Management ============================ */
// ✅ Mark Attendance for a Student
router.put("/attendance/:studentId", markAttendance);

// ✅ Bulk Update Attendance
router.put("/attendance/bulk", bulkUpdateAttendance);

/* ============================ Task Progress ============================ */
// ✅ Update a Student’s Task Status (Pending -> Done)
router.put("/task/:studentId", updateTaskStatus);

// ✅ Bulk Update Task Status (By Emails)
router.put("/task/bulk", bulkUpdateTaskStatus);

/* ============================ Performance & Leaderboard ============================ */
// ✅ Calculate & Update Quality Percentage for All Students
router.put("/calculate-quality", calculateQualityPercentage);

// ✅ Get Top Students by Quality Percentage
router.get("/top-students", getTopStudents);

/* ============================ Bulk Upload & Export ============================ */
// ✅ Bulk Upload Students from Excel
// router.post("/bulk-upload/:batchId", upload.single("file"), uploadStudentsFromExcel);

module.exports = router;
