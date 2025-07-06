import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMongoClient } from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await getMongoClient();
    const db = client.db('pakev');
    const branch = await db.collection('branches').findOne({ _id: new ObjectId(params.id) });
    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }
    return NextResponse.json(branch);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch branch', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const client = await getMongoClient();
    const db = client.db('pakev');
    const result = await db.collection('branches').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date().toISOString() } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update branch', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await getMongoClient();
    const db = client.db('pakev');
    const result = await db.collection('branches').deleteOne({ _id: new ObjectId(params.id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete branch', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
}
