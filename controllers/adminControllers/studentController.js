const Student = require('../../models/studentModel');
const User = require('../../models/userModel');
const Leaderboard = require('../../models/leaderboardModel');
// const Student = require('../../models/studentModel');
const generateStudentId = async () => {
  const currentYear = new Date().getFullYear(); // Get the current year
  const yearPrefix = currentYear.toString().slice(-2); // Get last 2 digits of the year (e.g., 2023 -> "23")

  // Generate a sequential number for the student ID (e.g., "230001", "230002", ...)
  const lastStudent = await Student.findOne({ studentId: { $regex: `^${yearPrefix}` } }).sort({ studentId: -1 }); // Find last student with the current year's prefix

  let uniqueNumber = 1; // Default starting value
  if (lastStudent) {
    // Increment the last student's ID number
    uniqueNumber = parseInt(lastStudent.studentId.slice(2)) + 1;
  }

  // Format student ID (e.g., "230001", "230002", ...)
  return `${yearPrefix}${String(uniqueNumber).padStart(4, '0')}`;
};

exports.createStudent = async (req, res) => {
  try {
    const { username, email, phone, password, discordId, advisor, team, batch, socialLinks, address, bio } = req.body;

    // Check if required fields are provided
    if (!username || !email || !phone || !password) {
      return res.status(400).json({ message: 'Username, email, phone, and password are required.' });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create a new user with the Student role
    const newUser = new User({
      username,
      email,
      phone,
      password, // Store password in plaintext for now (you can hash it later)
      role: 'Student',
      discordId: discordId || '', // Set to empty string if not provided
    });

    // Save the user document
    await newUser.save();

    // Generate unique student ID based on current year
    const studentId = await generateStudentId();

    // Prepare the new student data
    const newStudentData = {
      studentId,
      name: username,  // Use username as the student's name (or get from req.body if needed)
      email,
      phone,
      discordId: discordId || '',  // Set to empty string if not provided
      socialLinks: socialLinks || [],  // Default to empty array if not provided
      address: address || '',  // Set to empty string if not provided
      bio: bio || '',  // Set to empty string if not provided
      advisor: advisor || null,  // Set to null if not provided
      team: team || null,  // Set to null if not provided
      batch: batch || null,  // Set to null if not provided
      user: newUser._id,  // Link the user to the student
    };

    // Create the new student instance
    const newStudent = new Student(newStudentData);

    // Save the student document
    await newStudent.save();

    // Return success response
    res.status(201).json({
      message: 'Student created successfully',
      student: newStudent,
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating student' });
  }
};


// Get All Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching students' });
  }
};




// Search for students based on a query
exports.searchStudents = async (req, res) => {
  const query = req.query.query || '';

  try {
    // Search students in the database based on query
    const students = await Student.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { discordId: { $regex: query, $options: 'i' } },
      ]
    });

    res.json({ students });
  } catch (err) {
    console.error('Error searching students:', err);
    res.status(500).send('Error searching students');
  }
};




// Fetch a student's profile by their ID
exports.getStudentProfile = async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).send('Student not found');
    }
    res.json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching student profile');
  }
};




// Get Student by ID


exports.getStudentById = async (req, res) => {
  try {
    // Searching by studentId field, not the MongoDB _id
    const student = await Student.findOne({ _id: req.params.studentId })
      // .populate('advisor team batch leader'); // Populating related fields

    if (!student) {
      return res.status(404).json({ message: req.params.studentId });
    }

    // Returning the student data directly
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student' });
  }
};

// Edit Student
exports.editStudent = async (req, res) => {
  try {
    const { name, email, phone, discordId, advisor, team, batch, socialLinks, address, bio } = req.body;

    // Prepare update data
    const updatedData = {
      name,
      email,
      phone,
      discordId,
      advisor,
      team,
      batch,
      socialLinks,
      address,
      bio,
    };

    const student = await Student.findByIdAndUpdate(req.params.studentId, updatedData, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student updated successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating student' });
  }
};

// Delete Student (soft delete)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.studentId, { isActive: false }, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deactivated successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deactivating student' });
  }
};

