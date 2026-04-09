import multer from 'multer';

// We use memoryStorage because we want to keep the file in RAM temporarily.
// We DO NOT want to save it to our server's hard drive, because we are 
// going to immediately send it straight up to Azure!
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // Optional: limit file size to 50MB to prevent server crashes
});

export default upload;