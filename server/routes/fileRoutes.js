import express from 'express';
import upload from '../middleware/upload.js';
// You probably have both of these lines right now:
import { uploadFile, getUserFiles, getDownloadUrl, deleteFile } from '../controllers/fileController.js';

const router = express.Router();

// This creates a POST route at the path we specify later
// When a request comes in:
// 1st: It hits `upload.single('file')` (Our mailroom clerk grabs the file)
// 2nd: It goes to `uploadFile` (Our brain uploads it to Azure & Firebase)
router.post('/upload', upload.single('file'), uploadFile);

// When a request comes in with a User ID, go fetch their files
router.get('/:userId', getUserFiles);

// Route to generate a secure viewing link
router.post('/download', getDownloadUrl);

// Route to delete a specific file
router.delete('/:fileId', deleteFile);
export default router;