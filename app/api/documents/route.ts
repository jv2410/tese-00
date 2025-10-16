import { NextRequest, NextResponse } from 'next/server';
import { state } from '@/lib/state';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    console.log(`[LIST DOCS] Total docs in memory: ${state.docs.size}`);
    console.log(`[LIST DOCS] Document IDs:`, Array.from(state.docs.keys()));

    const docs = Array.from(state.docs.values()).map((doc) => ({
      id: doc.id,
      title: doc.title,
      pages: doc.pages,
      chunksCount: doc.chunks.length
    }));

    return NextResponse.json({ documents: docs });
  } catch (error: any) {
    console.error('Documents list error:', error);
    return NextResponse.json(
      { error: `Failed to list documents: ${error.message}` },
      { status: 500 }
    );
  }
}
