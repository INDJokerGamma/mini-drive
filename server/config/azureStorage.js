import { BlobServiceClient } from '@azure/storage-blob';
import dotenv from 'dotenv';

// Load our hidden connection string from the .env file
dotenv.config();

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
    console.error("⚠️ Azure Storage Connection string is missing in .env file!");
}

// Create the client that will talk to Azure
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

export default blobServiceClient;