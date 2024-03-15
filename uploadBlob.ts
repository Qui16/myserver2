const { BlobServiceClient } = require("@azure/storage-blob");
import { Readable } from 'stream';
require('dotenv').config();

const uploadBlob = async (readableStream: Readable) => {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
        throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set');
    }
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerName = 'audiofiles';
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobName = 'user_audio_test.wav';
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadStream(readableStream);

}
export default uploadBlob;














