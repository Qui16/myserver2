import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer';
import { BlobServiceClient } from '@azure/storage-blob';
import stream from 'stream';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=audioconversationstorage;AccountKey=ZMI/hWvqIfGx4eU5+pC0nMogJd+flZ36fS67ab6SREPoDVCvTN8rgrEj1HGqtQWchs9hRS/QCOCH+AStICh4mA==;EndpointSuffix=core.windows.net'

        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        try {
            const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
            const containerName = 'audiofiles';
            const containerClient = blobServiceClient.getContainerClient(containerName);
            const blobName = 'user_audio_test.wav';
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            const readableStream = new stream.PassThrough();
            readableStream.end(buffer);

            await blockBlobClient.uploadStream(readableStream);

            res.status(200).send('File uploaded to Azure Blob Storage.');
        } catch (err: any) {
            console.error(`Error: ${err.message}`);
            res.status(500).send(err.message);
        }
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}