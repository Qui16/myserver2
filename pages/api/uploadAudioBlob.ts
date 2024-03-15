import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer';
import stream from 'stream';
import uploadBlob from '../../uploadBlob';

// Extend the NextApiRequest type to include the file property
interface MulterRequest extends NextApiRequest {
    file: Express.Multer.File;
}

// Initialize multer
const upload = multer();

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async (req: MulterRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        const multerAny: any = multer();
        multerAny.single('file')(req, res, async (err: any) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            // The file is now in req.file
            const buffer: Buffer = req.file.buffer;

            // Create a readable stream from the Buffer
            const readableStream = new stream.PassThrough();
            readableStream.end(buffer);

            try {
                console.log('read', readableStream);
                await uploadBlob(readableStream);
                res.status(200).send('File uploaded to Azure Blob Storage.');
            } catch (err: any) {
                console.error(`Error: ${err.message}`);
                res.status(500).send(err.message);
            }
        });

    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}