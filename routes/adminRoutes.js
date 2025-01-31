const express = require('express');
const router = express.Router();

// Controllers
const userManagementController = require('../controllers/AdminControllers/userController');
const adminControllers = require('../controllers/AdminControllers/dashboardController');
const batchController = require('../controllers/AdminControllers/batchController');
const missionController = require('../controllers/AdminControllers/missionController');
const assignmentManagementController = require('../controllers/AdminControllers/assignmentController');
const notificationController = require('../controllers/AdminControllers/notificationController');
const reportingController = require('../controllers/AdminControllers/reportController');
const authController = require('../controllers/AdminControllers/authController');
const roleController = require('../controllers/AdminControllers/roleController');
const auditLogController = require('../controllers/AdminControllers/auditController');
const studentController = require('../controllers/AdminControllers/studentController');
const leaderboardController = require('../controllers/AdminControllers/leaderboardController');
const moderatorController = require('../controllers/adminControllers/moderatorController');
const semesterController = require('../controllers/adminControllers/semesterController');
const courseController = require('../controllers/adminControllers/courseController');

console.log(userManagementController);

// Admin Dashboard route
router.get('/dashboard', adminControllers.getDashboardStats);

// Route to get advisors
router.get('/advisors', adminControllers.getAdvisors);

// Route to get teams
router.get('/teams', adminControllers.getTeams);

// Route to get batches
router.get('/batches', adminControllers.getBatches);
router.get('/user-stats', adminControllers.getUserStats);


console.log('hi 37');

// User Management routes
router.post('/create-user', userManagementController.createUser);
router.get('/users', userManagementController.getAllUsers);
router.get('/search-users', userManagementController.searchUsers); // Search users
router.put('/edit-user/:userId', userManagementController.editUser);
router.delete('/delete-user/:userId', userManagementController.deleteUser);
router.post('/assign-role', userManagementController.assignRole);
router.post('/assign-role/:userId', userManagementController.assignRole);
router.get('/user-profile/:userId', userManagementController.getUserProfile); // Get user profile by ID



// Routes for managing moderators
router.get('/moderators', moderatorController.getAllModerators);
router.post('/create-moderator', moderatorController.createModerator);
router.get('/moderator/:moderatorId', moderatorController.getModeratorById);
router.put('/edit-moderator/:moderatorId', moderatorController.updateModerator);
router.delete('/delete-moderator/:moderatorId', moderatorController.deleteModerator);
router.put('/assign-role/:moderatorId', moderatorController.assignRoleToModerator);








// Student Management routes
router.post('/create', studentController.createStudent);
router.get('/students', studentController.getAllStudents);
router.get('/search-students', studentController.searchStudents);
router.get('/students/:studentId', studentController.getStudentById);
router.get('/student-profile/:id', studentController.getStudentProfile);
router.put('/students/:studentId', studentController.editStudent);
router.delete('/students/:studentId', studentController.deleteStudent);

// Leader assignment routes
router.post('/assign-leader', studentController.assignLeader);
router.get('/students-by-leader/:leaderId', studentController.getStudentsByLeader);

// Progress routes
router.put('/update-progress', studentController.updateProgress);

// Leaderboard routes
router.post('/update', leaderboardController.updateLeaderboard);
router.post('/calculate-rankings', leaderboardController.calculateRankings);
router.get('/course/:courseId', leaderboardController.getCourseLeaderboard);

// const batchController = require('../controllers/AdminControllers/batchController');

// Batch Management routes
router.post('/batches/create', batchController.createBatch);  // Create a new batch
router.get('/batches', batchController.getAllBatches);  // View all batches
router.get('/batches/:batchId', batchController.getBatchById);  // View a specific batch by ID
router.put('/batches/:batchId', batchController.editBatch);  // Update batch details
router.delete('/batches/:batchId', batchController.deleteBatch);  // Delete a batch

// Semester Management routes
router.post('/batches/:batchId/semesters', batchController.addSemesterToBatch);  // Create a new semester for a batch
router.put('/batches/:batchId/semesters/:semesterId', batchController.editSemesterInBatch);  // Update a semester in a batch
router.delete('/batches/:batchId/semesters/:semesterId', batchController.deleteSemesterFromBatch);  // Delete a semester from a batch

// View students in a specific batch
router.get('/batches/students/:batchId', batchController.getStudentsInBatch);  // Get all students assigned to a batch

// Assign teams to a batch
router.post('/batches/assign-teams', batchController.assignTeamsToBatch);  // Assign teams to a batch





