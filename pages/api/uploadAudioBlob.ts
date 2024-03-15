import type { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer';
import stream from 'stream';
import uploadBlob from '../../uploadBlob';


export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }

        const buffer = Buffer.concat(chunks);

        try {
            const readableStream = new stream.PassThrough();
            readableStream.end(buffer);
            await uploadBlob(readableStream);
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