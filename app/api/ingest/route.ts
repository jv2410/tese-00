import { NextRequest, NextResponse } from 'next/server';
import { state, buildIndex } from '@/lib/state';
import { parseDocument } from '@/lib/parsers';
import { chunkText } from '@/lib/chunking';
import path from 'path';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { documentId, filePath, fileName } = await request.json();

    if (!documentId || !filePath) {
      return NextResponse.json(
        { error: 'Missing documentId or filePath' },
        { status: 400 }
      );
    }

    // Parse document
    const { text, pages } = await parseDocument(filePath);

    // Chunk text
    const chunks = chunkText(text, pages);

    // Build search index
    const index = buildIndex(chunks);

    // Store in memory
    state.docs.set(documentId, {
      id: documentId,
      title: fileName || path.basename(filePath),
      pages,
      pathTmp: filePath,
      chunks,
      index
    });

    console.log(`[INGEST] Document stored: ${documentId}`);
    console.log(`[INGEST] Total docs in memory: ${state.docs.size}`);
    console.log(`[INGEST] Document IDs:`, Array.from(state.docs.keys()));

    return NextResponse.json({
      documentId,
      title: fileName || path.basename(filePath),
      pages,
      chunksCount: chunks.length
    });
  } catch (error: any) {
    console.error('Ingest error:', error);
    return NextResponse.json(
      { error: `Ingest failed: ${error.message}` },
      { status: 500 }
    );
  }
}
