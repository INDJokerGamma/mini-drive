import { db } from '../config/firebase.js';
import blobServiceClient from '../config/azureStorage.js';
import { BlobSASPermissions } from '@azure/storage-blob';
import { v4 as uuidv4 } from 'uuid';

export const uploadFile = async (req, res) => {
    try {
        // 1. Check if a file was actually sent
        if (!req.file) {
            return res.status(400).json({ message: "Please provide a file to upload." });
        }

        // 2. Connect to our specific Azure Container ('file-uploads')
        const containerClient = blobServiceClient.getContainerClient('file-uploads');

        // 3. Create a unique name for the file using UUID (e.g., "1234-abcd-resume.pdf")
        const uniqueBlobName = `${uuidv4()}-${req.file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(uniqueBlobName);

        // 4. Upload the file data (from RAM) straight to Azure!
        // 4. Upload the file data AND tell Azure what type of file it is
        await blockBlobClient.uploadData(req.file.buffer, {
            blobHTTPHeaders: {
                blobContentType: req.file.mimetype
            }
        });

        // 5. Get the public URL of where the file now lives in Azure
        const fileUrl = blockBlobClient.url;

        // 6. Create the metadata "receipt" for our Firestore database
        const fileMetadata = {
            name: req.file.originalname,
            url: fileUrl,
            size: req.file.size,
            type: req.file.mimetype,
            uploadedAt: new Date().toISOString(),
            userId: req.body.userId
            // We will add the specific User ID later when we connect Authentication!
        };

        // 7. Save the receipt to a 'files' collection in Firestore
        await db.collection('files').add(fileMetadata);

        // 8. Tell the frontend everything worked perfectly
        res.status(201).json({
            message: "File uploaded successfully!",
            file: fileMetadata
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: "Server error during upload." });
    }
};

// Get all files for a specific user
export const getUserFiles = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Ask Firestore for all documents where the 'userId' matches the logged-in user
        const filesSnapshot = await db.collection('files')
            .where('userId', '==', userId)
            .get();

        // Format the data into a nice array for our frontend
        const files = [];
        filesSnapshot.forEach((doc) => {
            files.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(files);
    } catch (error) {
        console.error("Fetch Files Error:", error);
        res.status(500).json({ message: "Server error while fetching files." });
    }
};

// Generate a temporary secure link to view a private file
export const getDownloadUrl = async (req, res) => {
    try {
        const { fileUrl } = req.body;

        // Extract the exact filename from the end of the URL
        const urlParts = fileUrl.split('/');
        // We decode it just in case the filename had spaces in it
        const blobName = decodeURIComponent(urlParts[urlParts.length - 1]);

        const containerClient = blobServiceClient.getContainerClient('file-uploads');
        const blobClient = containerClient.getBlobClient(blobName);

        // Generate a temporary 1-hour access token!
        const sasUrl = await blobClient.generateSasUrl({
            permissions: BlobSASPermissions.parse("r"), // "r" means Read-only permission
            expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // Expires in 1 hour
        });

        res.status(200).json({ url: sasUrl });
    } catch (error) {
        console.error("SAS Error:", error);
        res.status(500).json({ message: "Failed to generate secure link." });
    }
};

// Delete a file from Azure AND Firestore
export const deleteFile = async (req, res) => {
    try {
        // We get the unique Firestore ID of the file from the URL
        const { fileId } = req.params;

        // 1. Find the file in Firestore so we know its Azure URL
        const fileRef = db.collection('files').doc(fileId);
        const doc = await fileRef.get();

        if (!doc.exists) {
            return res.status(404).json({ message: "File not found in database." });
        }

        const fileData = doc.data();

        // 2. Extract the exact filename from the Azure URL
        const urlParts = fileData.url.split('/');
        const blobName = decodeURIComponent(urlParts[urlParts.length - 1]);

        // 3. Connect to Azure and command it to delete the file permanently
        const containerClient = blobServiceClient.getContainerClient('file-uploads');
        const blobClient = containerClient.getBlobClient(blobName);
        await blobClient.deleteIfExists(); // This is the magic Azure delete command!

        // 4. Delete the receipt from Firestore
        await fileRef.delete();

        res.status(200).json({ message: "File completely deleted!" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Server error while deleting file." });
    }
};