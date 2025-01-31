const { Course } = require('../../models/courseModel');
const Batch = require('../../models/batchModel');
const Semester = require('../../models/semesterModel');
const User = require('../../models/userModel');
const { Week } = require('../../models/courseModel');
const mongoose = require('mongoose');
// Create a new course
// Create a new course
const createCourse = async (req, res) => {
  try {
    const { name, description } = req.body; // Only name and description are required

    const newCourse = new Course({
      name,
      description,
    });

    // Save the course to the database
    const savedCourse = await newCourse.save();

    res.status(201).json(savedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get all courses (optionally filter by semester or batch)
const getAllCourses = async (req, res) => {
  try {
    const { semesterId, batchId } = req.query;

    let filter = {};
    if (semesterId) {
      filter.semester = semesterId;
    }
    if (batchId) {
      filter.batch = batchId;
    }

    const courses = await Course.find(filter)
      .populate('semester', 'semesterName')
      .populate('batch', 'name')
      .populate('instructor', 'firstName lastName');

    res.status(200).json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Import mongoose for ObjectId validation

// // Get a specific course by ID
// const getCourseById = async (req, res) => {
//   const { id } = req.params;
//   console.log("hello world",req.params);
//   try {
//     // Validate the ObjectId before querying
//     // if (!mongoose.Types.ObjectId.isValid(id)) {
//     //   return res.status(400).json({ message: 'Invalid course ID' });
//     // }

//     // Find the course and populate related fields
//     const course = await Course.findById(id)
//     console.log(course);

//       // .populate('semester', 'semesterName')
//       // .populate('batch', 'name')
//       // .populate('instructor', 'firstName lastName');

//     if (!course) {
//       return res.status(404).json({ message: 'Course not found' });
//     }

//     res.status(200).json({ message: 'Course retrieved successfully', course });
//   } catch (error) {
//     console.error('Error fetching course:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, description, semester, courseCode, instructor } = req.body;

    // Find and validate the semester from the Semester model
    const semesterData = await Semester.findById(semester);
    if (!semesterData) {
      return res.status(400).json({ message: 'Invalid semester ID' });
    }

    // Find and update the course without modifying the weeks field
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        name,
        description,
        semester: semesterData._id, // Store the semester as a reference (ObjectId)
        courseCode,
        instructor,  // Simple string for instructor
      },
      { new: true }
    )
      .populate('semester', 'semesterName')  // Populate semester field to show the full details
      .populate('batch', 'name');  // Populate batch details if needed

    if (!updatedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Delete a course
const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(courseId);

    if (!deletedCourse) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Optionally, remove course from related semester and batch
    await Semester.findByIdAndUpdate(deletedCourse.semester, {
      $pull: { courses: courseId },
    });

    if (deletedCourse.batch) {
      await Batch.findByIdAndUpdate(deletedCourse.batch, {
        $pull: { courses: courseId },
      });
    }

    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getCourseById = async (req, res) => {
  const { courseId } = req.params; // Use courseId from the params

  try {
    console.log('Course ID:', courseId); // Debugging the passed ID

    // Check if the courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Find the course using the valid ID
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json({ message: 'Course retrieved successfully', course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
};





// Add an exam to a module
const addExamToModule = async (req, res) => {
  try {
    const { weekId, moduleId } = req.params;
    const { examTitle, examType, examDate, duration, weight } = req.body;

    const week = await Week.findById(weekId);
    const module = week.modules.id(moduleId);

    module.exams.push({ examTitle, examType, examDate, duration, weight });
    await week.save();

    res.status(201).json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding exam' });
  }
};

// Remove an exam from a module
const removeExamFromModule = async (req, res) => {
  try {
    const { weekId, moduleId, examId } = req.params;

    const week = await Week.findById(weekId);
    const module = week.modules.id(moduleId);
    const exam = module.exams.id(examId);

    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    exam.remove();
    await week.save();

    res.status(200).json({ message: 'Exam removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing exam' });
  }
};




// Add an assignment to a module
const addAssignmentToModule = async (req, res) => {
  try {
    const { weekId, moduleId } = req.params;
    const { assignmentTitle, dueDate, description } = req.body;

    const week = await Week.findById(weekId);
    const module = week.modules.id(moduleId);

    module.assignments.push({ assignmentTitle, dueDate, description });
    await week.save();

    res.status(201).json(module);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding assignment' });
  }
};

// Remove an assignment from a module
const removeAssignmentFromModule = async (req, res) => {
  try {
    const { weekId, moduleId, assignmentId } = req.params;

    const week = await Week.findById(weekId);
    const module = week.modules.id(moduleId);
    const assignment = module.assignments.id(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    assignment.remove();
    await week.save();

    res.status(200).json({ message: 'Assignment removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing assignment' });
  }
};






// Add a module to a week
const addModuleToWeek = async (req, res) => {
  try {
    const { weekId } = req.params;
    const { moduleName, moduleContent, assignments, exams } = req.body;

    const newModule = { moduleName, moduleContent, assignments, exams };

    const week = await Week.findById(weekId);
    week.modules.push(newModule);
    await week.save();

    res.status(201).json(newModule);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding module' });
  }
};

// Remove a module from a week
const removeModuleFromWeek = async (req, res) => {
  try {
    const { weekId, moduleId } = req.params;

    const week = await Week.findById(weekId);
    const module = week.modules.id(moduleId);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    module.remove();
    await week.save();

    res.status(200).json({ message: 'Module removed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error removing module' });
  }
};






// Create a new week
const createWeek = async (req, res) => {
  try {
    const { weekNumber, startDate, endDate, modules } = req.body;

    const newWeek = new Week({ weekNumber, startDate, endDate, modules });
    await newWeek.save();
    res.status(201).json(newWeek);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating week' });
  }
};

// Update an existing week
const updateWeek = async (req, res) => {
  try {
    const { weekId } = req.params;
    const { weekNumber, startDate, endDate, modules } = req.body;

    const updatedWeek = await Week.findByIdAndUpdate(weekId, { weekNumber, startDate, endDate, modules }, { new: true });

    if (!updatedWeek) {
      return res.status(404).json({ message: 'Week not found' });
    }

    res.status(200).json(updatedWeek);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating week' });
  }
};

// Delete a week
const deleteWeek = async (req, res) => {
  try {
    const { weekId } = req.params;

    const deletedWeek = await Week.findByIdAndDelete(weekId);

    if (!deletedWeek) {
      return res.status(404).json({ message: 'Week not found' });
    }

    res.status(200).json({ message: 'Week deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting week' });
  }
};




// Add a week to a course
const addWeekToCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { weekNumber, startDate, endDate, modules } = req.body;

    const newWeek = new Week({ weekNumber, startDate, endDate, modules });
    await newWeek.save();

    const course = await Course.findById(courseId);
    course.weeks.push(newWeek._id);
    await course.save();

    res.status(201).json(newWeek);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding week to course' });
  }
};






module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  removeExamFromModule,
  addExamToModule,
  addAssignmentToModule,
  removeAssignmentFromModule,
  addModuleToWeek,
  removeModuleFromWeek,
  createWeek,
  updateWeek,
  deleteWeek,
  addWeekToCourse
};





// const { Week } = require('../models/courseModel');
