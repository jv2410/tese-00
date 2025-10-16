import { NextRequest, NextResponse } from 'next/server';
import { state } from '@/lib/state';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[GET DOC] Looking for document: ${id}`);
    console.log(`[GET DOC] Total docs in memory: ${state.docs.size}`);
    console.log(`[GET DOC] Document IDs:`, Array.from(state.docs.keys()));
    const doc = state.docs.get(id);

    if (!doc) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: doc.id,
      title: doc.title,
      pages: doc.pages,
      chunksCount: doc.chunks.length
    });
  } catch (error: any) {
    console.error('Document get error:', error);
    return NextResponse.json(
      { error: `Failed to get document: ${error.message}` },
      { status: 500 }
    );
  }
}
