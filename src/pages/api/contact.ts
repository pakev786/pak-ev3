import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/data/contact.json');

type ContactData = {
  email: string;
  phone: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(filePath, 'utf-8');
      res.status(200).json(JSON.parse(data));
    } catch {
      res.status(200).json({ email: 'info@pakev.com', phone: '+92 300 1234567' });
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
      fs.writeFileSync(filePath, JSON.stringify(dataToSave, null, 2), 'utf-8');
      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to save' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}