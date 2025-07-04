import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('branches');
    
    const branches = await collection.find({}).toArray();
    
    // Map _id to id for frontend compatibility
    const branchesWithId = branches.map(branch => {
      const { _id, ...rest } = branch;
      return { ...rest, id: _id.toString() };
    });

    return NextResponse.json({ success: true, data: branchesWithId });
  } catch (error: any) {
    console.error('Error in GET /api/branches:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('branches');
    
    const result = await collection.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return NextResponse.json({ success: true, data: { id: result.insertedId.toString() } });
  } catch (error: any) {
    console.error('Error in POST /api/branches:', error); // Added backend logging
    return NextResponse.json({ success: false, error: error.message || 'Failed to create branch' }, { status: 500 });
  }
}