// Assign Leader to a Student
exports.assignLeader = async (req, res) => {
  try {
    const { studentId, leaderId } = req.body;

    // Validate if the provided leaderId is actually a Leader
    const leader = await User.findById(leaderId);
    if (!leader || leader.role !== 'Leader') {
      return res.status(400).json({ message: 'Invalid leader ID. The user is not a Leader.' });
    }

    // Assign the leader to the student
    const student = await Student.findByIdAndUpdate(studentId, { leader: leaderId }, { new: true });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Leader assigned successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error assigning leader' });
  }
};

// Get All Students by Leader
exports.getStudentsByLeader = async (req, res) => {
  try {
    const leaderId = req.params.leaderId;

    // Find students who have the given leader
    const students = await Student.find({ leader: leaderId }).populate('leader');
    
    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found for this leader' });
    }

    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching students by leader' });
  }
};

// Update Student Progress
exports.updateProgress = async (req, res) => {
  try {
    const { studentId, courseId, moduleId, week } = req.body;

    // Find the student and update their course progress
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const courseProgress = student.progress.courses.find(course => course.courseId.toString() === courseId);
    if (courseProgress) {
      // Add the module if not already completed
      const moduleProgress = courseProgress.completedModules.find(module => module.moduleId === moduleId);
      if (!moduleProgress) {
        courseProgress.completedModules.push({ moduleId, completedAt: Date.now() });
      }
    } else {
      // Add a new course progress if not already present
      student.progress.courses.push({
        courseId,
        completedModules: [{ moduleId, completedAt: Date.now() }],
        week,
      });
    }

    await student.save();
    res.json({ message: 'Progress updated successfully', student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating student progress' });
  }
};





// additional



// Update Leaderboard Entry for a Student
exports.updateLeaderboard = async (req, res) => {
    try {
      const { studentId, teamId, courseId, problemSolvingScore, attendanceScore } = req.body;
  
      // Find the student and validate
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      // Calculate total score
      const totalScore = problemSolvingScore + attendanceScore;
  
      // Check if leaderboard entry exists
      let leaderboardEntry = await Leaderboard.findOne({ student: studentId, course: courseId });
      if (leaderboardEntry) {
        // Update existing entry
        leaderboardEntry.problemSolvingScore = problemSolvingScore;
        leaderboardEntry.attendanceScore = attendanceScore;
        leaderboardEntry.totalScore = totalScore;
      } else {
        // Create new entry
        leaderboardEntry = new Leaderboard({
          student: studentId,
          team: teamId,
          course: courseId,
          problemSolvingScore,
          attendanceScore,
          totalScore,
          ranking: 0,  // Placeholder, will be calculated later
        });
      }
  
      // Save or update leaderboard entry
      await leaderboardEntry.save();
  
      res.json({ message: 'Leaderboard updated successfully', leaderboardEntry });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error updating leaderboard' });
    }
  };
  


  exports.calculateRankings = async (req, res) => {
    try {
      const { courseId } = req.query;
  
      // Fetch leaderboard entries for the given course
      const leaderboardEntries = await Leaderboard.find({ course: courseId }).sort({ totalScore: -1 });
  
      // Update rankings based on sorted totalScore
      for (let i = 0; i < leaderboardEntries.length; i++) {
        leaderboardEntries[i].ranking = i + 1; // Ranking starts from 1
        await leaderboardEntries[i].save();
      }
  
      res.json({ message: 'Rankings updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error calculating rankings' });
    }
  };
  

  exports.getCourseLeaderboard = async (req, res) => {
    try {
      const { courseId } = req.params;
  
      // Fetch leaderboard entries for a specific course
      const leaderboardEntries = await Leaderboard.find({ course: courseId })
        .populate('student team course')
        .sort({ ranking: 1 }); // Sort by ranking (ascending)
  
      res.json({ leaderboard: leaderboardEntries });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching leaderboard' });
    }
  };
  