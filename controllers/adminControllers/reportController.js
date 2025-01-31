//controllers\adminControllers\reportController.js
const fs = require('fs');
const path = require('path');
const User = require('../../models/userModel');
const Batch = require('../../models/batchModel');
const Mission = require('../../models/missionModel');
const Assignment = require('../../models/assignmentModel');
const Notification = require('../../models/notificationModel');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const { jsPDF } = require('jspdf');

// Helper function to handle file download and cleanup
const handleFileDownload = (res, filePath, fileName) => {
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error(`Error downloading file: ${err.message}`);
      res.status(500).json({ message: 'Error downloading file' });
    }
    // Clean up the file after download
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err.message}`);
      }
    });
  });
};

// Generate CSV Report for Users
exports.generateUserCSVReport = async (req, res) => {
  try {
    const users = await User.find().lean();
    
    // Define the CSV file path
    const filePath = path.join(__dirname, '../../reports/user_report.csv');

    const csv = csvWriter({
      path: filePath,
      header: [
        { id: 'username', title: 'Username' },
        { id: 'email', title: 'Email' },
        { id: 'role', title: 'Role' },
        { id: 'isActive', title: 'Active' },
        { id: 'createdAt', title: 'Created At' },
      ]
    });

    await csv.writeRecords(users); // Write data to CSV
    handleFileDownload(res, filePath, 'user_report.csv');
  } catch (err) {
    console.error(`Error generating user report: ${err.message}`);
    res.status(500).json({ message: 'Error generating user report' });
  }
};

// Generate PDF Report for Batches
exports.generateBatchPDFReport = async (req, res) => {
  try {
    const batches = await Batch.find().lean();
    const doc = new jsPDF();
    
    // Set title for the PDF
    doc.setFontSize(18);
    doc.text('Batch Report', 14, 22);

    // Set headers for batch data
    doc.setFontSize(12);
    let y = 30;
    doc.text('Batch Name', 14, y);
    doc.text('Batch Type', 80, y);
    doc.text('Created At', 140, y);

    // Add batch data
    batches.forEach((batch) => {
      y += 10;
      doc.text(batch.name, 14, y);
      doc.text(batch.type, 80, y);
      doc.text(new Date(batch.createdAt).toLocaleString(), 140, y);
    });

    // Save PDF to file system
    const filePath = path.join(__dirname, '../../reports/batch_report.pdf');
    doc.save(filePath);

    // Send the PDF file as response
    handleFileDownload(res, filePath, 'batch_report.pdf');
  } catch (err) {
    console.error(`Error generating batch report: ${err.message}`);
    res.status(500).json({ message: 'Error generating batch report' });
  }
};

// Generate a Report of Missions
exports.generateMissionReport = async (req, res) => {
  try {
    const missions = await Mission.find().lean();
    
    // Define the CSV file path for missions
    const filePath = path.join(__dirname, '../../reports/mission_report.csv');

    const csv = csvWriter({
      path: filePath,
      header: [
        { id: 'name', title: 'Mission Name' },
        { id: 'objective', title: 'Objective' },
        { id: 'status', title: 'Status' },
        { id: 'createdAt', title: 'Created At' },
      ]
    });

    await csv.writeRecords(missions); // Write mission data to CSV
    handleFileDownload(res, filePath, 'mission_report.csv');
  } catch (err) {
    console.error(`Error generating mission report: ${err.message}`);
    res.status(500).json({ message: 'Error generating mission report' });
  }
};

// Generate a Report of Assignments
exports.generateAssignmentReport = async (req, res) => {
  try {
    const assignments = await Assignment.find().lean();
    
    // Define the CSV file path for assignments
    const filePath = path.join(__dirname, '../../reports/assignment_report.csv');

    const csv = csvWriter({
      path: filePath,
      header: [
        { id: 'batch', title: 'Batch' },
        { id: 'course', title: 'Course' },
        { id: 'module', title: 'Module' },
        { id: 'week', title: 'Week' },
        { id: 'questions', title: 'Questions' },
        { id: 'totalMarks', title: 'Total Marks' },
        { id: 'createdAt', title: 'Created At' },
      ]
    });

    await csv.writeRecords(assignments); // Write assignment data to CSV
    handleFileDownload(res, filePath, 'assignment_report.csv');
  } catch (err) {
    console.error(`Error generating assignment report: ${err.message}`);
    res.status(500).json({ message: 'Error generating assignment report' });
  }
};


// Generate a Report of Notifications
exports.generateNotificationReport = async (req, res) => {
  try {
    const notifications = await Notification.find().lean();
    
    // Define the CSV file path for notifications
    const filePath = path.join(__dirname, '../../reports/notification_report.csv');

    const csv = csvWriter({
      path: filePath,
      header: [
        { id: 'title', title: 'Title' },
        { id: 'message', title: 'Message' },
        { id: 'status', title: 'Status' },
        { id: 'createdAt', title: 'Created At' },
      ]
    });

    await csv.writeRecords(notifications); // Write notification data to CSV
    handleFileDownload(res, filePath, 'notification_report.csv');
  } catch (err) {
    console.error(`Error generating notification report: ${err.message}`);
    res.status(500).json({ message: 'Error generating notification report' });
  }
};
