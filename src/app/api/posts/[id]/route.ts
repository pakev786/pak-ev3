import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMongoClient } from '@/lib/mongodb';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await getMongoClient();
    const db = client.db('pakev');
    const collection = db.collection('posts');
    
    const post = await collection.findOne({ _id: new ObjectId(params.id) });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch post' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const client = await getMongoClient();
    const db = client.db('pakev');
    const collection = db.collection('posts');
    
    const result = await collection.updateOne(
      { _id: new ObjectId(params.id) },
      { 
        $set: {
          ...body,
          featured: typeof body.featured === 'boolean' ? body.featured : false,
          pinned: typeof body.pinned === 'boolean' ? body.pinned : false,
          highlight: typeof body.highlight === 'boolean' ? body.highlight : false,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await getMongoClient();
    const db = client.db('pakev');
    const posts = db.collection('posts');

    // Convert string ID to ObjectId
    let objectId;
    try {
      objectId = new ObjectId(params.id);
    } catch (e) {
      return NextResponse.json({ message: 'Invalid post ID' }, { status: 400 });
    }

    // Delete the post
    const result = await posts.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ 
      message: 'Server error while deleting post' 
    }, { status: 500 });
  }
}
