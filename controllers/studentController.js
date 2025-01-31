const Student = require("../models/studentModel");
const User = require("../models/userModel");
const Batch = require("../models/batchModel");
const xlsx = require("xlsx");
const fs = require("fs");
const { log } = require("console");
// const Student = require("../models/studentModel");
// const User = require("../models/userModel");
// const Batch = require("../models/batchModel");

const addStudent = async (req, res) => {
    console.log('hi');
    
    try {
        const { firstName, lastName, email, phone, batchId, advisorId } = req.body;
        // Then, use these variables as needed in your code (i.e., creating a user, student, etc.)
        
console.log('stu add ',  firstName, lastName, email, phone, batchId, advisorId );

        // ✅ Check if user already exists
        let user = await User.findOne({ email });
        console.log(user);
        console.log('19',user);
        if (!user) {
            console.log('21',user);
            // ✅ Create a new user if they don’t exist
            user = new User({
                firstName,
                lastName,
                email,
                phone,
                password: "123456",  // ✅ Default password (Plain Text)
                role: "Student",
                isActive: true
            });
            console.log('32',user);
            await user.save();
            console.log('34',user);
        }
        console.log('33',user);
        // ✅ Check if student already exists
        const existingStudent = await Student.findOne({ user: user._id });
        if (existingStudent) {
            return res.status(400).json({ message: "Student already exists for this user." });
        }

        // ✅ Find the last student ID and increment
        const lastStudent = await Student.findOne().sort({ studentId: -1 });
        const newStudentId = lastStudent ? lastStudent.studentId + 1 : 1001; // Start from 1001 if no students exist

        // ✅ Create new student
        const student = new Student({
            studentId: newStudentId,  // ✅ Auto-incremented studentId
            user: user._id,
            batch: batchId || null,
            advisor: advisorId || null,
            team: teamId || null,
            progress: [],
            attendance: { attendedDays: 0, missedDays: 0, totalDays: 0 }
        });
        console.log('61 ',student);
        

        await student.save();

        // ✅ Add student to batch if provided
        if (batchId) {
            await Batch.findByIdAndUpdate(batchId, { $push: { students: student._id } });
        }

        res.status(201).json({ message: "Student added successfully!", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ Get All Students
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
            .populate("user", "firstName lastName email")
            .populate("batch", "name")
            .populate("advisor", "firstName lastName")
            .populate("team", "name");

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ✅ Get Single Student by ID
const getStudentById = async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId)
            .populate("user", "firstName lastName email phone")
            .populate("batch", "name")
            .populate("advisor", "firstName lastName email")
            .populate("team", "name");

        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// ✅ Update Student Details
const updateStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { batchId, advisorId, teamId, socialLinks, address, bio } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // ✅ Update fields
        if (batchId) student.batch = batchId;
        if (advisorId) student.advisor = advisorId;
        if (teamId) student.team = teamId;
        if (socialLinks) student.socialLinks = { ...student.socialLinks, ...socialLinks };
        if (address) student.address = { ...student.address, ...address };
        if (bio) student.bio = bio;

        await student.save();
        res.status(200).json({ message: "Student updated successfully!", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ✅ Soft Delete a Student
const deleteStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // ✅ Soft delete by setting isActive to false
        student.isActive = false;
        await student.save();

        res.status(200).json({ message: "Student deactivated successfully!", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// ❗ Permanently Delete a Student (Hard Delete)
const permanentlyDeleteStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        const student = await Student.findByIdAndDelete(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        res.status(200).json({ message: "Student permanently deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const assignBatchToStudent = async (req, res) => {
    try {
        const { studentId, batchId } = req.body;
        const batch = await Batch.findById(batchId);
        const student = await Student.findById(studentId);

        if (!batch || !student) {
            return res.status(404).json({ message: "Batch or Student not found." });
        }

        student.batch = batchId;

        // ✅ Sync batch tasks with student progress
        student.progress = batch.tasks.map(task => ({
            taskName: task.name,
            type: task.type,
            status: "Pending",
            score: null,
        }));

        await student.save();
        await batch.updateOne({ $push: { students: student._id } });

        res.status(200).json({ message: "Batch assigned & tasks synced.", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const removeStudentFromBatch = async (req, res) => {
    try {
        const { studentId, batchId } = req.body;
        const student = await Student.findById(studentId);
        const batch = await Batch.findById(batchId);

        if (!batch || !student) {
            return res.status(404).json({ message: "Batch or Student not found." });
        }

        student.batch = null;
        student.progress = []; // Reset progress since they no longer belong to any batch
        await student.save();

        await batch.updateOne({ $pull: { students: studentId } });

        res.status(200).json({ message: "Student removed from batch.", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const markAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { attended } = req.body;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found." });

        student.attendance.totalDays += 1;
        attended ? student.attendance.attendedDays++ : student.attendance.missedDays++;

        await student.save();
        res.status(200).json({ message: "Attendance updated.", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const bulkUpdateAttendance = async (req, res) => {
    try {
        const { students } = req.body; // [{ studentId, attended }]

        for (let entry of students) {
            const student = await Student.findById(entry.studentId);
            if (!student) continue;

            student.attendance.totalDays += 1;
            entry.attended ? student.attendance.attendedDays++ : student.attendance.missedDays++;
            await student.save();
        }

        res.status(200).json({ message: "Attendance updated for students." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateTaskStatus = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { taskName, status, score } = req.body;

        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: "Student not found." });

        const taskIndex = student.progress.findIndex(task => task.taskName === taskName);
        if (taskIndex === -1) return res.status(404).json({ message: "Task not found." });

        student.progress[taskIndex].status = status;
        if (score !== undefined) student.progress[taskIndex].score = score;

        await student.save();
        res.status(200).json({ message: "Task updated successfully.", student });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const bulkUpdateTaskStatus = async (req, res) => {
    try {
        const { batchId, taskName, studentEmails } = req.body;

        const students = await Student.find({ batch: batchId }).populate("user");
        for (let student of students) {
            if (studentEmails.includes(student.user.email)) {
                const taskIndex = student.progress.findIndex(task => task.taskName === taskName);
                if (taskIndex !== -1) {
                    student.progress[taskIndex].status = "Done";
                    await student.save();
                }
            }
        }

        res.status(200).json({ message: "Task updated for selected students." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const calculateQualityPercentage = async (req, res) => {
    try {
        const students = await Student.find();

        for (let student of students) {
            let qualityPercentage = 0;

            if (student.attendance.totalDays > 0) {
                const attendancePercentage = (student.attendance.attendedDays / student.attendance.totalDays) * 100;
                const completedTasks = student.progress.filter(task => task.status === "Done").length;
                const totalTasks = student.progress.length;
                const taskCompletionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                qualityPercentage = (attendancePercentage * 0.5) + (taskCompletionPercentage * 0.5);
            }

            student.qualityPercentage = qualityPercentage;
            await student.save();
        }

        res.status(200).json({ message: "Quality percentages updated for all students." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTopStudents = async (req, res) => {
    try {
        const topStudents = await Student.find()
            .sort({ qualityPercentage: -1 })
            .limit(10)
            .populate("user", "firstName lastName email");

        res.status(200).json(topStudents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




// ✅ Upload and Process Excel File
const uploadStudentsFromExcel = async (req, res) => {
    try {
        const batchId = req.params.batchId;
        const batch = await Batch.findById(batchId);

        if (!batch) {
            return res.status(404).json({ message: "Batch not found." });
        }

        // ✅ Read Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const studentData = xlsx.utils.sheet_to_json(sheet);

        let addedStudents = [];
        let skippedStudents = [];

        // ✅ Find last studentId and increment for new students
        let lastStudent = await Student.findOne().sort({ studentId: -1 });
        let newStudentId = lastStudent ? lastStudent.studentId + 1 : 1001;

        for (const student of studentData) {
            const { firstName, lastName, email, phone } = student;  // ✅ No `studentId` in Excel

            let user = await User.findOne({ email });

            if (!user) {
                // ✅ Create new User
                user = new User({
                    firstName,
                    lastName,
                    email,
                    phone,
                    password: "123456",
                    role: "Student",
                    isActive: true
                });
                await user.save();
            }

            let studentEntry = await Student.findOne({ user: user._id });

            if (!studentEntry) {
                studentEntry = new Student({
                    studentId: newStudentId,  // ✅ Auto-incremented studentId
                    user: user._id,
                    batch: batchId,
                    progress: batch.tasks.map(task => ({
                        taskName: task.name,
                        type: task.type,
                        status: "Pending",
                        score: null
                    })),
                    attendance: { attendedDays: 0, missedDays: 0, totalDays: 0 }
                });

                await studentEntry.save();
                batch.students.push(studentEntry._id);
                await batch.save();

                addedStudents.push(user.email);
                newStudentId++;  // ✅ Increment for next student
            } else {
                skippedStudents.push(user.email);
            }
        }

        // ✅ Remove uploaded file after processing
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: "Batch student upload complete.",
            addedCount: addedStudents.length,
            skippedCount: skippedStudents.length,
            addedStudents,
            skippedStudents
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
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
    uploadStudentsFromExcel,
    getTopStudents,
    calculateQualityPercentage    
};
