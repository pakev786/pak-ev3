import { NextResponse } from 'next/server';
import { getMongoClient } from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await getMongoClient();
    const db = client.db('pakev');
    const branches = await db.collection('branches').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, data: branches });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch branches', details: error instanceof Error ? error.message : error });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.address) {
      return NextResponse.json({ error: 'Name and address are required.' }, { status: 400 });
    }
    const client = await getMongoClient();
    const db = client.db('pakev');
    const result = await db.collection('branches').insertOne({
      name: body.name,
      address: body.address,
      phone: body.phone || '',
      city: body.city || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add branch', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}
