import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMongoClient } from '../../lib/mongodb';

export async function GET(request: Request) {
  try {
    console.log('GET /api/posts - Fetching posts');
    const client = await getMongoClient();
    const db = client.db('pakev');
    const collection = db.collection('posts');

    // Get the category from query params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    console.log('Category filter:', category || 'none');

    // Build the query
    const query = category ? { category } : {};

    const posts = await collection.find(query).sort({ createdAt: -1 }).toArray();
    console.log(`Found ${posts.length} posts`);

    return NextResponse.json({
      success: true,
      data: posts,
      message: `Successfully fetched ${posts.length} posts`
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch posts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received POST request to /api/posts');
    const body = await request.json();
    console.log('Request body:', body);

    // Validate required fields
    if (!body.title || !body.category || !body.description) {
      console.error('Validation failed:', { title: !!body.title, category: !!body.category, description: !!body.description });
      return NextResponse.json(
        { error: 'Missing required fields: title, category, and description are required' },
        { status: 400 }
      );
    }
    // Handle featured, pinned, highlight fields (optional, default false)
    const featured = typeof body.featured === 'boolean' ? body.featured : false;
    const pinned = typeof body.pinned === 'boolean' ? body.pinned : false;
    const highlight = typeof body.highlight === 'boolean' ? body.highlight : false;

    // Validate images
    if (!body.titleImage) {
      return NextResponse.json({ error: 'Title image is required.' }, { status: 400 });
    }
    if (!Array.isArray(body.galleryImages) || body.galleryImages.length < 1 || body.galleryImages.length > 20) {
      return NextResponse.json({ error: 'Gallery images must be 1 to 20 images.' }, { status: 400 });
    }

    console.log('Connecting to MongoDB...');
    const client = await getMongoClient();
    console.log('Connected to MongoDB successfully');

    const db = client.db('pakev');
    console.log('Database selected successfully');

    const collection = db.collection('posts');
    
    const result = await collection.insertOne({
      title: body.title,
      category: body.category,
      description: body.description,
      price: body.price || '',
      titleImage: body.titleImage,
      galleryImages: body.galleryImages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      featured,
      pinned,
      highlight
    });

    console.log('Insert result:', result);

    if (!result?.acknowledged) {
      console.error('Insert not acknowledged by MongoDB');
      return NextResponse.json({
        error: 'Insert not acknowledged',
        details: 'The database did not acknowledge the insert operation'
      }, { status: 500 });
    }

    console.log('Post created successfully with ID:', result.insertedId);
    return NextResponse.json({ 
      success: true,
      id: result.insertedId,
      message: 'Post created successfully'
    });
  } catch (error) {
    console.error('Detailed error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json({ 
      error: 'Failed to create post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
