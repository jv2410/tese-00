import { NextRequest, NextResponse } from 'next/server';
import { Document, Packer, Paragraph, TextRun, FootnoteReferenceRun, Footnote } from 'docx';
import { state } from '@/lib/state';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { documentId, answerText, citations } = await request.json();

    if (!documentId || !answerText) {
      return NextResponse.json(
        { error: 'Missing documentId or answerText' },
        { status: 400 }
      );
    }

    // Get document info
    const doc = state.docs.get(documentId);
    const title = doc ? doc.title : 'Document';

    // Create footnotes for citations
    const footnotes: Record<number, Footnote> = {};
    const citationsArray = citations || [];

    citationsArray.forEach((citation: any, idx: number) => {
      footnotes[idx + 1] = new Footnote({
        id: idx + 1,
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `Página ${citation.page}, ${citation.span}`,
                size: 18
              })
            ]
          })
        ]
      });
    });

    // Split text into paragraphs
    const paragraphs = answerText.split('\n').map((line: string) => {
      return new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 24
          })
        ],
        spacing: {
          after: 200
        }
      });
    });

    // Create document
    const docx = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Resposta - ${title}`,
                  bold: true,
                  size: 32
                })
              ],
              spacing: {
                after: 400
              }
            }),
            ...paragraphs
          ],
          footers: {}
        }
      ],
      footnotes
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(docx);

    // Return as download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="resposta-${documentId}.docx"`
      }
    });
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: `Export failed: ${error.message}` },
      { status: 500 }
    );
  }
}
