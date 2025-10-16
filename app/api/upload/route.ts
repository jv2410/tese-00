import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm } from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Disable body parsing, we'll use formidable
export const config = {
  api: {
    bodyParser: false,
  },
};

async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), 'tmp', 'uploads');
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
  return uploadDir;
}

export async function POST(request: NextRequest) {
  try {
    const uploadDir = await ensureUploadDir();
    const documentId = randomUUID();

    // Convert NextRequest to Node.js request format
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const ext = path.extname(file.name).toLowerCase();
    if (!['.pdf', '.docx', '.txt'].includes(ext)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Only PDF, DOCX, and TXT are allowed.' },
        { status: 400 }
      );
    }

    // Save file
    const fileName = `${documentId}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      documentId,
      fileName: file.name,
      filePath
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: `Upload failed: ${error.message}` },
      { status: 500 }
    );
  }
}
