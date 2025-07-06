import type { NextApiRequest, NextApiResponse } from 'next';
import { getMongoClient } from '@/lib/mongodb';

type ContactData = {
  email: string;
  phone: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await getMongoClient();
  const db = client.db('pakev');
  const collection = db.collection('contact');

  if (req.method === 'GET') {
    try {
      const doc = await collection.findOne({ _id: 'main' });
      if (doc) {
        res.status(200).json(doc);
      } else {
        // Default fallback
        res.status(200).json({ email: 'info@pakev.com', phone: '+92 300 1234567' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch contact info', details: error instanceof Error ? error.message : error });
    }
  } else if (req.method === 'POST') {
    const { email, phone, facebook, youtube, instagram } = req.body;
    if (typeof email !== 'string' || typeof phone !== 'string') {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }
    const dataToSave: ContactData = { email, phone };
    if (facebook) dataToSave.facebook = facebook;
    if (youtube) dataToSave.youtube = youtube;
    if (instagram) dataToSave.instagram = instagram;
    try {
      await collection.updateOne(
        { _id: 'main' },
        { $set: dataToSave },
        { upsert: true }
      );
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to save', details: error instanceof Error ? error.message : error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}