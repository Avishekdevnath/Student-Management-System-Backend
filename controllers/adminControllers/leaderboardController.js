const Leaderboard = require('../../models/leaderboardModel');
const Student = require('../../models/studentModel');

// Update Leaderboard Entry for a Student

// Example updateLeaderboard function
exports.updateLeaderboard = async (req, res) => {
    try {
        const { studentId, teamId, courseId, problemSolvingScore, attendanceScore } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const totalScore = problemSolvingScore + attendanceScore;

        let leaderboardEntry = await Leaderboard.findOne({ student: studentId, course: courseId });
        if (leaderboardEntry) {
            leaderboardEntry.problemSolvingScore = problemSolvingScore;
            leaderboardEntry.attendanceScore = attendanceScore;
            leaderboardEntry.totalScore = totalScore;
        } else {
            leaderboardEntry = new Leaderboard({
                student: studentId,
                team: teamId,
                course: courseId,
                problemSolvingScore,
                attendanceScore,
                totalScore,
                ranking: 0,
            });
        }

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
