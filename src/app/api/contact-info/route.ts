import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/data/contact.json');
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({ email: 'info@pakev.com', phone: '+92 300 1234567' }, { status: 200 });
  }
}