// Create a new semester
router.post('/semesters/create', semesterController.createSemester);

// Get all semesters
router.get('/semesters', semesterController.getAllSemesters);

// Get a specific semester by ID
router.get('/semesters/:semesterId', semesterController.getSemesterById);

// Update a semester
router.put('/semesters/:semesterId', semesterController.updateSemester);

// Delete a semester
router.delete('/semesters/:semesterId', semesterController.deleteSemester);





// Create a new course
router.post('/courses/create', courseController.createCourse);

// Get all courses
router.get('/courses', courseController.getAllCourses);

// Get a specific course by ID
router.get('/courses/:courseId', courseController.getCourseById);

// Update a course
router.put('/courses/:courseId', courseController.updateCourse);

// Delete a course
router.delete('/courses/:courseId', courseController.deleteCourse);


// --- Week Routes ---
router.post('/weeks/create', courseController.createWeek);  // Create a new week
router.put('/weeks/:weekId', courseController.updateWeek);  // Update an existing week
router.delete('/weeks/:weekId', courseController.deleteWeek);  // Delete a week
router.post('/courses/:courseId/weeks', courseController.addWeekToCourse);  // Add a week to a course

// --- Module Routes ---
router.post('/weeks/:weekId/modules', courseController.addModuleToWeek);  // Add a module to a week
router.delete('/weeks/:weekId/modules/:moduleId', courseController.removeModuleFromWeek);  // Remove a module from a week

// --- Assignment Routes ---
router.post('/weeks/:weekId/modules/:moduleId/assignments', courseController.addAssignmentToModule);  // Add an assignment to a module
router.delete('/weeks/:weekId/modules/:moduleId/assignments/:assignmentId', courseController.removeAssignmentFromModule);  // Remove an assignment from a module

// --- Exam Routes ---
router.post('/weeks/:weekId/modules/:moduleId/exams', courseController.addExamToModule);  // Add an exam to a module
router.delete('/weeks/:weekId/modules/:moduleId/exams/:examId', courseController.removeExamFromModule);  // Remove an exam from a module











// // Mission Management routes
// router.post('/create-mission', missionController.createMission);
// router.get('/missions', missionController.getAllMissions);
// router.get('/mission/:missionId', missionController.getMissionById);
// router.put('/edit-mission/:missionId', missionController.editMission);
// router.delete('/delete-mission/:missionId', missionController.deleteMission);
// router.post('/assign-mission', missionController.assignMission);

// // Assignment Management routes
// router.post('/create-assignment', assignmentManagementController.createAssignment);
// router.get('/assignments', assignmentManagementController.getAllAssignments);
// router.put('/edit-assignment/:assignmentId', assignmentManagementController.editAssignment);
// router.delete('/delete-assignment/:assignmentId', assignmentManagementController.deleteAssignment);
// router.post('/assign-assignment', assignmentManagementController.assignAssignment);

// // Notification Management routes
// router.post('/create-notification', notificationController.createNotification);
// router.get('/notifications', notificationController.getNotifications);
// router.get('/notification/:notificationId', notificationController.getNotificationById);
// router.put('/update-notification/:notificationId', notificationController.updateNotification);
// router.delete('/delete-notification/:notificationId', notificationController.deleteNotification);
// router.put('/mark-as-read/:notificationId', notificationController.markAsRead);
// router.put('/mark-as-unread/:notificationId', notificationController.markAsUnread);

// // Reporting routes
// router.get('/report/users', reportingController.generateUserCSVReport);
// router.get('/report/batches', reportingController.generateBatchPDFReport);
// router.get('/report/assignments', reportingController.generateAssignmentReport);
// router.get('/report/missions', reportingController.generateMissionReport);
// router.get('/report/notifications', reportingController.generateNotificationReport);

// // Authentication & Security routes
// router.post('/login', authController.login);
// router.post('/logout', authController.logout);
// router.put('/change-password', authController.changePassword);

// // Role & Permissions Management routes
// router.post('/create-role', roleController.createRole);
// router.put('/edit-role/:roleId', roleController.editRole);
// router.post('/assign-role-to-user', roleController.assignRoleToUser);

// // Audit Logs routes
// router.get('/audit-logs', auditLogController.viewLogs);
// router.delete('/audit-logs/:logId', auditLogController.deleteLog);
// router.get('/audit-logs/count', auditLogController.getLogsCount);
// router.delete('/audit-logs/clear', auditLogController.clearAllLogs);

module.exports = router;
