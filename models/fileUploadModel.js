//models\fileUploadModel.js
const mongoose = require('mongoose');

const fileUploadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the user uploading the file
      required: true,
    },
    filename: {
      type: String, // Original name of the file
      required: true,
    },
    fileType: {
      type: String, // Type of the file (e.g., "image", "pdf")
    },
    filePath: {
      type: String, // Path where the file is stored
      required: true,
    },
    fileSize: {
      type: Number, // Size of the file in bytes
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now, // Date when the file was uploaded
    },
    relatedEntity: {
      type: String, // Name of the entity this file is associated with (e.g., "ProfilePicture", "Submission")
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId, // ID of the related entity
    },
  },
  { timestamps: true }
);

const FileUpload = mongoose.model('FileUpload', fileUploadSchema);

module.exports = FileUpload;
